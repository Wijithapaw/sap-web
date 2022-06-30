import { coreApi } from "../../app/core-api";
import { Project, ProjectFilter } from "./types";

export function fetchProjects(filter: ProjectFilter) {
  return coreApi.get<Project[]>('Projects', filter);
}

export function createProject(data: Project) {
  return coreApi.post<Project>('Projects', data);
}

export function updateProject(id: string, data: Project) {
  return coreApi.put<Project>(`Projects/${id}`, data);
}

export function fetchProject(id: string) {
  return coreApi.get<Project>(`Projects/${id}`);
}

export function deleteProject(id: string) {
  return coreApi.remove(`Projects/${id}`);
}
