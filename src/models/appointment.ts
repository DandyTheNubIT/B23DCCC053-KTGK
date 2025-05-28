import { useState, useCallback } from 'react';
import { message } from 'antd';

// Định nghĩa các interface
declare namespace Appointment {
  interface AppointmentData {
    id: number;
    serviceId: number;
    employeeId?: number;
    customerName: string;
    customerPhone: string;
    appointmentDate: string;
    appointmentTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
  }
}

interface Employee {
  id: number;
  name: string;
  services: number[];
  workingHours?: {
    start: string;
    end: string;
  };
  dailyLimit: number;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface AvailabilityResult {
  available: boolean;
  message?: string;
  employees?: Array<{ id: number; name: string }>;
  suggestedTimes?: Array<{
    time: string;
    employeeName: string;
    employeeId: number;
  }>;
}

interface AvailableTimeSlot {
  time: string;
  employeeName: string;
  employeeId: number;
}

export default function useAppointmentModel() {
  const [appointments, setAppointments] = useState<Appointment.AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm lấy dữ liệu từ localStorage
  const getStoredAppointments = useCallback((): Appointment.AppointmentData[] => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Hàm lưu dữ liệu vào localStorage
  const saveToStorage = useCallback((data: Appointment.AppointmentData[]): void => {
    localStorage.setItem('appointments', JSON.stringify(data));
    setAppointments(data);
  }, []);

  // Tải danh sách lịch hẹn
  const loadAppointments = useCallback((): void => {
    setLoading(true);
    try {
      const data = getStoredAppointments();
      setAppointments(data);
    } catch (error) {
      message.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  }, [getStoredAppointments]);

  // Tạo lịch hẹn mới
  const createAppointment = useCallback((
    data: Omit<Appointment.AppointmentData, 'id' | 'createdAt' | 'status'>
  ): Appointment.AppointmentData => {
    setLoading(true);
    try {
      const currentAppointments = getStoredAppointments();
      const newAppointment: Appointment.AppointmentData = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      const updatedAppointments = [...currentAppointments, newAppointment];
      saveToStorage(updatedAppointments);
      message.success('Đặt lịch thành công!');
      return newAppointment;
    } catch (error) {
      message.error('Không thể tạo lịch hẹn');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getStoredAppointments, saveToStorage]);

  // Cập nhật trạng thái lịch hẹn
  const updateAppointmentStatus = useCallback((
    id: number, 
    status: Appointment.AppointmentData['status'], 
    employeeId?: number
  ): void => {
    setLoading(true);
    try {
      const currentAppointments = getStoredAppointments();
      const updatedAppointments = currentAppointments.map(appointment => 
        appointment.id === id ? { 
          ...appointment, 
          status, 
          ...(employeeId ? { employeeId } : {}) 
        } : appointment
      );
      
      saveToStorage(updatedAppointments);
      message.success(`Cập nhật trạng thái lịch hẹn thành công!`);
    } catch (error) {
      message.error('Không thể cập nhật trạng thái lịch hẹn');
    } finally {
      setLoading(false);
    }
  }, [getStoredAppointments, saveToStorage]);

  // Tìm thời gian rảnh tiếp theo
  const findNextAvailableTimes = (
    employees: Employee[], 
    appointments: Appointment.AppointmentData[], 
    date: string, 
    time: string, 
    duration: number
  ): AvailableTimeSlot[] => {
    // Tạo mảng các thời gian làm việc có thể (ví dụ: từ 8:00 đến 18:00, mỗi 30 phút)
    const workingHours: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      workingHours.push(`${hour.toString().padStart(2, '0')}:00`);
      workingHours.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Lọc các thời gian sau thời gian hiện tại
    const currentTimeIndex = workingHours.indexOf(time);
    const futureTimeSlots = currentTimeIndex >= 0 ? workingHours.slice(currentTimeIndex + 1) : workingHours;
    
    // Kiểm tra từng khoảng thời gian
    const availableTimeSlots: AvailableTimeSlot[] = [];
    
    for (const timeSlot of futureTimeSlots) {
      for (const employee of employees) {
        // Kiểm tra thời gian làm việc
        const workStart = employee.workingHours?.start;
        const workEnd = employee.workingHours?.end;
        
        if (!workStart || !workEnd) continue;
        if (timeSlot < workStart || timeSlot > workEnd) continue;
        
        // Kiểm tra số lượng khách trong ngày
        const dailyAppointments = appointments.filter(app => 
          app.employeeId === employee.id && 
          app.appointmentDate === date && 
          ['pending', 'confirmed'].includes(app.status)
        );
        
        if (dailyAppointments.length >= employee.dailyLimit) continue;
        
        // Kiểm tra lịch trình đã đặt
        const conflictingAppointments = appointments.filter(app => 
          app.employeeId === employee.id && 
          app.appointmentDate === date && 
          app.appointmentTime === timeSlot && 
          ['pending', 'confirmed'].includes(app.status)
        );
        
        if (conflictingAppointments.length === 0) {
          availableTimeSlots.push({
            time: timeSlot,
            employeeName: employee.name,
            employeeId: employee.id
          });
          break; // Chỉ cần tìm một nhân viên rảnh cho mỗi khoảng thời gian
        }
      }
      
      // Chỉ lấy tối đa 5 gợi ý
      if (availableTimeSlots.length >= 5) break;
    }
    
    return availableTimeSlots;
  };

  // Kiểm tra nhân viên có rảnh vào thời điểm đó không
  const checkEmployeeAvailability = useCallback((
    serviceId: number, 
    date: string, 
    time: string
  ): AvailabilityResult => {
    try {
      // Lấy dữ liệu dịch vụ và nhân viên từ localStorage
      const services: Service[] = JSON.parse(localStorage.getItem('services') || '[]');
      const employees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
      const currentAppointments: Appointment.AppointmentData[] = getStoredAppointments();
      
      // Tìm dịch vụ được chọn
      const selectedService = services.find(service => service.id === serviceId);
      if (!selectedService) return { available: false, message: 'Không tìm thấy dịch vụ' };
      
      // Tìm nhân viên có thể làm dịch vụ này
      const qualifiedEmployees = employees.filter(employee => 
        employee.services.includes(serviceId)
      );
      
      if (qualifiedEmployees.length === 0) {
        return { available: false, message: 'Không có nhân viên phù hợp cho dịch vụ này' };
      }
      
      // Kiểm tra thời gian làm việc của từng nhân viên
      const availableEmployees = qualifiedEmployees.filter(employee => {
        // Kiểm tra thời gian làm việc
        const workStart = employee.workingHours?.start;
        const workEnd = employee.workingHours?.end;
        
        if (!workStart || !workEnd) return false;
        
        // Kiểm tra nếu thời gian đặt nằm trong khoảng làm việc
        const requestTime = time;
        if (requestTime < workStart || requestTime > workEnd) return false;
        
        // Kiểm tra số lượng khách trong ngày
        const dailyAppointments = currentAppointments.filter(app => 
          app.employeeId === employee.id && 
          app.appointmentDate === date && 
          ['pending', 'confirmed'].includes(app.status)
        );
        
        if (dailyAppointments.length >= employee.dailyLimit) return false;
        
        // Kiểm tra lịch trình đã đặt
        const conflictingAppointments = currentAppointments.filter(app => 
          app.employeeId === employee.id && 
          app.appointmentDate === date && 
          app.appointmentTime === time && 
          ['pending', 'confirmed'].includes(app.status)
        );
        
        return conflictingAppointments.length === 0;
      });
      
      if (availableEmployees.length > 0) {
        return { 
          available: true, 
          employees: availableEmployees.map(emp => ({ id: emp.id, name: emp.name }))
        };
      }
      
      // Nếu không có nhân viên rảnh, tìm thời gian gần nhất có thể
      const suggestedTimes = findNextAvailableTimes(
        qualifiedEmployees, 
        currentAppointments, 
        date, 
        time, 
        selectedService.duration
      );
      
      return { 
        available: false, 
        message: 'Không có nhân viên rảnh vào thời điểm này',
        suggestedTimes 
      };
      
    } catch (error) {
      return { available: false, message: 'Đã xảy ra lỗi khi kiểm tra' };
    }
  }, [getStoredAppointments]);

  return {
    appointments,
    loading,
    loadAppointments,
    createAppointment,
    updateAppointmentStatus,
    checkEmployeeAvailability
  };
}