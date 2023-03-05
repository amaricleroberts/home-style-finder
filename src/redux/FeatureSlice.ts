import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeFeature, HomeStyle } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: HomeFeature[];
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
    initializeState(state, { payload: { selectedFeatures, matches },}: PayloadAction<{selectedFeatures: HomeFeature[]; matches: HomeStyle[];}>) {
      state.selectedFeatures = selectedFeatures;
      state.matches = matches;
    },
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
    }
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const { resetState, initializeState, removeSelectedFeature, toggleSelectedFeature, clearSelectedFeatures } = FeatureSlice.actions;

export default FeatureSlice.reducer