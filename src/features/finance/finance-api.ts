import { coreApi } from "../../app/core-api";
import { ListItem, PagedResult } from "../../app/types";
import { Transaction, TransactionFilter, TransactionInput, TransactionSummary } from "./types";

export function fetchProjects() {
  return coreApi.get<ListItem[]>('Projects/ListItems');
}

export function fetchExpenseTypes() {
  return coreApi.get<ListItem[]>('Lookups/Active/ListItems/EXPENSE_TYPES');
}

export function fetchIncomeTypes() {
  return coreApi.get<ListItem[]>('Lookups/Active/ListItems/INCOME_TYPES');
}

export function createTransaction(data: TransactionInput) {
  return coreApi.post<string>('Transactions', data);
}

export function updateTransaction(id: string, data: TransactionInput) {
  return coreApi.put<string>(`Transactions/${id}`, data);
}

export function fetchTransactions(filter: TransactionFilter) {
  return coreApi.get<PagedResult<Transaction>>('Transactions', filter);
}

export function fetchTransactionsSummary(filter: TransactionFilter) {
  return coreApi.get<TransactionSummary>('Transactions/Summary', filter);
}

export function fetchTransaction(id: string) {
  return coreApi.get<Transaction>(`Transactions/${id}`);
}

export function deleteTransaction(id: string) {
  return coreApi.remove(`Transactions/${id}`);
}

export function reconcileTransaction(id: string) {
  return coreApi.patch<Transaction>(`Transactions/Reconcile/${id}`, undefined);
}

export function unreconcileTransaction(id: string) {
  return coreApi.patch<Transaction>(`Transactions/UnReconcile/${id}`, undefined);
}
