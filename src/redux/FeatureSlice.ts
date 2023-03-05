import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeFeature, RawStyleMatch } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: HomeFeature[];
  rawMatches: RawStyleMatch[];
};

const initialState: FeatureState = {
  selectedFeatures: [],
  rawMatches: [],
};

export const FeatureSlice = createSlice({
  name: 'FeatureSelector',
  initialState,
  reducers: {
    resetState: () => initialState,
    // initializeState(state, { payload: { selectedFeatures, rawMatches },}: PayloadAction<{selectedFeatures: HomeFeature[]; rawMatches: RawStyleMatch;}>) {
    //   state.selectedFeatures = selectedFeatures;
    //   state.rawMatches = rawMatches;
    // },
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
    },
    clearSelectedFeatures(state) {
      state.selectedFeatures = initialState.selectedFeatures;
    },
    addOrIncrementRawMatch(state, { payload: match }: PayloadAction<RawStyleMatch>) {
      const existingMatch = state.rawMatches.findIndex((value) => value.key === match.key);
      if (existingMatch > -1) {
        state.rawMatches[existingMatch].score += match.score;
      } else {
        state.rawMatches.push(match);
      }
    }
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const getRawMatches = (state: RootState) => state.features.rawMatches;
export const { resetState, removeSelectedFeature, toggleSelectedFeature, clearSelectedFeatures, addOrIncrementRawMatch } = FeatureSlice.actions;

export default FeatureSlice.reducer