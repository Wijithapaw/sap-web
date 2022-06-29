import { coreApi } from "../../app/core-api";
import { Lookup, LookupEntry, LookupHeader } from "./types";

export function getHeaderByCode(code: string) {
    return coreApi.get<LookupHeader>(`lookups/header/bycode/${code}`);
}

export function getLookupsByHeader(headerId: string) {
    return coreApi.get<Lookup[]>(`lookups/byheader/${headerId}`);
}

export function createLookup(lookup: LookupEntry) {
    return coreApi.post<string>('lookups', lookup);
}

export function updateLookup(id: string, lookup: LookupEntry) {
    return coreApi.put<string>(`lookups/${id}`, lookup);
}


export function deleteLookup(id: string) {
    return coreApi.remove(`lookups/${id}`);
}

export function getLookup(id: string) {
    return coreApi.get<Lookup>(`lookups/${id}`);
}
