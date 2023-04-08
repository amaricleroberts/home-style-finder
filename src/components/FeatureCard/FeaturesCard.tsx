import React from 'react';
import { Card, Col, Image, Typography, Space } from 'antd';
import { getSelectedFeatures, toggleSelectedFeature } from '../../redux/FeatureSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import './FeaturesCard.css';
import { HomeFeature } from '../../features/featureList';

type FeaturesCardProps = {
  feature: HomeFeature;
  loading: boolean;
}

export default function FeaturesCard({
  feature,
  loading,
}: FeaturesCardProps) {
  const imagePath = (feature.image) ? feature.image : 'placeholder.png';
  const dispatch = useAppDispatch();
  const selectedFeatures = useSelector(getSelectedFeatures);
  let featureKeys: string[] = selectedFeatures.map((feature) => {return feature.id; });

  return (
    <Col lg={8} sm={12}>
      <Card 
        title={feature.title}
        hoverable
        loading={loading}
        onClick={() => {
          toggleFeature(feature);
        }}
        className={featureKeys.includes(feature.id) ? 'selected-card' : 'card-unselected'}
      >
        <Space direction='vertical' align='center' style={{width: '100%'}}>
          <Image
            preview={false}
            src={"/images/" + imagePath} 
            height={135}
            width={135}
          />
          <Typography.Text>{feature.description}</Typography.Text>
        </Space>
      </Card>
    </Col>
  )

  function toggleFeature(feature: HomeFeature): void {
    //console.log('toggling on feature: ', feature);
    dispatch(toggleSelectedFeature(feature));
  }
}
