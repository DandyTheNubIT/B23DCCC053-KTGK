import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, Button, Table, message, Spin } from 'antd';
import { TeamOutlined, FormOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import * as XLSX from 'xlsx';

const { Option } = Select;

// Dữ liệu mẫu cho CLB
const sampleClubs = [
  { id: 1, name: 'CLB Âm nhạc', description: 'CLB dành cho những người yêu âm nhạc' },
  { id: 2, name: 'CLB Thể thao', description: 'CLB dành cho những người đam mê thể thao' },
  { id: 3, name: 'CLB Công nghệ', description: 'CLB dành cho những người yêu thích công nghệ' },
  { id: 4, name: 'CLB Sách', description: 'CLB dành cho những người đam mê đọc sách' },
  { id: 5, name: 'CLB Ngoại ngữ', description: 'CLB dành cho những người học ngoại ngữ' },
];

// Dữ liệu mẫu cho đơn đăng ký
const sampleRegistrations = [
  { id: 1, clubId: 1, studentId: 'SV001', studentName: 'Nguyễn Văn A', email: 'nva@example.com', phone: '0901234567', status: 'approved', registeredAt: '2023-10-01' },
  { id: 2, clubId: 1, studentId: 'SV002', studentName: 'Trần Thị B', email: 'ttb@example.com', phone: '0901234568', status: 'approved', registeredAt: '2023-10-02' },
  { id: 3, clubId: 2, studentId: 'SV003', studentName: 'Lê Văn C', email: 'lvc@example.com', phone: '0901234569', status: 'pending', registeredAt: '2023-10-03' },
  { id: 4, clubId: 2, studentId: 'SV004', studentName: 'Phạm Thị D', email: 'ptd@example.com', phone: '0901234570', status: 'rejected', registeredAt: '2023-10-04' },
  { id: 5, clubId: 3, studentId: 'SV005', studentName: 'Hoàng Văn E', email: 'hve@example.com', phone: '0901234571', status: 'approved', registeredAt: '2023-10-05' },
  { id: 6, clubId: 3, studentId: 'SV006', studentName: 'Ngô Thị F', email: 'ntf@example.com', phone: '0901234572', status: 'pending', registeredAt: '2023-10-06' },
  { id: 7, clubId: 4, studentId: 'SV007', studentName: 'Đỗ Văn G', email: 'dvg@example.com', phone: '0901234573', status: 'approved', registeredAt: '2023-10-07' },
  { id: 8, clubId: 4, studentId: 'SV008', studentName: 'Lý Thị H', email: 'lth@example.com', phone: '0901234574', status: 'approved', registeredAt: '2023-10-08' },
  { id: 9, clubId: 5, studentId: 'SV009', studentName: 'Trương Văn I', email: 'tvi@example.com', phone: '0901234575', status: 'pending', registeredAt: '2023-10-09' },
  { id: 10, clubId: 5, studentId: 'SV010', studentName: 'Mai Thị K', email: 'mtk@example.com', phone: '0901234576', status: 'rejected', registeredAt: '2023-10-10' },
  { id: 11, clubId: 1, studentId: 'SV011', studentName: 'Vũ Văn L', email: 'vvl@example.com', phone: '0901234577', status: 'approved', registeredAt: '2023-10-11' },
  { id: 12, clubId: 2, studentId: 'SV012', studentName: 'Đinh Thị M', email: 'dtm@example.com', phone: '0901234578', status: 'rejected', registeredAt: '2023-10-12' },
  { id: 13, clubId: 3, studentId: 'SV013', studentName: 'Bùi Văn N', email: 'bvn@example.com', phone: '0901234579', status: 'approved', registeredAt: '2023-10-13' },
  { id: 14, clubId: 4, studentId: 'SV014', studentName: 'Dương Thị O', email: 'dto@example.com', phone: '0901234580', status: 'pending', registeredAt: '2023-10-14' },
  { id: 15, clubId: 5, studentId: 'SV015', studentName: 'Phan Văn P', email: 'pvp@example.com', phone: '0901234581', status: 'approved', registeredAt: '2023-10-15' },
];

const ClubStatistics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClub, setSelectedClub] = useState<number | 'all'>('all');
  const [dashboardData, setDashboardData] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [membersData, setMembersData] = useState<any[]>([]);

  // Thống kê tổng quan
  useEffect(() => {
    setLoading(true);
    
    try {
      // Tính toán số liệu thống kê
      const totalClubs = sampleClubs.length;
      const totalRegistrations = sampleRegistrations.length;
      
      const pendingRegistrations = sampleRegistrations.filter(reg => reg.status === 'pending').length;
      const approvedRegistrations = sampleRegistrations.filter(reg => reg.status === 'approved').length;
      const rejectedRegistrations = sampleRegistrations.filter(reg => reg.status === 'rejected').length;
      
      setDashboardData({
        totalClubs,
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        rejectedRegistrations,
      });
      
      // Tạo dữ liệu cho biểu đồ
      const clubRegistrationStats = sampleClubs.map(club => {
        const clubRegistrations = sampleRegistrations.filter(reg => reg.clubId === club.id);
        return {
          clubName: club.name,
          pending: clubRegistrations.filter(reg => reg.status === 'pending').length,
          approved: clubRegistrations.filter(reg => reg.status === 'approved').length,
          rejected: clubRegistrations.filter(reg => reg.status === 'rejected').length,
        };
      });
      
      // Chuyển đổi dữ liệu cho biểu đồ
      const chartData = [];
      clubRegistrationStats.forEach(stat => {
        chartData.push({
          clubName: stat.clubName,
          category: 'Chờ xác nhận',
          value: stat.pending,
        });
        chartData.push({
          clubName: stat.clubName,
          category: 'Đã duyệt',
          value: stat.approved,
        });
        chartData.push({
          clubName: stat.clubName,
          category: 'Từ chối',
          value: stat.rejected,
        });
      });
      
      setChartData(chartData);
      
      // Lọc thành viên đã được duyệt
      updateMembersData('all');
      
    } catch (error) {
      console.error('Lỗi khi tính toán dữ liệu thống kê:', error);
      message.error('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật danh sách thành viên khi thay đổi CLB
  const updateMembersData = (clubId: number | 'all') => {
    let filteredMembers;
    
    if (clubId === 'all') {
      filteredMembers = sampleRegistrations.filter(reg => reg.status === 'approved');
    } else {
      filteredMembers = sampleRegistrations.filter(
        reg => reg.status === 'approved' && reg.clubId === clubId
      );
    }
    
    // Thêm tên CLB vào danh sách thành viên
    const membersWithClubName = filteredMembers.map(member => {
      const club = sampleClubs.find(club => club.id === member.clubId);
      return {
        ...member,
        clubName: club ? club.name : 'Không xác định',
      };
    });
    
    setMembersData(membersWithClubName);
  };

  const handleClubChange = (value: number | 'all') => {
    setSelectedClub(value);
    updateMembersData(value);
  };

  // Cấu hình biểu đồ cột
  const columnConfig = {
    data: chartData,
    isGroup: true,
    xField: 'clubName',
    yField: 'value',
    seriesField: 'category',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    color: ['#faad14', '#52c41a', '#f5222d'],
    legend: {
      position: 'top',
    },
  };

  // Cấu hình cột cho bảng thành viên
  const membersColumns = [
    { title: 'MSSV', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Họ và tên', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'CLB', dataIndex: 'clubName', key: 'clubName' },
    { title: 'Ngày đăng ký', dataIndex: 'registeredAt', key: 'registeredAt' },
  ];

  // Xuất danh sách thành viên ra file Excel
  const exportToExcel = () => {
    const clubName = selectedClub === 'all' 
      ? 'Tất cả CLB' 
      : sampleClubs.find(club => club.id === selectedClub)?.name || 'Không xác định';
      
    // Chuẩn bị dữ liệu xuất
    const exportData = membersData.map(member => ({
      'MSSV': member.studentId,
      'Họ và tên': member.studentName,
      'Email': member.email,
      'Số điện thoại': member.phone,
      'CLB': member.clubName,
      'Ngày đăng ký': member.registeredAt,
    }));
    
    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thành viên");
    
    // Tạo tên file
    const fileName = `Danh_sach_thanh_vien_${clubName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Xuất file
    XLSX.writeFile(wb, fileName);
    message.success(`Đã xuất danh sách thành viên ${clubName} thành công!`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading}>
        <div className="statistics-container">
          {/* Thống kê tổng quan */}
          <Row gutter={16} style={{ marginBottom: 24 }} justify="space-between">
            <Col flex="1">
              <Card>
                <Statistic
                  title="Tổng số CLB"
                  value={dashboardData.totalClubs}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col flex="1">
              <Card>
                <Statistic
                  title="Tổng số đơn đăng ký"
                  value={dashboardData.totalRegistrations}
                  prefix={<FormOutlined />}
                />
              </Card>
            </Col>
            <Col flex="1">
              <Card>
                <Statistic
                  title="Chờ xác nhận"
                  value={dashboardData.pendingRegistrations}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col flex="1">
              <Card>
                <Statistic
                  title="Đã duyệt"
                  value={dashboardData.approvedRegistrations}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col flex="1">
              <Card>
                <Statistic
                  title="Từ chối"
                  value={dashboardData.rejectedRegistrations}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Biểu đồ thống kê đơn đăng ký theo CLB */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card title="Thống kê đơn đăng ký theo CLB">
                <Column {...columnConfig} />
              </Card>
            </Col>
          </Row>

          {/* Danh sách thành viên đã được duyệt */}
          <Row gutter={16}>
            <Col span={24}>
              <Card 
                title="Danh sách thành viên đã duyệt" 
                extra={
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Select 
                      style={{ width: 200 }} 
                      placeholder="Chọn CLB" 
                      value={selectedClub}
                      onChange={handleClubChange}
                    >
                      <Option value="all">Tất cả CLB</Option>
                      {sampleClubs.map(club => (
                        <Option key={club.id} value={club.id}>{club.name}</Option>
                      ))}
                    </Select>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      onClick={exportToExcel}
                    >
                      Xuất Excel
                    </Button>
                  </div>
                }
              >
                <Table 
                  columns={membersColumns} 
                  dataSource={membersData} 
                  rowKey="id" 
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default ClubStatistics;