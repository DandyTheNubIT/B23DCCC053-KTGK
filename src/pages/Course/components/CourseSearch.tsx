import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Space, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

interface CourseSearchProps {
  defaultValue?: string;
  onSearch: (searchValue: string) => void;
  loading?: boolean;
  placeholder?: string;
}

/**
 * Component tìm kiếm khóa học
 * Cho phép người dùng nhập từ khóa và tìm kiếm ngay lập tức hoặc sau khi nhấn nút
 */
const CourseSearch: React.FC<CourseSearchProps> = ({
  defaultValue = '',
  onSearch,
  loading = false,
  placeholder = 'Tìm kiếm theo tên khóa học',
}) => {
  const [searchValue, setSearchValue] = useState<string>(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState<string>(defaultValue);

  // Cập nhật giá trị tìm kiếm khi props thay đổi
  useEffect(() => {
    setSearchValue(defaultValue);
    setDebouncedValue(defaultValue);
  }, [defaultValue]);

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500); // Delay 500ms

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Tự động tìm kiếm khi debounced value thay đổi
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Xử lý khi người dùng nhập
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearchClick = () => {
    setDebouncedValue(searchValue); // Bỏ qua debounce và tìm kiếm ngay lập tức
  };

  // Xử lý khi người dùng xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchValue('');
    setDebouncedValue('');
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={8}>
        <Col flex="auto">
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onPressEnter={handleSearchClick}
            prefix={<SearchOutlined />}
            allowClear
            disabled={loading}
          />
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearchClick}
              loading={loading}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={handleClearSearch}
              icon={<ClearOutlined />}
              disabled={!searchValue || loading}
            >
              Xóa
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseSearch;