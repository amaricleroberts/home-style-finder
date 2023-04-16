import { Row } from "antd";
import { useSelector } from "react-redux";
import { getSelectedFeatures } from "../../redux/FeatureSlice";
import CardWithFeatures from "./CardWithFeatures";
import EmptyCard from "./EmptyCard";

export default function HeroCard() {
  const selectedFeatures = useSelector(getSelectedFeatures);
  
  return (
    <Row gutter={[24, 24]} justify='center'>
      {selectedFeatures.length ? <CardWithFeatures /> : <EmptyCard />}
    </Row>
  );
}