/**
 * Định nghĩa các kiểu dữ liệu cho module lập kế hoạch du lịch
 */

/**
 * Enum loại hình điểm đến
 */
export enum DestinationType {
  BEACH = 'BEACH',      // Biển
  MOUNTAIN = 'MOUNTAIN', // Núi
  CITY = 'CITY'         // Thành phố
}

/**
 * Enum mức giá
 */
export enum PriceLevel {
  LOW = 'LOW',          // Giá thấp
  MEDIUM = 'MEDIUM',    // Giá trung bình
  HIGH = 'HIGH'         // Giá cao
}

/**
 * Interface thông tin điểm đến
 */
export interface Destination {
  id: string;                  // ID điểm đến
  name: string;                // Tên điểm đến
  location: string;            // Vị trí
  description: string;         // Mô tả
  imageUrl: string;            // Đường dẫn hình ảnh
  rating: number;              // Đánh giá (1-5)
  type: DestinationType;       // Loại hình
  priceLevel: PriceLevel;      // Mức giá
}

/**
 * Interface cho bộ lọc và tìm kiếm điểm đến
 */
export interface DestinationFilter {
  type?: DestinationType;     // Lọc theo loại hình
  priceLevel?: PriceLevel;    // Lọc theo mức giá
  minRating?: number;         // Lọc theo đánh giá tối thiểu
  searchKey?: string;         // Từ khóa tìm kiếm
  sortBy?: string;            // Trường sắp xếp
  sortDirection?: 'asc' | 'desc'; // Hướng sắp xếp
}