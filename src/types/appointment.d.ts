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