import { configureStore } from '@reduxjs/toolkit';
import gamificationReducer from './slices/gamificationSlice';
import uiReducer from './slices/uiSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    gamification: gamificationReducer,
    ui: uiReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
