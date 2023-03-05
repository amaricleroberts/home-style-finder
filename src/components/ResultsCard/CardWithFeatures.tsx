import { SearchOutlined } from "@ant-design/icons";
import { Button, Row, Space, Tag } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { clearSelectedFeatures, getSelectedFeatures, removeSelectedFeature } from "../../redux/FeatureSlice";
import { useAppDispatch } from "../../redux/hooks";

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
const SubmitButton = styled(Button)`
  border-radius: 0px;
  background-color: #2D3F5E;
`;
const ResetButton = styled(Button)`
  border-radius: 0px;
  color: #2D3F5E;
`;
export default function CardWithFeatures() {
  const selectedFeatures = useSelector(getSelectedFeatures);
  const dispatch = useAppDispatch();

  const children = selectedFeatures.map((feature) => {
    return <FeatureTag key={feature} closable onClose={() => removeFeature(feature)}>{feature}</FeatureTag>
  })
  return (
    <WrapperDiv>
      <Row style={{ marginBottom: '6px' }}>
        <SelectedFeaturesHeader>Selected Features:</SelectedFeaturesHeader>
      </Row>
      <Row>{children}</Row>
      <Row justify='end'>
        <Space direction="horizontal">
          <SubmitButton type='primary' icon={<SearchOutlined />}>Find Style</SubmitButton>
          <ResetButton onClick={clearFeatures}>Clear</ResetButton>
        </Space>
      </Row>
    </WrapperDiv>
  );

  function clearFeatures() {
    dispatch(clearSelectedFeatures());
  }

  function removeFeature(feature: string) {
    dispatch(removeSelectedFeature(feature));
  }
  
}