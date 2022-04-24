import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ListItem } from "../../app/types";
import { fetchExpenseTypes, fetchIncomeTypes, fetchProjects, fetchTransaction, deleteTransaction, fetchTransactionsSummary, fetchTransactions } from "./finance-api";
import { Transaction, TransactionFilter, TransactionSummary } from "./types";

export interface FinanceState {
  projects: ListItem[];
  expenseTypes: ListItem[];
  incomeTypes: ListItem[];
  transactions: Transaction[];
  txnFilter: TransactionFilter;
  editingTxn?: Transaction;
  transactionsSummary: TransactionSummary;
}

const initialState: FinanceState = {
  projects: [],
  expenseTypes: [],
  incomeTypes: [],
  transactions: [],
  txnFilter: { projects: [], fromDate: '', toDate: '', page: 1, pageSize: 10000 },
  transactionsSummary: { expenses: 0, income: 0, profit: 0, shareDividend: 0 }
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
    const txns = await fetchTransactions(filter);
    return txns;
  }
)

export const fetchTransactionSummaryAsync = createAsyncThunk(
  'finance/transactions/summary',
  async (filter: TransactionFilter) => {
    const summary = await fetchTransactionsSummary(filter);
    return summary;
  }
)

export const fetchTransactionToEditAsync = createAsyncThunk(
  'finance/editxn',
  async (id: string) => {
    const txn = await fetchTransaction(id);
    return txn;
  }
)

export const updateEditingTransactionAsync = createAsyncThunk(
  'finance/updateTxnInList',
  async (id: string) => {
    const txn = await fetchTransaction(id);
    return txn;
  }
)

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setTxnFilterFromDate: (state, action: PayloadAction<string>) => {
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
    },
    removeTransactionFromList: (state, action: PayloadAction<string>) => {
      const txnId = action.payload;
      const index = state.transactions.findIndex(t => t.id == txnId);
      const txns = [...state.transactions];
      txns.splice(index, 1);
      state.transactions = txns;
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
      state.transactions = action.payload.items;
    }).addCase(fetchTransactionSummaryAsync.fulfilled, (state, action) => {
      state.transactionsSummary = action.payload;
    }).addCase(fetchTransactionToEditAsync.fulfilled, (state, action) => {
      state.editingTxn = action.payload
    }).addCase(updateEditingTransactionAsync.fulfilled, (state, action) => {
      const txn = action.payload;
      const index = state.transactions.findIndex(t => t.id == txn.id);
      const txns = [...state.transactions];
      txns.splice(index, 1, txn);
      state.transactions = txns;

      if (state.editingTxn) state.editingTxn = { ...txn };
    })
  }
});

export const { setTxnFilterFromDate,
  setTxnFilterProjects,
  setTxnFilterToDate,
  clearEditingTransaction,
  removeTransactionFromList 
} = financeSlice.actions;

export const projectsSelector = (state: RootState) => state.finance.projects;
export const incomeTypesSelector = (state: RootState) => state.finance.incomeTypes;
export const expenseTypesSelector = (state: RootState) => state.finance.expenseTypes;
export const transactionsSelector = (state: RootState) => state.finance.transactions;
export const transactionsSummarySelector = (state: RootState) => state.finance.transactionsSummary;
export const txnFilterSelector = (state: RootState) => state.finance.txnFilter;
export const editingTxnSelector = (state: RootState) => state.finance.editingTxn;

export default financeSlice.reducer;