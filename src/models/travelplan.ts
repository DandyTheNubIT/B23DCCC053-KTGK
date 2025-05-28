import React, { useState, useCallback, createContext, useContext } from 'react';
import { 
  filterDestinations,
  getDestinations
} from '@/services/TravelPlan';
import { 
  Destination, 
  DestinationFilter, 
  DestinationType, 
  PriceLevel 
} from '@/services/TravelPlan/typing.d';

// Type định nghĩa cho model
export type DestinationModelType = {
  // State
  destinations: Destination[];
  loading: boolean;
  filter: DestinationFilter;
  
  // Actions
  loadDestinations: () => Promise<void>;
  updateFilter: (newFilter: Partial<DestinationFilter>) => void;
  init: () => void;
  getDestinationTypeOptions: () => { value: DestinationType; label: string }[];
  getPriceLevelOptions: () => { value: PriceLevel; label: string }[];
};

// Context cho DestinationModel
const DestinationContext = createContext<DestinationModelType | null>(null);

/**
 * Custom hook model cho quản lý điểm đến du lịch
 */
export function useDestinationModel(): DestinationModelType {
  // State quản lý danh sách điểm đến
  const [destinations, setDestinations] = useState<Destination[]>([]);
  // State quản lý trạng thái loading
  const [loading, setLoading] = useState<boolean>(false);
  // State quản lý filter
  const [filter, setFilter] = useState<DestinationFilter>({
    sortBy: 'rating',
    sortDirection: 'desc'
  });

  /**
   * Load danh sách điểm đến từ localStorage
   */
  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const data = filterDestinations(filter);
      setDestinations(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách điểm đến:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  /**
   * Cập nhật bộ lọc và tải lại danh sách
   */
  const updateFilter = useCallback((newFilter: Partial<DestinationFilter>) => {
    setFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  }, []);

  /**
   * Khởi tạo model khi component được mount
   */
  const init = useCallback(() => {
    // Đảm bảo dữ liệu mẫu được khởi tạo
    getDestinations();
    loadDestinations();
  }, [loadDestinations]);

  /**
   * Lấy danh sách options cho dropdown loại hình điểm đến
   */
  const getDestinationTypeOptions = useCallback(() => {
    return [
      { value: DestinationType.BEACH, label: 'Biển' },
      { value: DestinationType.MOUNTAIN, label: 'Núi' },
      { value: DestinationType.CITY, label: 'Thành phố' }
    ];
  }, []);

  /**
   * Lấy danh sách options cho dropdown mức giá
   */
  const getPriceLevelOptions = useCallback(() => {
    return [
      { value: PriceLevel.LOW, label: 'Giá thấp' },
      { value: PriceLevel.MEDIUM, label: 'Giá trung bình' },
      { value: PriceLevel.HIGH, label: 'Giá cao' }
    ];
  }, []);

  // Trả về các state và handler functions
  return {
    // State
    destinations,
    loading,
    filter,
    
    // Actions
    loadDestinations,
    updateFilter,
    init,
    getDestinationTypeOptions,
    getPriceLevelOptions,
  };
}

// Provider component
export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const model = useDestinationModel();
  return React.createElement(DestinationContext.Provider, { value: model }, children);
};

// Custom hook để sử dụng context
export const useModel = (): DestinationModelType => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useModel must be used within a DestinationProvider');
  }
  return context;
};

export default useModel;