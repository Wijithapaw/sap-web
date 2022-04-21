import { TxnCategory } from "./types";

export const financeHelpers = {
  getTxnCategoryDisplayTest,
  getTxnCategoryShortDisplayTest
}

function getTxnCategoryDisplayTest(category: TxnCategory) {
  switch (category) {
    case TxnCategory.Expense: return "Expense";
    case TxnCategory.Income: return "Income";
    default: return "NA"
  }
}

function getTxnCategoryShortDisplayTest(category: TxnCategory) {
  switch (category) {
    case TxnCategory.Expense: return "Exc";
    case TxnCategory.Income: return "Inc";
    default: return "NA"
  }
}