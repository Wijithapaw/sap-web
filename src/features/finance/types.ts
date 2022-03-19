export enum ExpenseCategory {
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
