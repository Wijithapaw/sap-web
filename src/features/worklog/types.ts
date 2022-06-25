import { PagedFilter } from "../../app/types";

export interface WorkLogEntry {
  projectId: string;
  labourName: string;
  jobDescription: string;
  date: string;
  wage?: number
  createWageTxn?: boolean;
}

export interface WorkLog extends WorkLogEntry {
  id: string;
  projectName: string;
  wageTxnReconciled?: boolean;
}

export interface WorkLogSearch extends PagedFilter {
  from?: string;
  to?: string;
  searchTerm: string;
  projects: string[];
}
