import React from 'react';
import { Table, Space, Button, Tag, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { KhoaHoc, TrangThaiKhoaHoc } from '@/services/Course/typing.d';
import { getTrangThaiText } from '@/services/Course';

interface CourseTableProps {
  loading: boolean;
  dataSource: KhoaHoc[];
  onEditKhoaHoc: (id: string) => void;
  onDeleteKhoaHoc: (id: string) => void;
  onChangeSorting: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  loading,
  dataSource,
  onEditKhoaHoc,
  onDeleteKhoaHoc,
  onChangeSorting,
}) => {
  const getStatusTag = (trangThai: TrangThaiKhoaHoc) => {
    switch (trangThai) {
      case TrangThaiKhoaHoc.DANG_MO:
        return <Tag color="green">{getTrangThaiText(trangThai)}</Tag>;
      case TrangThaiKhoaHoc.DA_KET_THUC:
        return <Tag color="red">{getTrangThaiText(trangThai)}</Tag>;
      case TrangThaiKhoaHoc.TAM_DUNG:
        return <Tag color="orange">{getTrangThaiText(trangThai)}</Tag>;
      default:
        return <Tag>{getTrangThaiText(trangThai)}</Tag>;
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      const sortDirection = sorter.order === 'descend' ? 'desc' : 'asc';
      onChangeSorting(sorter.field, sortDirection);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      sorter: true,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (giangVien: any) => giangVien?.hoTen || 'Không có dữ liệu',
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      width: 150,
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (trangThai: TrangThaiKhoaHoc) => getStatusTag(trangThai),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (text: string, record: KhoaHoc) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditKhoaHoc(record.id)}
          />
          <Popconfirm
            title="Xóa khóa học"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => onDeleteKhoaHoc(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            disabled={record.soLuongHocVien > 0}
          >
            <Tooltip
              title={record.soLuongHocVien > 0 ? 'Không thể xóa khóa học đã có học viên' : ''}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                disabled={record.soLuongHocVien > 0}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      onChange={handleTableChange}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} khóa học`,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50'],
      }}
    />
  );
};

export default CourseTable;