import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  shareLocation: boolean;
  accuracy: 'precise' | 'approximate' | 'city';
  updateInterval: number;
  error: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  shareLocation: true,
  accuracy: 'precise',
  updateInterval: 10,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setShareLocation: (state, action: PayloadAction<boolean>) => {
      state.shareLocation = action.payload;
    },
    setAccuracy: (state, action: PayloadAction<'precise' | 'approximate' | 'city'>) => {
      state.accuracy = action.payload;
    },
    setUpdateInterval: (state, action: PayloadAction<number>) => {
      state.updateInterval = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentLocation,
  setTracking,
  setShareLocation,
  setAccuracy,
  setUpdateInterval,
  setLocationError,
  clearLocationError,
} = locationSlice.actions;
export default locationSlice.reducer;
