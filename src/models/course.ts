import React, { useState, useCallback, createContext, useContext } from 'react';
import { message } from 'antd';
import { 
  getKhoaHocById, 
  addKhoaHoc, 
  updateKhoaHoc, 
  deleteKhoaHoc as deleteKhoaHocService,
  filterKhoaHocList,
  getGiangVienList
} from '@/services/Course';
import { KhoaHoc, KhoaHocFormData, KhoaHocFilter, TrangThaiKhoaHoc, GiangVien } from '@/services/Course/typing.d';

// Type định nghĩa cho model
export type CourseModelType = {
  // State
  khoaHocList: KhoaHoc[];
  giangVienList: GiangVien[];
  loading: boolean;
  selectedKhoaHoc: KhoaHoc | null;
  formVisible: boolean;
  editMode: boolean;
  filter: KhoaHocFilter;
  
  // Actions
  loadKhoaHocList: () => Promise<void>;
  loadGiangVienList: () => Promise<void>;
  updateFilter: (newFilter: Partial<KhoaHocFilter>) => void;
  deleteKhoaHoc: (id: string) => Promise<void>;
  editKhoaHoc: (id: string) => void;
  handleAdd: () => void;
  handleCloseForm: () => void;
  saveKhoaHoc: (values: KhoaHocFormData) => Promise<void>;
  init: () => void;
  getTrangThaiOptions: () => { value: TrangThaiKhoaHoc; label: string }[];
};

// Context cho CourseModel
const CourseContext = createContext<CourseModelType | null>(null);

/**
 * Custom hook model cho quản lý khóa học
 */
export function useCourseModel(): CourseModelType {
  // State quản lý danh sách khóa học
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  // State quản lý danh sách giảng viên
  const [giangVienList, setGiangVienList] = useState<GiangVien[]>([]);
  // State quản lý trạng thái loading
  const [loading, setLoading] = useState<boolean>(false);
  // State quản lý khóa học đang được chọn để chỉnh sửa
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<KhoaHoc | null>(null);
  // State quản lý việc hiển thị modal
  const [formVisible, setFormVisible] = useState<boolean>(false);
  // State quản lý chế độ chỉnh sửa hay thêm mới
  const [editMode, setEditMode] = useState<boolean>(false);
  // State quản lý filter
  const [filter, setFilter] = useState<KhoaHocFilter>({
    sortBy: 'tenKhoaHoc',
    sortDirection: 'asc'
  });

  /**
   * Load danh sách khóa học từ localStorage
   */
  const loadKhoaHocList = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng filterKhoaHocList đã bao gồm logic lấy dữ liệu từ localStorage
      // và áp dụng bộ lọc
      const data = filterKhoaHocList(filter);
      setKhoaHocList(data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách khóa học');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  /**
   * Load danh sách giảng viên từ localStorage
   */
  const loadGiangVienList = useCallback(async () => {
    try {
      const data = getGiangVienList();
      setGiangVienList(data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách giảng viên');
      console.error(error);
    }
  }, []);

  /**
   * Cập nhật bộ lọc và tải lại danh sách
   */
  const updateFilter = useCallback((newFilter: Partial<KhoaHocFilter>) => {
    setFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  }, []);

  /**
   * Xóa khóa học
   */
  const deleteKhoaHoc = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteKhoaHocService(id);
      message.success('Xóa khóa học thành công');
      await loadKhoaHocList();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Có lỗi xảy ra khi xóa khóa học');
      }
    } finally {
      setLoading(false);
    }
  }, [loadKhoaHocList]);

  /**
   * Chỉnh sửa khóa học
   */
  const editKhoaHoc = useCallback((id: string) => {
    const khoaHoc = getKhoaHocById(id);
    if (khoaHoc) {
      setSelectedKhoaHoc(khoaHoc);
      setEditMode(true);
      setFormVisible(true);
    } else {
      message.error('Không tìm thấy thông tin khóa học');
    }
  }, []);

  /**
   * Mở modal thêm mới khóa học
   */
  const handleAdd = useCallback(() => {
    setSelectedKhoaHoc(null);
    setEditMode(false);
    setFormVisible(true);
  }, []);

  /**
   * Đóng form và reset trạng thái
   */
  const handleCloseForm = useCallback(() => {
    setFormVisible(false);
    setSelectedKhoaHoc(null);
  }, []);

  /**
   * Lưu khóa học (thêm mới hoặc cập nhật)
   */
  const saveKhoaHoc = useCallback(async (values: KhoaHocFormData) => {
    setLoading(true);
    try {
      if (editMode && selectedKhoaHoc) {
        await updateKhoaHoc(selectedKhoaHoc.id, values);
        message.success('Cập nhật khóa học thành công');
      } else {
        await addKhoaHoc(values);
        message.success('Thêm mới khóa học thành công');
      }
      handleCloseForm();
      await loadKhoaHocList();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Có lỗi xảy ra khi lưu khóa học');
      }
    } finally {
      setLoading(false);
    }
  }, [editMode, selectedKhoaHoc, handleCloseForm, loadKhoaHocList]);

  /**
   * Khởi tạo model khi component được mount
   */
  const init = useCallback(() => {
    loadGiangVienList();
    loadKhoaHocList();
  }, [loadGiangVienList, loadKhoaHocList]);

  // Trả về các state và handler functions
  return {
    // State
    khoaHocList,
    giangVienList,
    loading,
    selectedKhoaHoc,
    formVisible,
    editMode,
    filter,
    
    // Actions
    loadKhoaHocList,
    loadGiangVienList,
    updateFilter,
    deleteKhoaHoc,
    editKhoaHoc,
    handleAdd,
    handleCloseForm,
    saveKhoaHoc,
    init,

    getTrangThaiOptions: () => [
      { value: TrangThaiKhoaHoc.DANG_MO, label: 'Đang mở' },
      { value: TrangThaiKhoaHoc.DA_KET_THUC, label: 'Đã kết thúc' },
      { value: TrangThaiKhoaHoc.TAM_DUNG, label: 'Tạm dừng' },
    ],
  };
}

// Provider component
export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const model = useCourseModel();
  return React.createElement(CourseContext.Provider, { value: model }, children);
};

// Custom hook để sử dụng context
export const useModel = (): CourseModelType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useModel must be used within a CourseProvider');
  }
  return context;
};

export default useModel;