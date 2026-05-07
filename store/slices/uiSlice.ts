import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, ModalType, DropdownId } from '@/types';

const initialState: UIState = {
  notifications: 5,
  modalOpen: null,
  activeDropdown: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Notifications ──────────────────────────────────────────────────────────
    clearNotifications(state) {
      state.notifications = 0;
    },

    // ── Modals ─────────────────────────────────────────────────────────────────
    openModal(state, action: PayloadAction<ModalType>) {
      state.modalOpen = action.payload;
      state.activeDropdown = null;
    },
    closeModal(state) {
      state.modalOpen = null;
      state.activeDropdown = null;
    },

    // ── Dropdowns ──────────────────────────────────────────────────────────────
    /** Open a specific dropdown — closes any other that was open */
    openDropdown(state, action: PayloadAction<DropdownId>) {
      state.activeDropdown = action.payload;
    },
    /** Toggle: opens if closed, closes if already open */
    toggleDropdown(state, action: PayloadAction<DropdownId>) {
      state.activeDropdown =
        state.activeDropdown === action.payload ? null : action.payload;
    },
    /** Close whichever dropdown is open */
    closeDropdown(state) {
      state.activeDropdown = null;
    },
  },
});

export const {
  clearNotifications,
  openModal,
  closeModal,
  openDropdown,
  toggleDropdown,
  closeDropdown,
} = uiSlice.actions;

export default uiSlice.reducer;