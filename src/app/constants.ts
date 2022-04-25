import { Dictionary } from "./types"

export const SapPermissions = {
  lookupsFullAccess: "LOOKUPS_FULL_MANAGE",
  projectsFullAccess: "PROJECTS_FULL_ACCESS",
  transactionEntry: "TRANSACTION_ENTRY",
  transactionReconcile: "TRANSACTION_RECONCILE",
  financialReports: "FINANCIAL_REPORTS",
}

export const ErrorCodes: Dictionary  = {
  'ERR_CANT_DELETE_RECONCILED_TXN' : "Reconciled transactions cannot be deleted.",
  'ERR_INSUFFICIENT_PERMISSION_TO_DELETE_TRNASACTION' : "You don't have permission to delete this transaction.",
}
