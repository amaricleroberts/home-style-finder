import { configureStore } from '@reduxjs/toolkit'
import FeatureSlice from './FeatureSlice'
// ...

export const store = configureStore({
  reducer: {
    features: FeatureSlice
  },
})

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch