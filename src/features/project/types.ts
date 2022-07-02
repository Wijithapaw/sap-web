export enum ProjectState {
  Pending = 0,
  Inprogress = 1,
  Completed = 2,
  Abandoned = 3
}

export interface Project {
  id: string;
  name: string;
  description: string;  
  state: ProjectState;
  startDate: string;
  endDate?: string;
  projectManagerId?: string;
  projectManager?: string;
}

export interface ProjectFilter {
  isActiveOnly: boolean;
  searchTerm?: string;
}
