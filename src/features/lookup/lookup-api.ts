import { coreApi } from "../../app/core-api";
import { Lookup, LookupHeader } from "./types";

export function getHeaderByCode(code: string) {
    return coreApi.get<LookupHeader>(`lookups/header/bycode/${code}`);
}

export function getLookupsByHeader(headerId: string) {
    return coreApi.get<Lookup[]>(`lookups/byheader/${headerId}`);
}
