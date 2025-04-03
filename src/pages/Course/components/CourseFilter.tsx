import React, { useEffect, useState } from 'react';
import { Card, Form, Select, Button, Row, Col, Input } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { getGiangVienList } from '@/services/Course';
import { GiangVien, TrangThaiKhoaHoc, KhoaHocFilter } from '@/services/Course/typing.d';

const { Option } = Select;

interface CourseFilterProps {
  loading: boolean;
  filter: KhoaHocFilter;
  onFilterChange: (filter: Partial<KhoaHocFilter>) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ loading, filter, onFilterChange }) => {
  const [form] = Form.useForm();
  const [giangVienList, setGiangVienList] = useState<GiangVien[]>([]);

  useEffect(() => {
    // Load danh sách giảng viên
    const giangVien = getGiangVienList();
    setGiangVienList(giangVien);
  }, []);

  // Cập nhật form khi filter props thay đổi
  useEffect(() => {
    form.setFieldsValue({
      searchKey: filter.searchKey,
      giangVienId: filter.giangVienId,
      trangThai: filter.trangThai,
    });
  }, [filter, form]);

  const handleSearch = (values: any) => {
    onFilterChange(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({
      giangVienId: undefined,
      trangThai: undefined,
      searchKey: undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    // Debounce search input (optional)
    const handler = setTimeout(() => {
      onFilterChange({ searchKey: searchValue });
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={filter}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8} md={8} lg={7}>
            <Form.Item name="searchKey" label="Tìm kiếm">
              <Input 
                placeholder="Nhập tên khóa học" 
                prefix={<SearchOutlined />} 
                allowClear
                onChange={handleSearchChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6} lg={5}>
            <Form.Item name="giangVienId" label="Giảng viên">
              <Select 
                placeholder="Chọn giảng viên" 
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {giangVienList.map(gv => (
                  <Option key={gv.id} value={gv.id}>{gv.hoTen}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6} lg={5}>
            <Form.Item name="trangThai" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={TrangThaiKhoaHoc.DANG_MO}>Đang mở</Option>
                <Option value={TrangThaiKhoaHoc.DA_KET_THUC}>Đã kết thúc</Option>
                <Option value={TrangThaiKhoaHoc.TAM_DUNG}>Tạm dừng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4} lg={7} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<FilterOutlined />}
                style={{ marginRight: 8 }}
              >
                Lọc
              </Button>
              <Button 
                onClick={handleReset} 
                icon={<ReloadOutlined />}
              >
                Đặt lại
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CourseFilter;