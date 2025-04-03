/**
 * Định nghĩa các kiểu dữ liệu cho module quản lý khóa học
 */

/**
 * Enum trạng thái khóa học
 */
export enum TrangThaiKhoaHoc {
  DANG_MO = 'DANG_MO',       // Khóa học đang mở
  DA_KET_THUC = 'DA_KET_THUC', // Khóa học đã kết thúc
  TAM_DUNG = 'TAM_DUNG'      // Khóa học tạm dừng
}

/**
 * Interface thông tin giảng viên
 */
export interface GiangVien {
  id: string;            // ID giảng viên
  hoTen: string;         // Họ tên giảng viên
  email: string;         // Email giảng viên
  soDienThoai?: string;  // Số điện thoại (không bắt buộc)
  chuyenMon: string;     // Chuyên môn
  moTa?: string;         // Mô tả thông tin thêm (không bắt buộc)
  createdAt?: number;    // Thời điểm tạo (timestamp)
  updatedAt?: number;    // Thời điểm cập nhật gần nhất (timestamp)
}

/**
 * Interface thông tin khóa học
 */
export interface KhoaHoc {
  id: string;                      // ID khóa học
  tenKhoaHoc: string;              // Tên khóa học (tối đa 100 ký tự)
  giangVienId: string;             // ID giảng viên phụ trách
  giangVien?: GiangVien;           // Thông tin giảng viên (được join từ danh sách giảng viên)
  soLuongHocVien: number;          // Số lượng học viên
  moTa: string;                    // Mô tả khóa học (HTML)
  trangThai: TrangThaiKhoaHoc;     // Trạng thái khóa học
  createdAt: number;               // Thời điểm tạo khóa học
  updatedAt: number;               // Thời điểm cập nhật khóa học gần nhất
}

/**
 * Interface dữ liệu form khóa học (dùng khi thêm mới/chỉnh sửa)
 */
export interface KhoaHocFormData {
  tenKhoaHoc: string;              // Tên khóa học
  giangVienId: string;             // ID giảng viên phụ trách
  soLuongHocVien: number;          // Số lượng học viên
  moTa: string;                    // Mô tả khóa học (HTML)
  trangThai: TrangThaiKhoaHoc;     // Trạng thái khóa học
}

/**
 * Interface cho bộ lọc và tìm kiếm khóa học
 */
export interface KhoaHocFilter {
  giangVienId?: string;            // Lọc theo giảng viên
  trangThai?: TrangThaiKhoaHoc;    // Lọc theo trạng thái
  searchKey?: string;              // Từ khóa tìm kiếm
  sortBy?: string;                 // Trường sắp xếp
  sortDirection?: 'asc' | 'desc';  // Hướng sắp xếp
}

/**
 * Interface tùy chọn hiển thị trong dropdown
 */
export interface SelectOption {
  value: string | number;          // Giá trị của tùy chọn
  label: string;                   // Nhãn hiển thị của tùy chọn
  disabled?: boolean;              // Trạng thái vô hiệu hóa (không bắt buộc)
}