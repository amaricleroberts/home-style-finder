import FeatureSectionHeader from './FeatureSectionHeader';
import { Anchor, Col, Row } from 'antd';
import FeaturesCard from './FeaturesCard';
import firestoreQueries from './utils/readFromFirestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { HomeFeature, HomePart } from './features/featureList';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import EmptyCard from './EmptyCard';

export default function FeatureSelector() {
  const [loading, setLoading] = useState(true);
  const [rawParts, setRawParts] = useState<DocumentData>();
  const [rawFeatures, setRawFeatures] = useState<DocumentData>();
  const [selectedFeatures, setSelectedFeatures] = useState<{}>({});

  useEffect(() => {
    setLoading(true);
    const partsPromise = firestoreQueries.getCollection('/parts/').then((data) => {
      setRawParts(data)
    });
    const featuresPromise = firestoreQueries.getCollection('features').then((data) => {
      setRawFeatures(data)
    });
    Promise.all([partsPromise, featuresPromise]).finally(() => setLoading(false));
  }, []);

  let featureCategories: {[key: string]: HomePart} = {};
  if (rawParts) rawParts.forEach((doc: DocumentData) => {
    const partDocData = doc.data();
    featureCategories = 
    { ...featureCategories, 
      [doc.id]: {
        id: doc.id,
        name: partDocData.display_name,
        features: [],
      }
    }
  });

  if (rawFeatures) rawFeatures.forEach((doc: DocumentData) => {
    const featureDocData = doc.data();
    featureCategories[featureDocData.parent.id].features.push({
      id: doc.id,
      title: featureDocData.display_name,
      description: featureDocData.description,
      image: featureDocData.image_path,
      parentId: featureDocData.parent.id,
    });
  });

  const featureMatrix: JSX.Element[] = [];
  const anchorItems: AnchorLinkItemProps[] = [];
  Object.keys(featureCategories).forEach((categoryId) => {
    const curCategory: HomePart = featureCategories[categoryId];
    if (curCategory.features.length) {
      featureMatrix.push(
        <FeatureSectionHeader title={curCategory.name} id={curCategory.id} weight='main' />
      ); 
      anchorItems.push({
        key: curCategory.id,
        href: `#${curCategory.id}`,
        title: curCategory.name,
      });
    }
    const featureCards: JSX.Element[] = [];
    curCategory.features.forEach((feature) => {
      featureCards.push(
        <FeaturesCard 
          id={feature.id}
          title={feature.title}
          description={feature.description}
          image={feature.image}
          loading={loading}
          selectedFeatures={selectedFeatures}
        />
      )
    });
    if (featureCards.length) {
      featureMatrix.push(
        <Row gutter={[24, 24]}>
          {featureCards}
        </Row>
      );
    }
  })
  return (
    <>
      <Row>
        <Col span={4}>
          <Anchor
            items={anchorItems}
            targetOffset={64}
          />
        </Col>
        <Col span={20}>
          <EmptyCard />
          {featureMatrix}
        </Col>
      </Row>
    </>
  );
}
