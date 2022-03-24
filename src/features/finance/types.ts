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

export interface Transaction {
  id: string;
  category: number;
  typeId: string;
  type: string;
  date: string;
  description: string;
  projectId: string;
  projectName: string;
  amount: number;
  reconciled: boolean;
  recondiledBy: string;
  recondiledById: string;
}

export interface TransactionFilter {
  projects: string[];
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}
