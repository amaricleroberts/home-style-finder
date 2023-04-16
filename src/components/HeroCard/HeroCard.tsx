import { Row } from "antd";
import { useSelector } from "react-redux";
import { getSelectedFeatures } from "../../redux/FeatureSlice";
import CardWithFeatures from "./CardWithFeatures";
import EmptyCard from "./EmptyCard";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import firestoreQueries from "../../utils/readFromFirestore";
import { HomeStyle } from "../../features/featureList";


export default function HeroCard() {
  const selectedFeatures = useSelector(getSelectedFeatures);
  const [styles, setStyles] = useState<HomeStyle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const stylesPromise = 
      firestoreQueries.getCollectionOrdered('styles', 'display_name', true)
      .then((data) => {
        let parsed: HomeStyle[] = [];
        data.forEach((doc: DocumentData) => {
          const docData = doc.data();
          parsed.push({
            id: doc.id,
            display_name: docData.display_name,
            images: docData.images,
            time_period: docData.time_period,
            origin: docData.origin
          });
        });
        setStyles(parsed);
      });
    Promise.all([stylesPromise]).finally(() => setLoading(false));
  }, []);
  
  return (
    <Row gutter={[24, 24]} justify='center'>
      {selectedFeatures.length ? <CardWithFeatures styles={styles} /> : <EmptyCard />}
    </Row>
  );
}