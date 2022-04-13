import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ListItem } from "../../app/types";
import { fetchExpenseTypes, fetchIncomeTypes, fetchProjects, fetchTransactions, fetchTransaction } from "./finance-api";
import { Transaction, TransactionFilter } from "./types";

export interface FinanceState {
  projects: ListItem[];
  expenseTypes: ListItem[];
  incomeTypes: ListItem[];
  transactions: Transaction[];
  txnFilter: TransactionFilter;
  editingTxn?: Transaction;
}

const initialState: FinanceState = {
  projects: [],
  expenseTypes: [],
  incomeTypes: [],
  transactions: [],
  txnFilter: {
    projects: [],
    fromDate: '',
    toDate: '',
  }
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

export const fetchTransactionsAsync = createAsyncThunk(
  'finance/transactions',
  async (filter: TransactionFilter) => {
    const types = await fetchTransactions(filter);
    return types;
  }
)

export const fetchTransactionToEditAsync = createAsyncThunk(
  'finance/editxn',
  async (id: string) => {
    const types = await fetchTransaction(id);
    return types;
  }
)

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setTxnFilterFromDate: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.txnFilter = { ...state.txnFilter, fromDate: action.payload }
    },
    setTxnFilterToDate: (state, action: PayloadAction<string>) => {
      state.txnFilter.toDate = action.payload
    },
    setTxnFilterProjects: (state, action: PayloadAction<string[]>) => {
      state.txnFilter.projects = action.payload
    },
    clearEditingTransaction: (state) => {
      state.editingTxn = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjectsAsync.fulfilled, (state, action) => {
      state.projects = action.payload;
    }).addCase(fetchIncomeTypesAsync.fulfilled, (state, action) => {
      state.incomeTypes = action.payload;
    }).addCase(fetchExpenseTypesAsync.fulfilled, (state, action) => {
      state.expenseTypes = action.payload;
    }).addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
      state.transactions = action.payload;
    })
    .addCase(fetchTransactionToEditAsync.fulfilled, (state, action) => {
      state.editingTxn = action.payload
    })
  }
});

export const { setTxnFilterFromDate, setTxnFilterProjects, setTxnFilterToDate } = financeSlice.actions;

export const projectsSelector = (state: RootState) => state.finance.projects;
export const incomeTypesSelector = (state: RootState) => state.finance.incomeTypes;
export const expenseTypesSelector = (state: RootState) => state.finance.expenseTypes;
export const transactionsSelector = (state: RootState) => state.finance.transactions;
export const txnFilterSelector = (state: RootState) => state.finance.txnFilter;

export default financeSlice.reducer;