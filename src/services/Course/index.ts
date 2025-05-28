import { KhoaHoc, KhoaHocFormData, GiangVien, TrangThaiKhoaHoc, KhoaHocFilter } from './typing.d';

/**
 * Lấy danh sách khóa học từ localStorage
 * @returns Danh sách khóa học
 */
export const getKhoaHocList = (): KhoaHoc[] => {
  const khoaHocData = localStorage.getItem('khoahoc');
  if (!khoaHocData) return [];
  try {
    return JSON.parse(khoaHocData);
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu khóa học:', error);
    return [];
  }
};

/**
 * Lưu danh sách khóa học vào localStorage
 * @param khoaHocList Danh sách khóa học cần lưu
 */
export const saveKhoaHocList = (khoaHocList: KhoaHoc[]): void => {
  localStorage.setItem('khoahoc', JSON.stringify(khoaHocList));
};

/**
 * Lấy danh sách giảng viên từ localStorage
 * @returns Danh sách giảng viên
 */
export const getGiangVienList = (): GiangVien[] => {
  const giangVienData = localStorage.getItem('giangvien');
  
  // Nếu đã có dữ liệu, trả về từ localStorage
  if (giangVienData) {
    try {
      const parsedData = JSON.parse(giangVienData);
      if (parsedData.length > 0) {
        return parsedData;
      }
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu giảng viên:', error);
    }
  }
  
  // Nếu không có dữ liệu, tạo dữ liệu mẫu
  const sampleGiangVien: GiangVien[] = Array.from({ length: 20 }, (_, index) => ({
    id: `gv_${index + 1}`,
    hoTen: `Giảng viên ${index + 1}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
  
  // Lưu vào localStorage và trả về
  localStorage.setItem('giangvien', JSON.stringify(sampleGiangVien));
  return sampleGiangVien;
};

/**
 * Lưu danh sách giảng viên vào localStorage
 * @param giangVienList Danh sách giảng viên cần lưu
 */
export const saveGiangVienList = (giangVienList: GiangVien[]): void => {
  localStorage.setItem('giangvien', JSON.stringify(giangVienList));
};

/**
 * Lấy thông tin khóa học theo ID
 * @param id ID khóa học cần tìm
 * @returns Thông tin khóa học hoặc null nếu không tìm thấy
 */
export const getKhoaHocById = (id: string): KhoaHoc | null => {
  const khoaHocList = getKhoaHocList();
  return khoaHocList.find(khoaHoc => khoaHoc.id === id) || null;
};

/**
 * Chuẩn hóa dữ liệu khóa học trước khi lưu
 * @param data Dữ liệu khóa học cần chuẩn hóa
 * @returns Dữ liệu khóa học đã chuẩn hóa
 */
const normalizeKhoaHocData = (data: KhoaHocFormData): KhoaHocFormData => {
  return {
    ...data,
    tenKhoaHoc: data.tenKhoaHoc.trim(),
    soLuongHocVien: Math.max(0, data.soLuongHocVien || 0),
  };
};

/**
 * Thêm khóa học mới
 * @param khoaHoc Thông tin khóa học cần thêm
 * @returns Thông tin khóa học đã thêm
 */
export const addKhoaHoc = (khoaHoc: KhoaHocFormData): KhoaHoc => {
  const khoaHocList = getKhoaHocList();
  
  // Chuẩn hóa dữ liệu
  const normalizedData = normalizeKhoaHocData(khoaHoc);
  
  // Kiểm tra tên khóa học
  if (normalizedData.tenKhoaHoc.length > 100) {
    throw new Error('Tên khóa học không được vượt quá 100 ký tự');
  }
  
  // Kiểm tra tên khóa học trùng
  const existingKhoaHoc = khoaHocList.find(k => k.tenKhoaHoc === normalizedData.tenKhoaHoc);
  if (existingKhoaHoc) {
    throw new Error('Tên khóa học đã tồn tại');
  }
  
  const now = Date.now();
  const newKhoaHoc: KhoaHoc = {
    ...normalizedData,
    id: `kh_${now}`,
    createdAt: now,
    updatedAt: now,
  };
  
  khoaHocList.push(newKhoaHoc);
  saveKhoaHocList(khoaHocList);
  
  return newKhoaHoc;
};

/**
 * Cập nhật khóa học
 * @param id ID khóa học cần cập nhật
 * @param khoaHoc Thông tin khóa học mới
 * @returns Thông tin khóa học đã cập nhật
 */
export const updateKhoaHoc = (id: string, khoaHoc: KhoaHocFormData): KhoaHoc => {
  const khoaHocList = getKhoaHocList();
  const index = khoaHocList.findIndex(k => k.id === id);
  
  if (index === -1) {
    throw new Error('Không tìm thấy khóa học');
  }
  
  // Chuẩn hóa dữ liệu
  const normalizedData = normalizeKhoaHocData(khoaHoc);
  
  // Kiểm tra tên khóa học
  if (normalizedData.tenKhoaHoc.length > 100) {
    throw new Error('Tên khóa học không được vượt quá 100 ký tự');
  }
  
  // Kiểm tra tên khóa học trùng (trừ khóa học hiện tại)
  const duplicateName = khoaHocList.some(k => 
    k.tenKhoaHoc === normalizedData.tenKhoaHoc && k.id !== id
  );
  
  if (duplicateName) {
    throw new Error('Tên khóa học đã tồn tại');
  }
  
  const updatedKhoaHoc: KhoaHoc = {
    ...khoaHocList[index],
    ...normalizedData,
    updatedAt: Date.now(),
  };
  
  khoaHocList[index] = updatedKhoaHoc;
  saveKhoaHocList(khoaHocList);
  
  return updatedKhoaHoc;
};

/**
 * Xóa khóa học
 * @param id ID khóa học cần xóa
 * @returns true nếu xóa thành công
 */
export const deleteKhoaHoc = (id: string): boolean => {
  const khoaHocList = getKhoaHocList();
  const khoaHoc = khoaHocList.find(k => k.id === id);
  
  if (!khoaHoc) {
    throw new Error('Không tìm thấy khóa học');
  }
  
  // Kiểm tra điều kiện xóa: chỉ xóa được khóa học không có học viên
  if (khoaHoc.soLuongHocVien > 0) {
    throw new Error('Không thể xóa khóa học đã có học viên');
  }
  
  const newKhoaHocList = khoaHocList.filter(k => k.id !== id);
  saveKhoaHocList(newKhoaHocList);
  
  return true;
};

/**
 * Lấy danh sách khóa học đã gắn thông tin giảng viên
 * @returns Danh sách khóa học có thông tin giảng viên
 */
const getKhoaHocListWithGiangVien = (): KhoaHoc[] => {
  const khoaHocList = getKhoaHocList();
  const giangVienList = getGiangVienList();
  
  return khoaHocList.map(khoaHoc => ({
    ...khoaHoc,
    giangVien: giangVienList.find(gv => gv.id === khoaHoc.giangVienId)
  }));
};

/**
 * Lọc khóa học theo giảng viên
 * @param list Danh sách khóa học cần lọc
 * @param giangVienId ID giảng viên cần lọc
 * @returns Danh sách khóa học đã lọc
 */
const filterByGiangVien = (list: KhoaHoc[], giangVienId?: string): KhoaHoc[] => {
  if (!giangVienId) return list;
  return list.filter(item => item.giangVienId === giangVienId);
};

/**
 * Lọc khóa học theo trạng thái
 * @param list Danh sách khóa học cần lọc
 * @param trangThai Trạng thái cần lọc
 * @returns Danh sách khóa học đã lọc
 */
const filterByTrangThai = (list: KhoaHoc[], trangThai?: TrangThaiKhoaHoc): KhoaHoc[] => {
  if (!trangThai) return list;
  return list.filter(item => item.trangThai === trangThai);
};

/**
 * Tìm kiếm khóa học theo tên
 * @param list Danh sách khóa học cần tìm
 * @param searchKey Từ khóa tìm kiếm
 * @returns Danh sách khóa học phù hợp với từ khóa
 */
const searchByTenKhoaHoc = (list: KhoaHoc[], searchKey?: string): KhoaHoc[] => {
  if (!searchKey) return list;
  const searchLower = searchKey.toLowerCase();
  return list.filter(item => item.tenKhoaHoc.toLowerCase().includes(searchLower));
};

/**
 * Sắp xếp danh sách khóa học
 * @param list Danh sách khóa học cần sắp xếp
 * @param sortBy Trường cần sắp xếp
 * @param sortDirection Hướng sắp xếp ('asc' hoặc 'desc')
 * @returns Danh sách khóa học đã sắp xếp
 */
const sortKhoaHocList = (
  list: KhoaHoc[],
  sortBy?: string,
  sortDirection: 'asc' | 'desc' = 'asc'
): KhoaHoc[] => {
  if (!sortBy) return list;
  
  return [...list].sort((a, b) => {
    const direction = sortDirection === 'desc' ? -1 : 1;
    
    switch (sortBy) {
      case 'soLuongHocVien':
        return direction * (a.soLuongHocVien - b.soLuongHocVien);
      case 'tenKhoaHoc':
        return direction * a.tenKhoaHoc.localeCompare(b.tenKhoaHoc);
      case 'updatedAt':
        return direction * ((a.updatedAt || 0) - (b.updatedAt || 0));
      default:
        return 0;
    }
  });
};

/**
 * Lọc và tìm kiếm danh sách khóa học
 * @param filter Bộ lọc và tìm kiếm
 * @returns Danh sách khóa học đã lọc và tìm kiếm
 */
export const filterKhoaHocList = (filter: KhoaHocFilter): KhoaHoc[] => {
  // Lấy danh sách khóa học có thông tin giảng viên
  let khoaHocList = getKhoaHocListWithGiangVien();
  
  // Áp dụng bộ lọc
  khoaHocList = filterByGiangVien(khoaHocList, filter.giangVienId);
  khoaHocList = filterByTrangThai(khoaHocList, filter.trangThai);
  khoaHocList = searchByTenKhoaHoc(khoaHocList, filter.searchKey);
  
  // Sắp xếp kết quả
  return sortKhoaHocList(khoaHocList, filter.sortBy, filter.sortDirection);
};

/**
 * Lấy tên trạng thái khóa học
 * @param trangThai Trạng thái khóa học
 * @returns Tên trạng thái
 */
export const getTrangThaiText = (trangThai: TrangThaiKhoaHoc): string => {
  switch (trangThai) {
    case TrangThaiKhoaHoc.DANG_MO:
      return 'Đang mở';
    case TrangThaiKhoaHoc.DA_KET_THUC:
      return 'Đã kết thúc';
    case TrangThaiKhoaHoc.TAM_DUNG:
      return 'Tạm dừng';
    default:
      return 'Không xác định';
  }
};