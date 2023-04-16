import { Button, Col, Image, List, Modal, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { ReadOutlined } from "@ant-design/icons";
import { HomeStyleMatch, StyleMatchCandidate } from "../features/featureList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHomeStyles, getSelectedFeatures } from "../redux/FeatureSlice";
import { calculateMatchCandidates } from "../utils/functions";

const StyledModal = styled(Modal)`
  border-radius: 0px;
  width: 600px;
`;

const StyleImage = styled(Image)`
  objectFit: 'contain';
`;

const ModalHeader = styled(Typography.Paragraph)`
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: 700;
  font-size: 1.5em;
  line-height: 22px;
  text-transform: uppercase;
  margin-top: 1em;
  letter-spacing: 0.04em;
  text-align: center;
`;

const StyleHeader = styled(Typography.Paragraph)`
  font-family: 'Georgia';
  font-style: normal;
  font-weight: 700;
  font-size: 1.2em;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: 0.02em;
`;

type ResultsModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function ResultsModal({
  open,
  onCancel,
  onOk,
}: ResultsModalProps) {
  const [loading, setLoading] = useState(true);
  const [styleMatches, setStyleMatches] = useState<HomeStyleMatch[]>([]);
  const selectedFeatures = useSelector(getSelectedFeatures);
  const [matchCandidates, setMatchCandidates] = useState<StyleMatchCandidate[]>([]);
  const styles = useSelector(getHomeStyles);

  useEffect(() => {
    console.log('doing things here');
    setLoading(true);
    const findMatchesPromise =
      calculateMatchCandidates(selectedFeatures)
        .then((data) => setMatchCandidates(data));
    Promise.all([findMatchesPromise]);
    setLoading(false);
  }, [selectedFeatures]);

  useEffect(() => {
    setLoading(true);
    let matchResult: HomeStyleMatch[] = [];
    matchCandidates.forEach((value) => {
      console.log(value.key);
      const matchingStyle = styles.filter((style) => { return style.id === value.key; });
      console.log(matchingStyle);
      if (matchingStyle.length) {
        matchResult.push({
          percentage_match: calculatePercentageMatch(value.score),
          ...matchingStyle[0]
        });
      }
    });
    matchResult = matchResult.sort((a: HomeStyleMatch, b: HomeStyleMatch) => {
      return (a.percentage_match > b.percentage_match) ? -1 : 1;
    })
    setStyleMatches(matchResult);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchCandidates]);

  console.log(styleMatches);
  return (
    <StyledModal
      open={open}
      closable={false}
      cancelText="Go back"
      okText="Start a New Search"
      onCancel={() => onCancel()}
      onOk={() => onOk()}
      width={850}
    >
      <List
        header={<ModalHeader>Results</ModalHeader>}
        loading={loading}
        bordered={false}
        itemLayout="vertical"
        split={false}
      >
        {styleMatches.map((value, index) => {
          return (
            <List.Item key={index}>
              <Row gutter={[8, 8]} style={{ borderStyle: 'solid', borderColor: '#B5BDC8', borderWidth: 1 }}>
                <Col span={8} style={{paddingLeft: 'unset', paddingRight: 'unset' }}>
                  <StyleImage preview={false} src={`images/${value.images?.[0]}`} width={'200px'} />
                </Col>
                <Col span={16} style={{marginTop: 12}}>
                  <Space direction='vertical' size='small'>
                    <StyleHeader>{value.display_name}</StyleHeader>
                    {/* <Progress percent={value.percentage_match} showInfo={false} /> */}
                    <Button type='default' icon={<ReadOutlined />}>Learn More</Button>
                  </Space>
                </Col>
              </Row>
            </List.Item>
          );
        })}
      </List>
    </StyledModal>
  )

  function calculatePercentageMatch(score: number): number {
    return ((score) / selectedFeatures.length) * 10;
  }
}