import React from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Slider 
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined
} from '@ant-design/icons';
import { DestinationType, PriceLevel, DestinationFilter } from '@/services/TravelPlan/typing.d';

const { Title } = Typography;
const { Option } = Select;

interface FilterSectionProps {
  form: any;
  onFilterSubmit: (values: any) => void;
  onResetFilter: () => void;
  onSortChange: (value: string) => void;
  typeOptions: { value: DestinationType; label: string }[];
  priceOptions: { value: PriceLevel; label: string }[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  form,
  onFilterSubmit,
  onResetFilter,
  onSortChange,
  typeOptions,
  priceOptions
}) => {
  return (
    <Card className="filter-section">
      <div className="filter-title">
        <Title level={4}>
          <FilterOutlined /> Bộ lọc
        </Title>
        <div>
          <Select 
            defaultValue="rating-desc" 
            style={{ width: 180, marginRight: 8 }}
            onChange={onSortChange} 
          >
            <Option value="rating-desc">Đánh giá cao nhất</Option>
            <Option value="rating-asc">Đánh giá thấp nhất</Option>
            <Option value="name-asc">Tên A-Z</Option>
            <Option value="name-desc">Tên Z-A</Option>
          </Select>
        </div>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFilterSubmit}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Form.Item name="searchKey" label="Tìm kiếm">
              <Input 
                placeholder="Tìm kiếm điểm đến, địa điểm..." 
                prefix={<SearchOutlined />} 
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Form.Item name="type" label="Loại hình">
              <Select placeholder="Chọn loại hình" allowClear>
                {typeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Form.Item name="priceLevel" label="Mức giá">
              <Select placeholder="Chọn mức giá" allowClear>
                {priceOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Form.Item name="minRating" label="Đánh giá tối thiểu">
              <Slider 
                min={1} 
                max={5} 
                step={0.5} 
                marks={{ 1: '1', 3: '3', 5: '5' }} 
                tooltip={{ formatter: value => `${value} sao` }} 
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="filter-actions">
          <Button onClick={onResetFilter} style={{ marginRight: 8 }}>
            Đặt lại
          </Button>
          <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
            Áp dụng
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FilterSection;