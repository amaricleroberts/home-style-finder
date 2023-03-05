import { HomeOutlined } from "@ant-design/icons";
import { Row, Space, Typography } from "antd";

export default function EmptyCard() {
  return (
    <Row gutter={[24, 24]} justify='center'>
      <div className="topCard">
        <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
          <HomeOutlined style={{ fontSize: '45px', color: "#2D3F5E" }} />
          <Typography.Paragraph>To get started, select some features from the sections below.</Typography.Paragraph>
        </Space>
      </div>
    </Row>
  );
}