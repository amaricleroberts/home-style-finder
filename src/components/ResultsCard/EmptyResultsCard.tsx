import { HomeOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import styled from "styled-components";

const WrapperDiv = styled.div`
    background: #FFFFFF;
    border: 4px solid #2D3F5E;
    width: 100%;
    padding: 40px;
`;

export default function EmptyResultsCard() {
  return (
    <WrapperDiv>
      <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
        <HomeOutlined style={{ fontSize: '45px', color: "#2D3F5E" }} />
        <Typography.Paragraph>To get started, select some features from the sections below.</Typography.Paragraph>
      </Space>
    </WrapperDiv>
  )
}