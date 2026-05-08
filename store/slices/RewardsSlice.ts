import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface Reward {
  id: string;
  event: string;         
  rewardWith: string;    
  timeBound: boolean;
  endDate: string;       
  createdAt: string;     
}

interface RewardsState {
  items: Reward[];
}

const initialState: RewardsState = {
  items: [],
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    addReward(state, action: PayloadAction<Omit<Reward, 'id' | 'createdAt'>>) {
      state.items.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    },
    removeReward(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
  },
});

export const { addReward, removeReward } = rewardsSlice.actions;
export default rewardsSlice.reducer;