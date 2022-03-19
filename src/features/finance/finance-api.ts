import { coreApi } from "../../app/core-api";
import { storageHelper, storageKeys } from "../../app/storage-helper";
import { ListItem } from "../../app/types";
import { TransactionInput } from "./types";

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

