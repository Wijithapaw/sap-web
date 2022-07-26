import { PagedFilter } from "../../app/types";

export enum TxnCategory {
  Expense = 0,
  Income = 1
}

export interface TransactionInput {
  category: number;
  typeId: string;
  date: string;
  description: string;
  projectId: string;
  amount: number;
  reconciled: boolean;
}

export interface Transaction extends TransactionInput {
  id: string;
  type: string;
  typeCode: string;
  projectName: string;
  reconciledBy: string;
  reconciledById: string;
  reconciledDateUtc?: string;
  createdBy: string;
  lastUpdatedBy: string;
  createdDateUtc: string;
  lastUpdatedDateUtc: string;
}

export interface TransactionFilter extends PagedFilter {
  projects: string[];
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  category?: TxnCategory;
}

export interface TransactionSummary {
  expenses: number;
  income: number;
  shareDividend: number;
  profit: number;
}
