import { createSlice } from '@reduxjs/toolkit';
import type { StatsState } from '@/types';

const initialState: StatsState = {
  items: [
    { id: 1, label: 'Total Ambassadors', value: '1,284', change: '+12%', up: true },
    { id: 2, label: 'Active Campaigns', value: '7', change: '+2', up: true },
    { id: 3, label: 'Rewards Given', value: '$24,500', change: '+8.3%', up: true },
    { id: 4, label: 'Conversion Rate', value: '18.4%', change: '-1.2%', up: false },
  ],
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
});

export default statsSlice.reducer;
