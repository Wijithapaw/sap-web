import { coreApi } from "../../app/core-api";
import { ListItem } from "../../app/types";
import { Transaction, TransactionFilter, TransactionInput } from "./types";

export function fetchProjects() {
  return coreApi.get<ListItem[]>('Projects/ListItems');
}

export function fetchExpenseTypes() {
  return coreApi.get<ListItem[]>('Lookups/Active/ListItems/EXPENSE_TYPES');
}

export function fetchIncomeTypes() {
  return coreApi.get<ListItem[]>('Lookups/Active/ListItems/INCOME_TYPES');
}

export function saveTransaction(data: TransactionInput) {
  return coreApi.post<string>('Transactions', data);
}

export function fetchTransactions(filter: TransactionFilter) {
  return coreApi.get<Transaction[]>('Transactions', filter);
}
