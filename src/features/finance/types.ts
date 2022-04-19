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
  recondiledBy: string;
  recondiledById: string;
}

export interface TransactionFilter {
  projects: string[];
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}
