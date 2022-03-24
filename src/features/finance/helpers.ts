import { TxnCategory } from "./types";

export const financeHelpers = {
  getTxnCategoryDisplayTest
}

function getTxnCategoryDisplayTest(category: TxnCategory) {
  switch (category) {
    case TxnCategory.Expense: return "Expense";
    case TxnCategory.Income: return "Income";
    default: return "NA"
  }
}