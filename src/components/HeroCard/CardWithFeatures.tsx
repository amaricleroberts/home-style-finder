import { Loading3QuartersOutlined, SearchOutlined } from "@ant-design/icons";
import {  Button, Col, Row, Space, Tag } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { HomeFeature } from "../../features/featureList";
import { getSelectedFeatures, removeSelectedFeature, resetState } from "../../redux/FeatureSlice";
import { useAppDispatch } from "../../redux/hooks";
import ResultsModal from "../../ResultsModal/ResultsModal";

export const WrapperDiv = styled.div`
  background: #FFFFFF;
  width: 100%;
  padding: 40px;
  min-height: 200px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
`;
const FeatureTag = styled(Tag)`
  color: #4D5C6A;
  border-radius: 1px;
  margin: 4px 4px;
`;
export const FeatureCardSubtitle = styled.p`
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.25rem;
  line-height: 0rem;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0em;
  text-align: left;
`;

export default function CardWithFeatures() {
  const [loading, setLoading] = useState<boolean>(false);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const selectedFeatures = useSelector(getSelectedFeatures);
  const dispatch = useAppDispatch();

  const children = selectedFeatures.map((feature) => {
    return (
      <FeatureTag
        key={feature.id}
        closable
        onClose={() => removeFeature(feature)}
      >
        {feature.fullTitle}
      </FeatureTag>
    );
  })

  const cardToUse = loading ? 
    (
      <WrapperDiv>
        <Row justify={'center'}>
          <Space direction="vertical" align="center">
            <Loading3QuartersOutlined
              spin={true}
              style={{ fontSize: '55px', color: '#457B9D'}}
            />
            <FeatureCardSubtitle>Calculating home style...</FeatureCardSubtitle>
          </Space>
        </Row>
      </WrapperDiv>
    ) :
    (
      <WrapperDiv>
        <Row style={{ marginBottom: '6px' }}>
          <FeatureCardSubtitle>Selected Features:</FeatureCardSubtitle>
        </Row>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={24}>{children}</Col>
        </Row>
        <Row justify='end'>
          <Space direction="horizontal">
            <Button
              type='primary'
              icon={<SearchOutlined />}
              onClick={() => searchForFeatures()}
              //disabled={selectedFeatures.length < 3}
            >
              Find Style
            </Button>
            <Button onClick={clearFeatures}>Clear</Button>
          </Space>
        </Row>
      </WrapperDiv>
    );
  return (
    <>
      {cardToUse}
      <ResultsModal
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        onOk={() => {
          clearFeatures();
          setResultModalOpen(false);
        }}
      />
    </>
  );

  function searchForFeatures() {
    console.log('searching in cwf');
    setResultModalOpen(true);
  }

  function clearFeatures() {
    dispatch(resetState());
  }

  function removeFeature(feature: HomeFeature) {
    dispatch(removeSelectedFeature(feature));
  }
  
}