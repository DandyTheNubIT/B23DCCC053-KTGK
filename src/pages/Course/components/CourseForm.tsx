import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Divider, Space } from 'antd';
import TinyEditor from '@/components/TinyEditor';
import { getGiangVienList } from '@/services/Course';
import { KhoaHoc, KhoaHocFormData, TrangThaiKhoaHoc, GiangVien } from '@/services/Course/typing.d';

const { Option } = Select;

interface CourseFormProps {
  visible: boolean;
  editMode: boolean;
  selectedKhoaHoc: KhoaHoc | null;
  onCancel: () => void;
  onSave: (values: KhoaHocFormData) => void;
  loading: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  editMode,
  selectedKhoaHoc,
  onCancel,
  onSave,
  loading,
}) => {
  const [form] = Form.useForm();
  const [giangVienList, setGiangVienList] = useState<GiangVien[]>([]);

  useEffect(() => {
    if (visible) {
      // Load danh sách giảng viên
      const giangVien = getGiangVienList();
      setGiangVienList(giangVien);

      // Reset form khi mở modal
      form.resetFields();

      // Set giá trị mặc định cho form nếu đang edit
      if (editMode && selectedKhoaHoc) {
        form.setFieldsValue({
          tenKhoaHoc: selectedKhoaHoc.tenKhoaHoc,
          giangVienId: selectedKhoaHoc.giangVienId,
          soLuongHocVien: selectedKhoaHoc.soLuongHocVien,
          moTa: selectedKhoaHoc.moTa,
          trangThai: selectedKhoaHoc.trangThai,
        });
      } else {
        // Giá trị mặc định cho form thêm mới
        form.setFieldsValue({
          soLuongHocVien: 0,
          trangThai: TrangThaiKhoaHoc.DANG_MO,
        });
      }
    }
  }, [visible, editMode, selectedKhoaHoc, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      // Form validation failed
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="course-form-container">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          soLuongHocVien: 0,
          trangThai: TrangThaiKhoaHoc.DANG_MO,
        }}
      >
        <Form.Item
          name="tenKhoaHoc"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="giangVienId"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {giangVienList.map((gv) => (
              <Option key={gv.id} value={gv.id}>
                {gv.hoTen} {gv.chuyenMon ? `- ${gv.chuyenMon}` : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="soLuongHocVien"
          label="Số lượng học viên"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng học viên' },
            { type: 'number', min: 0, message: 'Số lượng học viên không được âm' },
          ]}
        >
          <InputNumber placeholder="Nhập số lượng học viên" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái khóa học"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái khóa học' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value={TrangThaiKhoaHoc.DANG_MO}>Đang mở</Option>
            <Option value={TrangThaiKhoaHoc.DA_KET_THUC}>Đã kết thúc</Option>
            <Option value={TrangThaiKhoaHoc.TAM_DUNG}>Tạm dừng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
        >
          <TinyEditor height={300} />
        </Form.Item>

        {/* Thêm divider để phân tách form và nút */}
        <Divider style={{ margin: '24px 0 16px' }} />

        {/* Đặt nút bên dưới form và canh phải */}
        <div style={{ textAlign: 'right' }}>
          <Space size="middle">
            <Button 
              onClick={onCancel} 
              style={{ minWidth: '100px' }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={loading}
              style={{ minWidth: '100px' }}
            >
              {editMode ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default CourseForm;