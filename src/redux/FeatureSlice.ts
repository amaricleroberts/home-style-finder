import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeFeature } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: HomeFeature[];
};

const initialState: FeatureState = {
  selectedFeatures: [],
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
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const { 
  resetState,
  removeSelectedFeature,
  toggleSelectedFeature,
} = FeatureSlice.actions;

export default FeatureSlice.reducer