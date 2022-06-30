export interface LookupEntry {
    headerId: string;
    code: string;
    name: string;
    inactive: boolean;
}

export interface Lookup extends LookupEntry {
    id: string;
}

export interface LookupHeader {
    id: string;
    code: string;
    name: string;
}

export interface LookupData {
    header: LookupHeader;
    lookups: Lookup[]
}

