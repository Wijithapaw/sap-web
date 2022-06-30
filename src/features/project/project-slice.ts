import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ListItem } from "../../app/types";
import { fetchProjects, fetchProject } from "./project-api";
import { Project, ProjectFilter, ProjectState } from "./types";

export interface ProjectStatusState {
  projectStatus: ListItem[];
  projects: Project[];
  projectFilter: ProjectFilter;
  editingProject?: Project;
}

const initialState: ProjectStatusState = {
  projectStatus: [
    { value: 'Pending', key: ProjectState.Pending.toString() } as ListItem,
    { value: 'Inprogress', key: ProjectState.Inprogress.toString() } as ListItem,
    { value: 'Completed', key: ProjectState.Completed.toString() } as ListItem,
    { value: 'Abandoned', key: ProjectState.Abandoned.toString() } as ListItem
  ],
  projects: [],
  projectFilter: { isActiveOnly: true, searchTerm: '' }
}

export const fetchProjectsAsync = createAsyncThunk(
  'project/projects',
  async (filter: ProjectFilter) => {
    const projects = await fetchProjects(filter);
    return projects;
  }
)

export const fetchProjectToEditAsync = createAsyncThunk(
  'project/editProject',
  async (id: string) => {
    const project = await fetchProject(id);
    return project;
  }
)

export const updateEditingProjectAsync = createAsyncThunk(
  'project/updateProjectInList',
  async (id: string) => {
    const project = await fetchProject(id);
    return project;
  }
)

export const projectSlice = createSlice(
  {
    name: 'project',
    initialState,
    reducers: {
      changeProjectFilter: (state, action: PayloadAction<any>) => {
        console.log(action.payload)
        state.projectFilter = { ...state.projectFilter, ...action.payload };
      },
      clearEditingProject: (state) => {
        state.editingProject = undefined;
      },
      removeProjectFromList: (state, action: PayloadAction<string>) => {
        const projectId = action.payload;
        const index = state.projects.findIndex(t => t.id == projectId);
        const txns = [...state.projects];
        txns.splice(index, 1);
        state.projects = txns;
      }
    },
    extraReducers: (builder) => {
      builder.addCase(fetchProjectsAsync.fulfilled, (state, action) => {
        state.projects = action.payload;
      }).addCase(fetchProjectToEditAsync.fulfilled, (state, action) => {
        state.editingProject = action.payload;
      }).addCase(updateEditingProjectAsync.fulfilled, (state, action) => {
        const project = action.payload;
        const index = state.projects.findIndex(t => t.id == project.id);
        const projects = [...state.projects];
        projects.splice(index, 1, project);
        state.projects = projects;

        if (state.editingProject) state.editingProject = { ...project };
      })
    }
  });

export const { changeProjectFilter, clearEditingProject, removeProjectFromList } = projectSlice.actions;

export const projectStatusSelector = (state: RootState) => {
  return state.project.projectStatus
};
export const editingProjectSelector = (state: RootState) => state.project.editingProject;
export const projectFilterSelector = (state: RootState) => state.project.projectFilter;
export const projectsSelector = (state: RootState) => state.project.projects;

export default projectSlice.reducer;