import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Tag } from "antd";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { HomeFeature, RawStyleMatch } from "../../features/featureList";
import { addOrIncrementRawMatch, clearSelectedFeatures, getRawMatches, getSelectedFeatures, removeSelectedFeature } from "../../redux/FeatureSlice";
import { useAppDispatch } from "../../redux/hooks";
import firestoreQueries from "../../utils/readFromFirestore";

const WrapperDiv = styled.div`
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
const SelectedFeaturesHeader = styled.p`
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.25rem;
  line-height: 0rem;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0em;
  text-align: left;
`;

export default function CardWithFeatures() {
  const [loading, setLoading] = useState(true);
  const [rawStyleResults, setRawStyleResults] = useState<DocumentData>();
  const selectedFeatures = useSelector(getSelectedFeatures);
  const styleResults  = useSelector(getRawMatches);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rawStyleResults) {
      rawStyleResults.forEach((doc: DocumentData) => {
        const styleDocData = doc.data();
        const styleDocKey = Object.keys(styleDocData)[0];
        populateRawMatch(
          { key: styleDocKey, 
            score: styleDocData[styleDocKey]
          }
        );
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawStyleResults]);

  console.log('parsed res: ', styleResults);

  const children = selectedFeatures.map((feature) => {
    return <FeatureTag key={feature.id} closable onClose={() => removeFeature(feature)}>{feature.fullTitle}</FeatureTag>
  })
  return (
    <WrapperDiv>
      <Row style={{ marginBottom: '6px' }}>
        <SelectedFeaturesHeader>Selected Features:</SelectedFeaturesHeader>
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

  function searchForFeatures() {
    setLoading(true);
    const featureKeys = selectedFeatures.map((feature) => {
      return feature.id;
    });
    firestoreQueries.getCollectionByQueryingId('/feature_styles', 'in', featureKeys)
      .then(
        (data) => {
          setRawStyleResults(data);
        }
      );
  }

  function clearFeatures() {
    dispatch(clearSelectedFeatures());
  }

  function removeFeature(feature: HomeFeature) {
    dispatch(removeSelectedFeature(feature));
  }

  function populateRawMatch(match: RawStyleMatch) {
    dispatch(addOrIncrementRawMatch(match));
  }
  
}