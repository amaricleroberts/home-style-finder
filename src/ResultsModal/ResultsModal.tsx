import { Button, Carousel, Col, Image, List, Modal, Progress, Row, Space } from "antd";
import styled from "styled-components";
import { FeatureCardSubtitle } from "../components/HeroCard/CardWithFeatures";
import FeatureSectionHeader from "../components/FeatureSectionHeader";
import { ReadOutlined } from "@ant-design/icons";
import { HomeStyle, HomeStyleMatch, StyleMatchCandidate } from "../features/featureList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedFeatures } from "../redux/FeatureSlice";

const StyledModal = styled(Modal)`
  border-radius: 0px;
  width: 600px;
`;

const CarouselImage = styled(Image)`
  objectFit: 'contain';
`;

type ResultsModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  matchCandidates: StyleMatchCandidate[];
  styles: HomeStyle[],
}

export default function ResultsModal({
  open,
  onCancel,
  onOk,
  matchCandidates,
  styles,
}: ResultsModalProps) {
  const [loading, setLoading] = useState(true);
  console.log(matchCandidates);
  const [styleMatches, setStyleMatches] = useState<HomeStyleMatch[]>([]);
  const selectedFeatures = useSelector(getSelectedFeatures);

  console.log(selectedFeatures.length);

  useEffect(() => {
    console.log('doing things here');
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
  }, []);

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
        header={<FeatureCardSubtitle>RESULTS</FeatureCardSubtitle>}
        loading={loading} //todo
      >
        {styleMatches.map((value, index) => {
          return (
            <List.Item key={index}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Carousel>
                    {value.images?.map((image: string, index: number) => {
                      return (
                        <CarouselImage key={index} src={`images/${image}`} preview={false} width={'200px'} />
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
                    <Progress percent={value.percentage_match} />
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