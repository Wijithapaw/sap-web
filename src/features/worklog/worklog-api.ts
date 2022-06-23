import { coreApi } from "../../app/core-api";
import { PagedResult } from "../../app/types";
import { WorkLog, WorkLogEntry, WorkLogSearch } from "./types";

export function searchWorkLogs(filter: WorkLogSearch) {
  return coreApi.get<PagedResult<WorkLog>>('worklogs', filter);
}

export function createWorkLog(data: WorkLogEntry) {
  return coreApi.post<string>('worklogs', data);
}

export function updateWorkLog(id: string, data: WorkLogEntry) {
  return coreApi.put<string>(`worklogs/${id}`, data);
}

export function getWorkLog(id: string) {
  return coreApi.get<WorkLog>(`worklogs/${id}`);
}

export function deleteWorkLog(id: string) {
  return coreApi.remove(`worklogs/${id}`);
}
