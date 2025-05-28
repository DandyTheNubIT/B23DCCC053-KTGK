import { 
  Destination, 
  DestinationFilter, 
  DestinationType, 
  PriceLevel 
} from './typing.d';

/**
 * Lấy danh sách điểm đến từ localStorage
 * @returns Danh sách điểm đến
 */
export const getDestinations = (): Destination[] => {
  const destinationData = localStorage.getItem('destinations');
  if (!destinationData) return initializeDestinations();
  try {
    return JSON.parse(destinationData);
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu điểm đến:', error);
    return initializeDestinations();
  }
};

/**
 * Khởi tạo dữ liệu mẫu nếu chưa có
 */
export const initializeDestinations = (): Destination[] => {
  const sampleDestinations: Destination[] = [
    {
      id: 'dest_1',
      name: 'Vịnh Hạ Long',
      location: 'Quảng Ninh, Việt Nam',
      description: 'Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi',
      imageUrl: 'https://asiaholiday.com.vn/pic/Tour/tour-du-lich-ha-long-5_1821_HasThumb.jpg',
      rating: 4.8,
      type: DestinationType.BEACH,
      priceLevel: PriceLevel.MEDIUM
    },
    {
      id: 'dest_2',
      name: 'Phố cổ Hội An',
      location: 'Quảng Nam, Việt Nam',
      description: 'Phố cổ cổ kính với kiến trúc độc đáo và đèn lồng rực rỡ',
      imageUrl: 'https://moodhoian.vn/storage/photos/shares/H%E1%BB%99i%20An%20-%20%E2%80%9CTh%C3%A0nh%20ph%E1%BB%91%20c%E1%BB%A7a%20nh%E1%BB%AFng%20danh%20hi%E1%BB%87u%E2%80%9D%20hi%E1%BA%BFu%20kh%C3%A1ch%20b%E1%BA%ADc%20nh%E1%BA%A5t%20th%E1%BA%BF%20gi%E1%BB%9Bi/Pho-co-Hoi-An-feture.png',
      rating: 4.7,
      type: DestinationType.CITY,
      priceLevel: PriceLevel.LOW
    },
    {
      id: 'dest_3',
      name: 'Sa Pa',
      location: 'Lào Cai, Việt Nam',
      description: 'Thị trấn miền núi với ruộng bậc thang tuyệt đẹp và văn hóa dân tộc độc đáo',
      imageUrl: 'https://s-aicmscdn.vietnamhoinhap.vn/thumb/w_1000/vnhn-media/24/11/7/lao-cai--khai-thac-va-phat-huy-tiem-nang--the-manh-tang-cuong-thu-hut-dau-tu_672c8a13d71a2.jpg',
      rating: 4.5,
      type: DestinationType.MOUNTAIN,
      priceLevel: PriceLevel.MEDIUM
    },
    {
      id: 'dest_4',
      name: 'Đảo Phú Quốc',
      location: 'Kiên Giang, Việt Nam',
      description: 'Hòn đảo thiên đường với biển xanh cát trắng',
      imageUrl: 'https://vcdn1-dulich.vnecdn.net/2022/04/08/dulichPhuQuoc-1649392573-9234-1649405369.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=SU6n3IvJxW1Sla0xqg31Kg',
      rating: 4.6,
      type: DestinationType.BEACH,
      priceLevel: PriceLevel.HIGH
    },
    {
      id: 'dest_5',
      name: 'Thành phố Đà Lạt',
      location: 'Lâm Đồng, Việt Nam',
      description: 'Thành phố mộng mơ với khí hậu mát mẻ và cảnh quan thơ mộng',
      imageUrl: 'https://cdn.ahit.vn/thanhthanhtours/wp-content/uploads/2024/09/27161954/du-lich-Da-Lat-ivivu.jpg',
      rating: 4.5,
      type: DestinationType.CITY,
      priceLevel: PriceLevel.LOW
    },
    {
      id: 'dest_6',
      name: 'Mù Cang Chải',
      location: 'Yên Bái, Việt Nam',
      description: 'Ruộng bậc thang tuyệt đẹp đổi màu theo mùa',
      imageUrl: 'https://vcdn1-dulich.vnecdn.net/2024/09/24/mong-ngua-1727151303-1727151436.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=2Wq3ixBY3xCZJHCNbhIuCw',
      rating: 4.6,
      type: DestinationType.MOUNTAIN,
      priceLevel: PriceLevel.LOW
    }
  ];

  localStorage.setItem('destinations', JSON.stringify(sampleDestinations));
  return sampleDestinations;
};

/**
 * Lọc danh sách điểm đến theo loại
 */
const filterByType = (list: Destination[], type?: DestinationType): Destination[] => {
  if (!type) return list;
  return list.filter(item => item.type === type);
};

/**
 * Lọc danh sách điểm đến theo mức giá
 */
const filterByPriceLevel = (list: Destination[], priceLevel?: PriceLevel): Destination[] => {
  if (!priceLevel) return list;
  return list.filter(item => item.priceLevel === priceLevel);
};

/**
 * Lọc danh sách điểm đến theo đánh giá tối thiểu
 */
const filterByRating = (list: Destination[], minRating?: number): Destination[] => {
  if (!minRating) return list;
  return list.filter(item => item.rating >= minRating);
};

/**
 * Tìm kiếm điểm đến theo tên hoặc địa điểm
 */
const searchDestinations = (list: Destination[], searchKey?: string): Destination[] => {
  if (!searchKey) return list;
  const searchLower = searchKey.toLowerCase();
  return list.filter(item => 
    item.name.toLowerCase().includes(searchLower) || 
    item.location.toLowerCase().includes(searchLower)
  );
};

/**
 * Sắp xếp danh sách điểm đến
 */
const sortDestinations = (
  list: Destination[],
  sortBy?: string,
  sortDirection: 'asc' | 'desc' = 'asc'
): Destination[] => {
  if (!sortBy) return list;
  
  return [...list].sort((a, b) => {
    const direction = sortDirection === 'desc' ? -1 : 1;
    
    switch (sortBy) {
      case 'rating':
        return direction * (a.rating - b.rating);
      case 'name':
        return direction * a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};

/**
 * Lọc và tìm kiếm danh sách điểm đến du lịch
 */
export const filterDestinations = (filter: DestinationFilter): Destination[] => {
  let destinations = getDestinations();
  
  destinations = filterByType(destinations, filter.type);
  destinations = filterByPriceLevel(destinations, filter.priceLevel);
  destinations = filterByRating(destinations, filter.minRating);
  destinations = searchDestinations(destinations, filter.searchKey);
  
  return sortDestinations(destinations, filter.sortBy, filter.sortDirection);
};

/**
 * Lấy tên loại hình điểm đến
 */
export const getDestinationTypeName = (type: DestinationType): string => {
  switch (type) {
    case DestinationType.BEACH:
      return 'Biển';
    case DestinationType.MOUNTAIN:
      return 'Núi';
    case DestinationType.CITY:
      return 'Thành phố';
    default:
      return 'Không xác định';
  }
};

/**
 * Lấy tên mức giá
 */
export const getPriceLevelName = (priceLevel: PriceLevel): string => {
  switch (priceLevel) {
    case PriceLevel.LOW:
      return 'Giá thấp';
    case PriceLevel.MEDIUM:
      return 'Giá trung bình';
    case PriceLevel.HIGH:
      return 'Giá cao';
    default:
      return 'Không xác định';
  }
};