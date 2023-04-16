import { HomeOutlined } from "@ant-design/icons";
import { Space } from "antd";
import styled from "styled-components";

const WrapperDiv = styled.div`
  background: #FFFFFF;
  border: 4px solid #2D3F5E;
  width: 100%;
  padding: 40px;
  min-height: 200px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
`;

const StyledSubtitle = styled.p`
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1rem;
  line-height: .5rem;
  letter-spacing: 0em;
  text-align: center;
`;

export default function EmptyCard() {
  return (
    <WrapperDiv>
      <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
        <HomeOutlined style={{ fontSize: '45px', color: "#2D3F5E" }} />
        <StyledSubtitle>To get started, select some features from the sections below.</StyledSubtitle>
      </Space>
    </WrapperDiv>
  )
}