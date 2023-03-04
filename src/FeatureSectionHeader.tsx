import { Row, Typography } from "antd"

type FeatureSectionHeaderProps = {
  title: string;
  weight: TSectionHeaderWeight;
  id: string;
}

type TSectionHeaderWeight = 'main' | 'sub';

export default function FeatureSectionHeader({
  title,
  id,
  weight
}: FeatureSectionHeaderProps) {
  const typographyClass = weight === 'main' ? 'group-header' : 'group-subheader';
  return (
    <Row gutter={[24, 24]}>
      <Typography.Paragraph id={id} className={typographyClass}>{title}</Typography.Paragraph>
    </Row>
  )
}