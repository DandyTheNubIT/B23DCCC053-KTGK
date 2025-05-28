import React from 'react';
import { Row, Col, Empty } from 'antd';
import { Destination } from '@/services/TravelPlan/typing.d';
import DestinationCard from './DestinationCard';

interface DestinationListProps {
  destinations: Destination[];
}

const DestinationList: React.FC<DestinationListProps> = ({ destinations }) => {
  if (destinations.length === 0) {
    return (
      <Empty 
        description="Không tìm thấy điểm đến phù hợp" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {destinations.map(destination => (
        <Col xs={24} sm={12} md={8} lg={8} xl={6} key={destination.id}>
          <DestinationCard destination={destination} />
        </Col>
      ))}
    </Row>
  );
};

export default DestinationList;