import { Loading3QuartersOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons";
import {  Button, Carousel, Col, Image, List, Modal, Row, Space, Tag, Typography } from "antd";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { HomeFeature } from "../../features/featureList";
import { addSelectedMatch, calculateFinalMatches, clearSelectedMatches, getMatchCandidates, getSelectedFeatures, getSelectedMatches, removeSelectedFeature, resetState } from "../../redux/FeatureSlice";
import { useAppDispatch } from "../../redux/hooks";
import firestoreQueries from "../../utils/readFromFirestore";
import FeatureSectionHeader from "../FeatureSectionHeader";

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
  const matchCandidates = useSelector(getMatchCandidates);
  const selectedMatches = useSelector(getSelectedMatches);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (matchCandidates.length) {
        const styleMatchIds: string[] = matchCandidates.map((match) => {
          return match.key;
        });
        console.log('match ids: ', styleMatchIds);

        dispatch(clearSelectedMatches());

        firestoreQueries.getCollectionByQueryingId('/styles', 'in', styleMatchIds)
        .then((data) => {
          console.log('potential matches: ', data);
          data.forEach((doc: DocumentData) => {
            const matchData = doc.data();
            console.log('raw match data: ', matchData);
            dispatch(addSelectedMatch({
              id: doc.id,
              display_name: matchData.display_name,
              origin: matchData.origin,
              images: matchData.images,
            }));
          });
        }).catch((error) => console.warn(error))
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchCandidates]);

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
              onClick={searchForFeatures}
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
        closable={false}
        cancelText="Go back"
        okText="Start a New Search"
        onCancel={() => setResultModalOpen(false)}
        onOk={() => {
          clearFeatures();
          setResultModalOpen(false);
        }}
        width={850}
      >
        <List 
          header={<FeatureCardSubtitle>RESULTS</FeatureCardSubtitle>}
          loading={loading}
        >
            {selectedMatches.map((value, index) => {
              return (
                <List.Item key={index}>
                  <Row gutter={[8, 8]}>
                    <Col span={8}>
                      <Carousel>
                        {value.images?.map((image: string, index: number) => {
                          return (
                            <Image key={index} src={`images/${image}`} preview={false} width={'200px'} style={{ objectFit: 'contain' }} />
                          )
                        })}
                      </Carousel>
                    </Col>
                    <Col span={16}>
                      <Space direction='vertical'>
                        <FeatureSectionHeader
                          title={value.display_name}
                          weight="sub"
                          id={value.id}
                        />
                        <Button type='default' icon={<ReadOutlined />}>Learn More</Button>
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              );
            })}
        </List>
      </ResultsModal>
    </>
  );

  function searchForFeatures() {
    console.log('searching');
    setLoading(true);
    dispatch(calculateFinalMatches());
    setLoading(false);
    setResultModalOpen(true);
  }

  function clearFeatures() {
    dispatch(resetState());
  }

  function removeFeature(feature: HomeFeature) {
    dispatch(removeSelectedFeature(feature));
  }
  
}