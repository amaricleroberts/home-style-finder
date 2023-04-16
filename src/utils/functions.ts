import { DocumentData } from "firebase/firestore";
import { HomeFeature, StyleMatchCandidate } from "../features/featureList";
import firestoreQueries from "./readFromFirestore";

export function calculateMatchCandidates(selectedFeatures: HomeFeature[]): Promise<StyleMatchCandidate[]> {
  let matchCandidates: StyleMatchCandidate[] = [];
  const featureKeys = selectedFeatures.map((feature) => {
    return feature.id;
  });

  console.log('latest feature keys: ', featureKeys);
  return firestoreQueries.getCollectionByQueryingId('/feature_styles', 'in', featureKeys)
    .then((data) => {
      data.forEach((doc: DocumentData) => {
        const styleDocData = doc.data();
        Object.keys(styleDocData).forEach((key) => {
          matchCandidates = 
            addOrIncrementMatchCandidate(
              matchCandidates, 
              {
                key: key,
                score: styleDocData[key]
              }
            );
        })
      })
      return matchCandidates;
    });
}

function addOrIncrementMatchCandidate(existingMatches: StyleMatchCandidate[], match: StyleMatchCandidate): StyleMatchCandidate[] {
  console.log('candidate: ', match);
  const existingMatch = existingMatches.filter((value) => { return value.key === match.key; });
  if (existingMatch.length) {
    console.log(`incrementing match ${match.key}`);
    const allOtherMatches = existingMatches.filter((value) => { return value.key !== match.key; });
    const newExistingMatch: StyleMatchCandidate = {
      key: existingMatch[0].key,
      score: existingMatch[0].score + match.score
    };
    return [...allOtherMatches, newExistingMatch];
  } else {
    console.log(`adding match candidate: ${match.key}`);
    return [...existingMatches, match];
  }
};