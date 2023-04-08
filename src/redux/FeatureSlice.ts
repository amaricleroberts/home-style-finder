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
        console.log(`feature ${feature} already exists, removing`);
        let removeCurrentFeature = state.selectedFeatures.filter((value) => {
          return value.id !== feature.id;
        });
        state.selectedFeatures = removeCurrentFeature;
      }
      else {
        const newState = [...state.selectedFeatures, feature];
        state.selectedFeatures = newState;
      }

      //console.log('selected features: ', state.selectedFeatures);
    },
    clearSelectedFeatures(state) {
      state.selectedFeatures = initialState.selectedFeatures;
    },
    addOrIncrementMatchCandidate(state, { payload: match }: PayloadAction<StyleMatchCandidate>) {
      console.log('candidate: ', match);
      const existingMatch = state.matchCandidates.filter((value) => { return value.key === match.key; });
      if (existingMatch.length) {
        console.log(`incrementing match ${match.key}`);
        const allOtherMatches = state.matchCandidates.filter((value) => { return value.key !== match.key; });
        const newExistingMatch: StyleMatchCandidate = {
          key: existingMatch[0].key,
          score: existingMatch[0].score + match.score
        };
        const newState = [...allOtherMatches, newExistingMatch];
        state.matchCandidates = newState;
      } else {
        console.log(`adding match candidate: ${match.key}`);
        state.matchCandidates = [...state.matchCandidates, match];
      }
      console.log('all candidate matches: ', state.matchCandidates);
    },
    calculateFinalMatches(state) {
      console.log('calculating result');
      let finalMatchCandidates: StyleMatchCandidate[] = [];
      console.log(`number of candidates ${state.matchCandidates.length}`);
      if(state.matchCandidates.length) {
        console.log('looping through candidates');
        const numFeaturesSelected = state.selectedFeatures.length;
        console.log('# selected features: ', numFeaturesSelected);
        const minimumScore = numFeaturesSelected * 5;
        console.log('min score: ', minimumScore);
        // const sortedMatchCandidates = state.matchCandidates.sort((a: StyleMatchCandidate, b: StyleMatchCandidate) => {
        //   return (a.score > b.score) ? 1 : -1;
        // })

        state.matchCandidates.forEach((match) => {
          console.log('potential match to check score: ', match);
          if(match.score >= minimumScore) {
            console.log('potential match ', match.key, ' with score ', match.score);
            finalMatchCandidates.push(match);
          }
        });

        console.log('sorting');
        finalMatchCandidates.sort((a: StyleMatchCandidate, b: StyleMatchCandidate) => {
          console.log(`candidate a: ${a.score} vs candidate b: ${b.score}`);
          return (a.score > b.score) ? -1 : 1;
        });

        //TODO - handle empty candidates
        state.matchCandidates  = finalMatchCandidates;
      }

      console.log('final candidates: ', finalMatchCandidates);
    },
    addSelectedMatch(state, { payload: match }: PayloadAction<HomeStyle>) {
      state.selectedMatches = [...state.selectedMatches, match];
    },
    setSelectedMatches(state, { payload: matches }: PayloadAction<HomeStyle[]>) {
      state.selectedMatches = matches;
    },
    clearSelectedMatches(state) {
      state.selectedMatches = initialState.selectedMatches;
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
  clearSelectedMatches,
  calculateFinalMatches,
} = FeatureSlice.actions;

export default FeatureSlice.reducer