import FeatureSectionHeader from '../../components/FeatureSectionHeader';
import { Anchor, Col, Row } from 'antd';
import FeaturesCard from '../../components/FeatureCard/FeaturesCard';
import firestoreQueries from '../../utils/readFromFirestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { HomePart } from '../../features/featureList';
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import ResultsCard from '../../components/ResultsCard/ResultsCard';
import { useSelector } from 'react-redux';
import { addOrIncrementMatchCandidate, getSelectedFeatures } from '../../redux/FeatureSlice';
import { useAppDispatch } from '../../redux/hooks';

export default function FeatureSelector() {
  const [loading, setLoading] = useState(true);
  const [rawParts, setRawParts] = useState<DocumentData>();
  const [rawFeatures, setRawFeatures] = useState<DocumentData>();
  const selectedFeatures = useSelector(getSelectedFeatures);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    const partsPromise = firestoreQueries.getCollectionOrdered('parts', 'priority', true).then((data) => {
      setRawParts(data)
    });
    const featuresPromise = firestoreQueries.getCollectionOrdered('features', 'priority', true).then((data) => {
      setRawFeatures(data)
    });
    Promise.all([partsPromise, featuresPromise]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const featureKeys = selectedFeatures.map((feature) => {
      return feature.id;
    });

    console.log('latest feature keys: ', featureKeys);
    if (featureKeys.length) {
      firestoreQueries.getCollectionByQueryingId('/feature_styles', 'in', featureKeys)
        .then(
          (data) => {
            data.forEach((doc: DocumentData) => {
              const styleDocData = doc.data();
              console.log('match candidate doc data: ', styleDocData);
              const styleDocKey = Object.keys(styleDocData)[0];
              dispatch(addOrIncrementMatchCandidate(
                {
                  key: styleDocKey,
                  score: styleDocData[styleDocKey]
                }
              ));
            });
          }
        )
        .catch((error) => console.warn(error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFeatures]);

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
          feature={feature}
          loading={loading}
          key={feature.id}
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
          <ResultsCard />
          {featureMatrix}
        </Col>
      </Row>
    </>
  );
}

