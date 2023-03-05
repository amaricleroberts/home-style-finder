import { Row } from "antd";
import { useSelector } from "react-redux";
import { getSelectedFeatures } from "../../redux/FeatureSlice";
import CardWithFeatures from "./CardWithFeatures";
import EmptyResultsCard from "./EmptyResultsCard";


export default function ResultsCard() {
  const selectedFeatures = useSelector(getSelectedFeatures);
  
  return (
    <Row gutter={[24, 24]} justify='center'>
      {selectedFeatures.length ? <CardWithFeatures /> : <EmptyResultsCard />}
    </Row>
  );
}