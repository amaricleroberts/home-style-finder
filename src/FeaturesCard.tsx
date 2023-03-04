import React from 'react';
import { Card, Col, Image, Typography, Space } from 'antd';
import { HomeFeature } from './features/featureList';
import { PlusOutlined } from '@ant-design/icons';

type FeaturesCardProps = {
  id: string;
  title: string;
  description?: string;
  image: string | undefined;
  loading: boolean;
  selectedFeatures: {};
}

export default function FeaturesCard({
  id,
  title,
  description,
  image,
  loading,
  selectedFeatures,
}: FeaturesCardProps) {
  const imagePath = (image) ? image : 'placeholder.png';
  return (
    <Col lg={8} sm={12}>
      <Card 
        title={title}
        style={{height: '280px'}}
        hoverable
        loading={loading}
        onClick={() => toggleFeature(id)}
      >
        <Space direction='vertical' align='center' style={{width: '100%'}}>
          <Image
            preview={false}
            src={"/images/" + imagePath} 
            height={135}
            width={135}
          />
          <Typography.Text>{description}</Typography.Text>
        </Space>
      </Card>
    </Col>
  )

  function toggleFeature(featureKey: string): void {
    console.log(featureKey);
    selectedFeatures = {...selectedFeatures, featureKey};
  }
}