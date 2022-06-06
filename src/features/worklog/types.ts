export interface WorkLog {
  id: string;
  projectId: string;
  projectName: string;
  labourName: string;
  jobDescription: string;
  date: string;
  wage: number
}

export interface WorkLogSearch {
  from?: string;
  to?: string;
  searchTerm: string;
  projects: string[];
}
