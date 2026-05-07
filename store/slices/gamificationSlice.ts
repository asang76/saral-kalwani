import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GamificationState } from "@/types";
import giftIcon from "../../public/assets/gift.png";
import crownIcon from "../../public/assets/Crown.png";
import percent from "../../public/assets/percent.png";

const initialState: GamificationState = {
  enabled: false,
  features: [
    {
      id: 1,
      icon: giftIcon,
      title: "Reward Your Ambassadors",
      description:
        "Boost campaign performance by setting up rewards for ambassadors",

      innerBg: "bg-white",
      active: false,
    },
    {
      id: 2,
      icon: crownIcon,
      title: "Set Milestones",
      description:
        "Set up custom goals for sales, posts, or time-based achievements",

      innerBg: "bg-white",
      active: false,
    },
    {
      id: 3,
      icon: percent,
      title: "Customise Incentives",
      description:
        "Create custom incentives like flat fees, free products, or special commissions.",

      innerBg: "bg-white",
      active: false,
    },
  ],
};

const gamificationSlice = createSlice({
  name: "gamification",
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
