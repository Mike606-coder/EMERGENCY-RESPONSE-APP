import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Emergency {
  id: string;
  user_id: string;
  emergency_type: string;
  status: string;
  latitude: number;
  longitude: number;
  description?: string;
  created_at: string;
  responder_count: number;
}

interface EmergencyState {
  activeEmergencies: Emergency[];
  currentEmergency: Emergency | null;
  isCreating: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  activeEmergencies: [],
  currentEmergency: null,
  isCreating: false,
  error: null,
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setActiveEmergencies: (state, action: PayloadAction<Emergency[]>) => {
      state.activeEmergencies = action.payload;
    },
    setCurrentEmergency: (state, action: PayloadAction<Emergency | null>) => {
      state.currentEmergency = action.payload;
    },
    addEmergency: (state, action: PayloadAction<Emergency>) => {
      state.activeEmergencies.push(action.payload);
    },
    createEmergencyStart: (state) => {
      state.isCreating = true;
      state.error = null;
    },
    createEmergencySuccess: (state, action: PayloadAction<Emergency>) => {
      state.isCreating = false;
      state.currentEmergency = action.payload;
      state.activeEmergencies.push(action.payload);
    },
    createEmergencyError: (state, action: PayloadAction<string>) => {
      state.isCreating = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setActiveEmergencies,
  setCurrentEmergency,
  addEmergency,
  createEmergencyStart,
  createEmergencySuccess,
  createEmergencyError,
  clearError,
} = emergencySlice.actions;
export default emergencySlice.reducer;
