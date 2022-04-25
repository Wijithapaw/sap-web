import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";


export interface CoreState {
  globalError?: string;
}

const initialState: CoreState = {}

export const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<string>) => {
      state.globalError = action.payload
    }
  }
});

export const { setGlobalError } = coreSlice.actions;

export const globalErrorSelector = (state: RootState) => state.core.globalError;

export default coreSlice.reducer;