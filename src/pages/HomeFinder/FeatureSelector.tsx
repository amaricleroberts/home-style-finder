import FeatureSectionHeader from '../../components/FeatureSectionHeader';
import { Anchor, Col, Row } from 'antd';
import FeaturesCard from '../../components/FeatureCard/FeaturesCard';
import firestoreQueries from '../../utils/readFromFirestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { HomePart, HomeStyle } from '../../features/featureList';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import HeroCard from '../../components/HeroCard/HeroCard';

export default function FeatureSelector() {
  const [loading, setLoading] = useState(true);
  const [rawParts, setRawParts] = useState<DocumentData>();
  const [rawFeatures, setRawFeatures] = useState<DocumentData>();
  const [rawStyles, setRawStyles] = useState<DocumentData>();

  console.log('loading feature selector');

  // useEffect(() => {
  //   setLoading(true);
  //   const stylesPromise =
  //     firestoreQueries.getCollectionOrdered('styles', 'display_name', true)
  //       .then((data) => {
  //         let parsed: HomeStyle[] = [];
  //         data.forEach((doc: DocumentData) => {
  //           const docData = doc.data();
  //           parsed.push({
  //             id: doc.id,
  //             display_name: docData.display_name,
  //             images: docData.images,
  //             time_period: docData.time_period,
  //             origin: docData.origin
  //           });
  //         });
  //         setStyles(parsed);
  //       });
  //   Promise.all([stylesPromise]).finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    setLoading(true);
    const partsPromise = firestoreQueries.getCollectionOrdered('parts', 'priority', true).then((data) => {
      setRawParts(data)
    });
    const featuresPromise = firestoreQueries.getCollectionOrdered('features', 'priority', true).then((data) => {
      setRawFeatures(data)
    });
    const stylesPromise = firestoreQueries.getCollectionOrdered('styles', 'display_name', true).then((data) => {
      setRawStyles(data)
    });
    Promise.all([partsPromise, featuresPromise, stylesPromise]).finally(() => setLoading(false));
  }, []);

  let featureCategories: {[key: string]: HomePart} = {};
  if (rawParts !== undefined) rawParts.forEach((doc: DocumentData) => {
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
    if (featureCategories[featureDocData.parent.id]) {
      featureCategories[featureDocData.parent.id].features.push({
        id: doc.id,
        title: featureDocData.display_name,
        fullTitle: featureDocData.full_display_name ? featureDocData.full_display_name: featureDocData.display_name,
        description: featureDocData.description,
        image: featureDocData.image_path,
        parentId: featureDocData.parent.id,
      });
    } else {
      console.warn('missing part category: ', featureDocData.parent.id);
    }
  });

  let homeStyles: HomeStyle[] = [];
  if (rawStyles) rawStyles.forEach((doc: DocumentData) => {
    const docData = doc.data();
    homeStyles.push({
      id: doc.id,
      display_name: docData.display_name,
      images: docData.images,
      time_period: docData.time_period,
      origin: docData.origin
    });
  });

  console.log('home styles: ', homeStyles);

  const featureMatrix: JSX.Element[] = [];
  const anchorItems: AnchorLinkItemProps[] = [];
  Object.keys(featureCategories).forEach((categoryId, index) => {
    const curCategory: HomePart = featureCategories[categoryId];
    if (curCategory.features.length) {
      featureMatrix.push(
        <FeatureSectionHeader key={`title-${index}`} title={curCategory.name} id={curCategory.id} weight='main' />
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
          feature={feature}
          loading={loading}
          key={feature.id}
        />
      )
    });
    if (featureCards.length) {
      featureMatrix.push(
        <Row gutter={[24, 24]} key={index}>
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
          <HeroCard styles={homeStyles} />
          {featureMatrix}
        </Col>
      </Row>
    </>
  );
}

