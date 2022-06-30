import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { SapNotification } from "./types";


export interface CoreState {
  globalError?: string;
  isMobile?: boolean;
  appInitialized: boolean;
  notifications: SapNotification[];
}

const initialState: CoreState = { appInitialized: false, notifications: [] }

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<string>) => {
      state.globalError = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setAppInitialized: (state, action: PayloadAction<boolean>) => {
      state.appInitialized = action.payload;
    }, 
    showToast: (state, action: PayloadAction<SapNotification>) => {
      state.notifications.push(action.payload);
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id == action.payload);
      state.notifications.splice(index, 1);
    }
  }
});

export const { setGlobalError, setIsMobile, setAppInitialized, dismissToast, showToast } = coreSlice.actions;

export const globalErrorSelector = (state: RootState) => state.core.globalError;
export const isMobileSelector = (state: RootState) => state.core.isMobile;
export const notificationSelector = (state: RootState) => state.core.notifications;

export default coreSlice.reducer;