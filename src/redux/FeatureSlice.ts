import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeFeature, HomeStyle, StyleMatchCandidate } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: HomeFeature[];
  matchCandidates: StyleMatchCandidate[];
  selectedMatches: HomeStyle[];
};

const initialState: FeatureState = {
  selectedFeatures: [],
  matchCandidates: [],
  selectedMatches: [],
};

export const FeatureSlice = createSlice({
  name: 'FeatureSelector',
  initialState,
  reducers: {
    resetState: () => initialState,
    removeSelectedFeature(state, { payload: feature}: PayloadAction<HomeFeature>) {
      //TODO - consider using Lodash
      let filtered = state.selectedFeatures.filter((value) => {
        return value.id !== feature.id;
      });
      state.selectedFeatures = filtered;
    },
    toggleSelectedFeature(state, { payload: feature}: PayloadAction<HomeFeature>) {
      const filteredFeatures = state.selectedFeatures.filter((value) => {
        return value.id === feature.id;
      });

      if(filteredFeatures.length) {
        let removeCurrentFeature = state.selectedFeatures.filter((value) => {
          return value.id !== feature.id;
        });
        state.selectedFeatures = removeCurrentFeature;
      }
      else state.selectedFeatures.push(feature);

      console.log('selected features: ', state.selectedFeatures);
    },
    clearSelectedFeatures(state) {
      state.selectedFeatures = initialState.selectedFeatures;
    },
    addOrIncrementMatchCandidate(state, { payload: match }: PayloadAction<StyleMatchCandidate>) {
      console.log('candidate: ', match);
      const existingMatch = state.matchCandidates.findIndex((value) => value.key === match.key);
      if (existingMatch > -1) {
        state.matchCandidates[existingMatch].score += match.score;
      } else {
        state.matchCandidates.push(match);
      }
      console.log('all candidate matches: ', state.matchCandidates);
    },
    calculateFinalMatches(state) {
      console.log('calculating result');
      let finalMatchCandidates: StyleMatchCandidate[] = [];
      if(state.matchCandidates.length) {
        console.log('looping through candidates');
        const numFeaturesSelected = state.selectedFeatures.length;
        console.log('# selected features: ', numFeaturesSelected);
        const minimumScore = numFeaturesSelected * 5;
        console.log('min score: ', minimumScore);
        state.matchCandidates.sort((a: StyleMatchCandidate, b: StyleMatchCandidate) => {
          return (a.score > b.score) ? 1 : -1;
        })

        console.log('sorted candidates: ', state.matchCandidates);

        state.matchCandidates.forEach((match) => {
          console.log('potential match to check score: ', match);
          if(match.score >= minimumScore) {
            console.log('potential match ', match.key, ' with score ', match.score);
            finalMatchCandidates.push(match);
          }
        });

        //TODO - handle empty candidates
        state.matchCandidates  = finalMatchCandidates;
      }

      console.log('final candidates: ', finalMatchCandidates);
    },
    addSelectedMatch(state, { payload: match }: PayloadAction<HomeStyle>) {
      state.selectedMatches.push(match);
    },
    setSelectedMatches(state, { payload: match }: PayloadAction<HomeStyle[]>) {
      state.selectedMatches = match;
    },
    setMatchCandidates(state, { payload: matches }: PayloadAction<StyleMatchCandidate[]>) {
      state.matchCandidates = matches;
    },
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const getMatchCandidates = (state: RootState) => state.features.matchCandidates;
export const getSelectedMatches = (state: RootState) => state.features.selectedMatches;
export const { 
  resetState,
  removeSelectedFeature,
  toggleSelectedFeature,
  clearSelectedFeatures,
  addOrIncrementMatchCandidate,
  setMatchCandidates,
  addSelectedMatch,
  setSelectedMatches,
  calculateFinalMatches,
} = FeatureSlice.actions;

export default FeatureSlice.reducer