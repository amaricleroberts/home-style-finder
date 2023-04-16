import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeFeature, HomeStyle } from "../features/featureList";
import { RootState } from "./store";

type FeatureState = {
  selectedFeatures: HomeFeature[];
  homeStyles: HomeStyle[];
};

const initialState: FeatureState = {
  selectedFeatures: [],
  homeStyles: [],
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
    setHomeStyles(state, { payload: styles}: PayloadAction<HomeStyle[]>) {
      console.log('setting home styles to: ', styles);
      state.homeStyles = styles;
    }
  }
})
export const getSelectedFeatures = (state: RootState) => state.features.selectedFeatures;
export const getHomeStyles = (state: RootState) => state.features.homeStyles;
export const { 
  resetState,
  removeSelectedFeature,
  toggleSelectedFeature,
  setHomeStyles,
} = FeatureSlice.actions;

export default FeatureSlice.reducer