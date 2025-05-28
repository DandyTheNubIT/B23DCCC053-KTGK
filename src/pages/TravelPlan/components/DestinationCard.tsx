import React from 'react';
import { Card, Rate, Tag, Typography, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Destination, DestinationType, PriceLevel } from '@/services/TravelPlan/typing.d';
import { getDestinationTypeName, getPriceLevelName } from '@/services/TravelPlan';

const { Text, Paragraph } = Typography;
const { Meta } = Card;

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  // Hiển thị tag cho loại hình điểm đến
  const renderTypeTag = (type: DestinationType) => {
    const colorMap: Record<DestinationType, string> = {
      [DestinationType.BEACH]: 'blue',
      [DestinationType.MOUNTAIN]: 'green',
      [DestinationType.CITY]: 'purple'
    };

    return (
      <Tag color={colorMap[type]}>
        {getDestinationTypeName(type)}
      </Tag>
    );
  };

  // Hiển thị tag cho mức giá
  const renderPriceTag = (priceLevel: PriceLevel) => {
    const colorMap: Record<PriceLevel, string> = {
      [PriceLevel.LOW]: 'green',
      [PriceLevel.MEDIUM]: 'blue',
      [PriceLevel.HIGH]: 'orange'
    };

    return (
      <Tag color={colorMap[priceLevel]}>
        {getPriceLevelName(priceLevel)}
      </Tag>
    );
  };

  return (
    <Card
      className="destination-card"
      hoverable
      cover={
        <div>
          <img alt={destination.name} src={destination.imageUrl} />
          <div className="destination-type">
            {renderTypeTag(destination.type)}
          </div>
          <div className="destination-price">
            {renderPriceTag(destination.priceLevel)}
          </div>
        </div>
      }
    >
      <Meta
        title={destination.name}
        description={
          <>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">
                <EnvironmentOutlined /> {destination.location}
              </Text>
              <div>
                <Rate 
                  allowHalf 
                  disabled 
                  defaultValue={destination.rating} 
                  style={{ fontSize: '14px' }} 
                />
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {destination.rating}
                </Text>
              </div>
              <Paragraph ellipsis={{ rows: 2 }}>
                {destination.description}
              </Paragraph>
            </Space>
          </>
        }
      />
    </Card>
  );
};

export default DestinationCard;