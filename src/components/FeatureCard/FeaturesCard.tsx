import React from 'react';
import { Card, Col, Image, Typography, Space } from 'antd';
import { getSelectedFeatures, toggleSelectedFeature } from '../../redux/FeatureSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import './FeaturesCard.css';

type FeaturesCardProps = {
  id: string;
  title: string;
  description?: string;
  image: string | undefined;
  loading: boolean;
}

export default function FeaturesCard({
  id,
  title,
  description,
  image,
  loading,
}: FeaturesCardProps) {
  const imagePath = (image) ? image : 'placeholder.png';
  const dispatch = useAppDispatch();
  const selectedFeatures = useSelector(getSelectedFeatures);
  // console.log('sf: ', selectedFeatures);

  return (
    <Col lg={8} sm={12}>
      <Card 
        title={title}
        hoverable
        loading={loading}
        onClick={() => toggleFeature(id)}
        className={selectedFeatures.includes(id) ? 'selected-card' : 'card-unselected'}
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
    dispatch(toggleSelectedFeature(featureKey));
  }
}
