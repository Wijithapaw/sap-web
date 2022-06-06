import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PagedResult } from "../../app/types";
import { WorkLog, WorkLogSearch } from "./types";
import { searchWorkLogs } from "./worklog-api";

interface WorkLogState {
  searchResult: PagedResult<WorkLog>;
  filter: WorkLogSearch;
}

const initialState: WorkLogState = {
  searchResult: {
    items: [],
    total: 0
  },
  filter: {
    projects: [],
    searchTerm: ''
  }
}

export const searchWorkLogsAsync = createAsyncThunk(
  'worklog/search',
  async (filter: WorkLogSearch) => {
    return searchWorkLogs(filter);
  }
);

export const worklogSlice = createSlice({
  name: 'worklog',
  initialState,
  reducers: {
    changeWorkLogFilter: (state, action: PayloadAction<any>) => {
      state.filter = { ...state.filter, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(searchWorkLogsAsync.fulfilled, (state, action) => {
      state.searchResult = action.payload
    })
  }
})

export default worklogSlice.reducer;

export const { changeWorkLogFilter } = worklogSlice.actions;

export const worklogSelector = (state: RootState) => state.worklog.searchResult.items;
export const worklogTotalSelector = (state: RootState) => state.worklog.searchResult.total;
export const worklogFilterSelector = (state: RootState) => state.worklog.filter;
