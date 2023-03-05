import { SearchOutlined, UpOutlined } from "@ant-design/icons";
import { FloatButton, Layout, Menu } from "antd";
import FeatureSelector from "./FeatureSelector";

const { Content, Footer, Header } = Layout;
const menuItems = [
  {
    label: 'What Style is This House?',
    key: 'finder',
    icon: <SearchOutlined />
  },
  {
    label: 'Read about Styles',
    key: 'styles',
  },
  {
    label: 'Resources',
    key: 'sources'
  },
  {
    label: 'Contact',
    key: 'contact'
  }
];

export default function FinderView() {
  return (
    <Layout className="layout">
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div
          style={{
            float: 'left',
            width: 120,
            height: 31,
            margin: '16px 24px 16px 0',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu theme="dark" mode="horizontal" items={menuItems} defaultSelectedKeys={['finder']} />
      </Header>
      <Content className="page-bg">
        <div className="content-container">
          <FeatureSelector />
          <FloatButton.BackTop icon={<UpOutlined />}/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Blah blah blah</Footer>
    </Layout>
  );
}