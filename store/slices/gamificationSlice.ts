import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GamificationState } from '@/types';

const initialState: GamificationState = {
  enabled: false,
  features: [
    {
      id: 1,
      icon: '🎁',
      title: 'Reward Your Ambassadors',
      description: 'Boost campaign performance by setting up rewards for ambassadors',
      outerBg: 'from-purple-100 to-pink-100',
      innerBg: 'from-purple-500 to-pink-500',
      active: false,
    },
    {
      id: 2,
      icon: '👑',
      title: 'Set Milestones',
      description: 'Set up custom goals for sales, posts, or time-based achievements',
      outerBg: 'from-violet-100 to-purple-100',
      innerBg: 'from-violet-700 to-purple-500',
      active: false,
    },
    {
      id: 3,
      icon: '🏷️',
      title: 'Customise Incentives',
      description: 'Create custom incentives like flat fees, free products, or special commissions.',
      outerBg: 'from-purple-100 to-fuchsia-100',
      innerBg: 'from-purple-500 to-fuchsia-400',
      active: false,
    },
  ],
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    enableGamification(state) {
      state.enabled = true;
    },
    disableGamification(state) {
      state.enabled = false;
    },
    toggleGamification(state) {
      state.enabled = !state.enabled;
    },
    toggleFeature(state, action: PayloadAction<number>) {
      const feature = state.features.find((f) => f.id === action.payload);
      if (feature) feature.active = !feature.active;
    },
  },
});

export const {
  enableGamification,
  disableGamification,
  toggleGamification,
  toggleFeature,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
