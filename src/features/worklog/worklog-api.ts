import { coreApi } from "../../app/core-api";
import { PagedResult } from "../../app/types";
import { WorkLog, WorkLogSearch } from "./types";

export function searchWorkLogs(filter: WorkLogSearch) {
  return coreApi.get<PagedResult<WorkLog>>('worklogs', filter);
}

export function CreateWorkLog(data: WorkLog) {
  return coreApi.post<string>('worklog', data);
}