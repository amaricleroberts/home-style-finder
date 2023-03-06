import { Loading3QuartersOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons";
import {  Button, Card, Col, List, Modal, notification, Row, Space, Tag } from "antd";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { HomeFeature, RawStyleMatch } from "../../features/featureList";
import { addOrIncrementRawMatch, clearSelectedFeatures, getRawMatches, getSelectedFeatures, removeSelectedFeature } from "../../redux/FeatureSlice";
import { useAppDispatch } from "../../redux/hooks";
import firestoreQueries from "../../utils/readFromFirestore";

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
const ResultsModal = styled(Modal)`
  border-radius: 0px;
  width: 600px;
`;

export default function CardWithFeatures() {
  const [loading, setLoading] = useState<boolean>(false);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const selectedFeatures = useSelector(getSelectedFeatures);
  const styleResults  = useSelector(getRawMatches);
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
            <Button type='primary' icon={<SearchOutlined />} onClick={searchForFeatures}>Find Style</Button>
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
        closable={false}
        cancelText="Go back"
        okText="Start a New Search"
        onCancel={() => setResultModalOpen(false)}
        onOk={() => {
          clearFeatures();
          setResultModalOpen(false);
        }}
      >
        <List 
          header={<FeatureCardSubtitle>RESULTS</FeatureCardSubtitle>}
          loading={loading}
        >
          <List.Item
            actions={
              [<Button type='default' icon={<ReadOutlined />}>Read More</Button>]
            }
          >
            <p>{styleResults[0]?.key}</p>
          </List.Item>
        </List>
      </ResultsModal>
    </>
  );

  function searchForFeatures() {
    setLoading(true);
    setResultModalOpen(true);
    const featureKeys = selectedFeatures.map((feature) => {
      return feature.id;
    });
    firestoreQueries.getCollectionByQueryingId('/feature_styles', 'in', featureKeys)
      .then(
        (data) => {
          data.forEach((doc: DocumentData) => {
            const styleDocData = doc.data();
            const styleDocKey = Object.keys(styleDocData)[0];
            populateRawMatch(
              {
                key: styleDocKey,
                score: styleDocData[styleDocKey]
              }
            );
          });
        }
      );
    setLoading(false);
    //TODO - why doesn't this work?
    //clearFeatures();
  }

  function clearFeatures() {
    console.log('clearing');
    dispatch(clearSelectedFeatures());
  }

  function removeFeature(feature: HomeFeature) {
    dispatch(removeSelectedFeature(feature));
  }

  function populateRawMatch(match: RawStyleMatch) {
    dispatch(addOrIncrementRawMatch(match));
  }
  
}