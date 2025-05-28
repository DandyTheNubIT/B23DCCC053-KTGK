import React, { useEffect } from 'react';
import { Card, Modal, Button, Table, Space, Popconfirm, Tag, Input, Select, Form, Row, Col } from 'antd';
import { useModel } from '@/models/course'; // Thay đổi import
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import KhoaHocForm from './components/CourseForm';
import { PageContainer } from '@ant-design/pro-layout';
import { TrangThaiKhoaHoc } from '@/services/Course/typing.d';
import './Course.less';

const { Option } = Select;

// Thêm Component provider bao bọc
const CourseContent: React.FC = () => {
  const { 
    khoaHocList,
    giangVienList,
    loading, 
    formVisible, 
    editMode,
    selectedKhoaHoc,
    filter,
    handleAdd, 
    handleCloseForm,
    saveKhoaHoc,
    deleteKhoaHoc,
    editKhoaHoc,
    updateFilter,
    loadKhoaHocList,
    init
  } = useModel();

  // Khởi tạo dữ liệu khi component được mount
  useEffect(() => {
    init();
  }, [init]);

  // Xử lý thay đổi sorting
  const handleChangeSorting = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      const sortDirection = sorter.order === 'descend' ? 'desc' : 'asc';
      updateFilter({ sortBy: sorter.field, sortDirection });
    }
  };

  // Cấu hình hiển thị trạng thái khóa học
  const renderTrangThai = (trangThai: TrangThaiKhoaHoc) => {
    const config = {
      [TrangThaiKhoaHoc.DANG_MO]: { color: 'green', text: 'Đang mở' },
      [TrangThaiKhoaHoc.DA_KET_THUC]: { color: 'red', text: 'Đã kết thúc' },
      [TrangThaiKhoaHoc.TAM_DUNG]: { color: 'orange', text: 'Tạm dừng' }
    };
    
    return (
      <Tag color={config[trangThai].color}>
        {config[trangThai].text}
      </Tag>
    );
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      sorter: true,
      align: 'center' as 'center',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
      align: 'center' as 'center',
      render: (giangVien: any, record: any) => {
        return giangVien?.hoTen || record.giangVienId;
      }
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      sorter: true,
      align: 'center' as 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      align: 'center' as 'center',
      render: renderTrangThai,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as 'center',
      width: 150, // Đặt chiều rộng cố định
      render: (text: any, record: any) => (
        <div className="action-buttons-container">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => editKhoaHoc(record.id)}
            className="action-button"
          />
          <Popconfirm
            title="Xác nhận xóa khóa học?"
            onConfirm={() => deleteKhoaHoc(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.soLuongHocVien > 0 && record.trangThai !== TrangThaiKhoaHoc.DA_KET_THUC}
              className="action-button"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      className="khoa-hoc-container"
      loading={loading}
      title="Quản lý khóa học"
      content="Thêm mới, chỉnh sửa và quản lý các khóa học."
      extra={[
        <Button 
          key="refresh"
          onClick={() => loadKhoaHocList()}
          icon={<ReloadOutlined />}
          style={{ marginRight: 8 }}
        >
          Làm mới
        </Button>,
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          Thêm khóa học
        </Button>
      ]}
    >
      {/* Bộ lọc khóa học */}
      <Card style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label="Tìm kiếm">
                <Input
                  placeholder="Tìm theo tên khóa học"
                  prefix={<SearchOutlined />}
                  value={filter.searchKey}
                  onChange={(e) => updateFilter({ searchKey: e.target.value })}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Giảng viên">
                <Select
                  placeholder="Chọn giảng viên"
                  value={filter.giangVienId}
                  onChange={(value) => updateFilter({ giangVienId: value })}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {giangVienList && giangVienList.map((giangVien) => (
                    <Option key={giangVien.id} value={giangVien.id}>
                      {giangVien.hoTen}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label="Trạng thái">
                <Select
                  placeholder="Chọn trạng thái"
                  value={filter.trangThai}
                  onChange={(value) => updateFilter({ trangThai: value })}
                  allowClear
                  style={{ width: '100%' }}
                >
                  <Option value={TrangThaiKhoaHoc.DANG_MO}>Đang mở</Option>
                  <Option value={TrangThaiKhoaHoc.DA_KET_THUC}>Đã kết thúc</Option>
                  <Option value={TrangThaiKhoaHoc.TAM_DUNG}>Tạm dừng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {/* Bảng danh sách khóa học */}
      <Card>
        <Table
          rowKey="id"
          dataSource={khoaHocList || []}
          columns={columns}
          loading={loading}
          onChange={handleChangeSorting}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} khóa học`,
            defaultPageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
      
      {/* Form thêm mới/chỉnh sửa khóa học */}
      <Modal
        title={editMode ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'} 
        visible={formVisible}
        onCancel={handleCloseForm}
        footer={null}
        width={800}
        destroyOnClose
        bodyStyle={{ padding: 16 }}
        maskClosable={false}
      >
        <KhoaHocForm
          visible={formVisible} 
          editMode={editMode}
          selectedKhoaHoc={selectedKhoaHoc}
          onCancel={handleCloseForm}
          onSave={saveKhoaHoc}
          loading={loading}
        />
      </Modal>
    </PageContainer>
  );
};

// Component chính bọc provider
const KhoaHocPage: React.FC = () => {
  const { Provider } = require('@/models/course');
  
  return (
    <Provider>
      <CourseContent />
    </Provider>
  );
};

export default KhoaHocPage;