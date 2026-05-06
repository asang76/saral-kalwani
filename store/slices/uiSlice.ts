import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, ModalType } from '@/types';

const initialState: UIState = {
  notifications: 5,
  modalOpen: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = 0;
    },
    openModal(state, action: PayloadAction<ModalType>) {
      state.modalOpen = action.payload;
    },
    closeModal(state) {
      state.modalOpen = null;
    },
  },
});

export const { clearNotifications, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
