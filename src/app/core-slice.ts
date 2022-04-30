import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";


export interface CoreState {
  globalError?: string;
  isMobile?: boolean;
  appInitialized: boolean;
}

const initialState: CoreState = { appInitialized: false }

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
    }
  }
});

export const { setGlobalError, setIsMobile, setAppInitialized} = coreSlice.actions;

export const globalErrorSelector = (state: RootState) => state.core.globalError;
export const isMobileSelector = (state: RootState) => state.core.isMobile;

export default coreSlice.reducer;