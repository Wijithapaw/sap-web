import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { access } from "fs";
import { RootState } from "../../app/store";
import { ListItem } from "../../app/types";
import { fetchExpenseTypes, fetchIncomeTypes, fetchProjects } from "./finance-api";

export interface FinanceState {
  projects: ListItem[];
  expenseTypes: ListItem[];
  incomeTypes: ListItem[]
}

const initialState: FinanceState = {
  projects: [],
  expenseTypes: [],
  incomeTypes: [],
}

export const fetchProjectsAsync = createAsyncThunk(
  'finance/projects',
  async () => {
    const projects = await fetchProjects();
    return projects;
  }
)

export const fetchIncomeTypesAsync = createAsyncThunk(
  'finance/incometypes',
  async () => {
    const types = await fetchIncomeTypes();
    return types;
  }
)

export const fetchExpenseTypesAsync = createAsyncThunk(
  'finance/expensetypes',
  async () => {
    const types = await fetchExpenseTypes();
    return types;
  }
)

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectsAsync.fulfilled, (state, action) => {
      state.projects = action.payload
    }).addCase(fetchIncomeTypesAsync.fulfilled, (state, action) => {
      state.incomeTypes = action.payload
    }).addCase(fetchExpenseTypesAsync.fulfilled, (state, action) => {
      state.expenseTypes = action.payload
    })
  }
});

export const { } = financeSlice.actions;

export const projectsSelector = (state: RootState) => state.finance.projects;
export const incomeTypesSelector = (state: RootState) => state.finance.incomeTypes;
export const expenseTypesSelector = (state: RootState) => state.finance.expenseTypes;

export default financeSlice.reducer;