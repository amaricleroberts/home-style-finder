import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeStyle } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: string[];
  matches: HomeStyle[];
};

const initialState: FeatureState = {
  selectedFeatures: [],
  matches: [],
};

export const FeatureSlice = createSlice({
  name: 'FeatureSelector',
  initialState,
  reducers: {
    resetState: () => initialState,
    initializeState(state, { payload: { selectedFeatures, matches },}: PayloadAction<{selectedFeatures: string[]; matches: HomeStyle[];}>) {
      state.selectedFeatures = selectedFeatures;
      state.matches = matches;
    },
    addSelectedFeature(state, { payload: feature }: PayloadAction<string>) {
      console.log('adding: ', feature);
      state.selectedFeatures.push(feature);
    },
    removeSelectedFeature(state, { payload: feature}: PayloadAction<string>) {
      //TODO - consider using Lodash
      console.log('removing: ', feature);
      let filtered = state.selectedFeatures.filter((value) => {
        return value !== feature;
      });
      state.selectedFeatures = filtered;
    },
    toggleSelectedFeature(state, { payload: feature}: PayloadAction<string>) {
      console.log('toggling: ', feature);
      if(state.selectedFeatures.includes(feature)) {
        let removeCurrentFeature = state.selectedFeatures.filter((value) => {
          return value !== feature;
        });
        state.selectedFeatures = removeCurrentFeature;
      }
      else state.selectedFeatures.push(feature);
    }
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const { resetState, initializeState, addSelectedFeature, removeSelectedFeature, toggleSelectedFeature } = FeatureSlice.actions;

export default FeatureSlice.reducer