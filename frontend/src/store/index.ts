import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import chatReducer from './store/chatSlice';
import locationReducer from './store/locationSlice';
import emergencyReducer from './store/emergencySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    location: locationReducer,
    emergency: emergencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
