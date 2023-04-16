import { Row } from "antd";
import { useSelector } from "react-redux";
import { getSelectedFeatures } from "../../redux/FeatureSlice";
import CardWithFeatures from "./CardWithFeatures";
import EmptyCard from "./EmptyCard";
import { HomeStyle } from "../../features/featureList";

type HeroCardProps = {
  styles: HomeStyle[];
}
export default function HeroCard({
  styles
}: HeroCardProps) {
  const selectedFeatures = useSelector(getSelectedFeatures);
  
  return (
    <Row gutter={[24, 24]} justify='center'>
      {selectedFeatures.length ? <CardWithFeatures styles={styles} /> : <EmptyCard />}
    </Row>
  );
}