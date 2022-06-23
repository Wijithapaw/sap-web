import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PagedResult } from "../../app/types";
import { WorkLog, WorkLogSearch } from "./types";
import { deleteWorkLog, getWorkLog, searchWorkLogs } from "./worklog-api";

interface WorkLogState {
  searchResult: PagedResult<WorkLog>;
  filter: WorkLogSearch;
  editingWorklog?: WorkLog;
}

const initialState: WorkLogState = {
  searchResult: {
    items: [],
    total: 0
  },
  filter: {
    projects: [],
    searchTerm: '',
    page: 1,
    pageSize: 25
  }
}

export const getEditingWorkLogAsync = createAsyncThunk(
  'worklog/editing',
  async (id: string) => {
    return getWorkLog(id);
  });

export const searchWorkLogsAsync = createAsyncThunk(
  'worklog/search',
  async (filter: WorkLogSearch) => {
    return searchWorkLogs(filter);
  }
);

export const updateEditingWorkLogAsync = createAsyncThunk(
  'worklog/updateEditing',
  async (id: string) => {
    return getWorkLog(id);
  });

export const fetchNewWorkLogAsync = createAsyncThunk(
  'worklog/fetchNew',
  async (id: string) => {
    return getWorkLog(id);
  });

export const deleteWorkLogAsync = createAsyncThunk(
  'worklog/delete',
  async (id: string) => {
    return deleteWorkLog(id).then(() => id);
  });

export const worklogSlice = createSlice({
  name: 'worklog',
  initialState,
  reducers: {
    changeWorkLogFilter: (state, action: PayloadAction<any>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    clearEditingWorklog: (state) => {
      state.editingWorklog = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(searchWorkLogsAsync.fulfilled, (state, action) => {
      state.searchResult = action.payload
    }).addCase(getEditingWorkLogAsync.fulfilled, (state, action) => {
      state.editingWorklog = action.payload
    }).addCase(updateEditingWorkLogAsync.fulfilled, (state, action) => {
      const index = state.searchResult.items.findIndex(wl => wl.id == action.payload.id);
      state.searchResult.items.splice(index, 1, action.payload);
    }).addCase(deleteWorkLogAsync.fulfilled, (state, action) => {
      const index = state.searchResult.items.findIndex(wl => wl.id == action.payload);
      state.searchResult.items.splice(index, 1);
    }).addCase(fetchNewWorkLogAsync.fulfilled, (state, action) => {
      state.searchResult.items.splice(0, 0, action.payload);
    })
  }
})

export default worklogSlice.reducer;

export const { changeWorkLogFilter, clearEditingWorklog } = worklogSlice.actions;

export const worklogSelector = (state: RootState) => state.worklog.searchResult.items;
export const worklogTotalSelector = (state: RootState) => state.worklog.searchResult.total;
export const worklogFilterSelector = (state: RootState) => state.worklog.filter;
