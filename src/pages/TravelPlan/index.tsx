import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from '@/models/travelplan';
import FilterSection from './components/FilterSection';
import DestinationList from './components/DestinationList';
import './Travel.less';

const TravelContent: React.FC = () => {
  const [form] = Form.useForm();
  const { 
    destinations, 
    loading, 
    filter,
    updateFilter,
    loadDestinations,
    init,
    getDestinationTypeOptions,
    getPriceLevelOptions
  } = useModel();

  // Khởi tạo dữ liệu khi component được mount
  useEffect(() => {
    init();
  }, [init]);

  // Xử lý khi submit form filter
  const handleFilterSubmit = (values: any) => {
    updateFilter({
      type: values.type,
      priceLevel: values.priceLevel,
      minRating: values.minRating,
      searchKey: values.searchKey
    });
  };

  // Reset filter về mặc định
  const resetFilter = () => {
    form.resetFields();
    updateFilter({
      type: undefined,
      priceLevel: undefined,
      minRating: undefined,
      searchKey: undefined
    });
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split('-');
    updateFilter({ sortBy, sortDirection });
  };

  return (
    <PageContainer
      className="travel-container"
      loading={loading}
      title="Khám phá điểm đến du lịch"
      content="Khám phá những điểm đến hấp dẫn cho chuyến du lịch của bạn"
      extra={[
        <Button 
          key="refresh" 
          icon={<ReloadOutlined />} 
          onClick={() => loadDestinations()} 
        >
          Làm mới
        </Button>
      ]}
    >
      {/* Phần filter */}
      <FilterSection 
        form={form}
        onFilterSubmit={handleFilterSubmit}
        onResetFilter={resetFilter}
        onSortChange={handleSortChange}
        typeOptions={getDestinationTypeOptions()}
        priceOptions={getPriceLevelOptions()}
      />

      {/* Danh sách điểm đến */}
      <DestinationList destinations={destinations} />
    </PageContainer>
  );
};

// Component chính bọc provider
const TravelPage: React.FC = () => {
  const { Provider } = require('@/models/travelplan');
  
  return (
    <Provider>
      <TravelContent />
    </Provider>
  );
};

export default TravelPage;