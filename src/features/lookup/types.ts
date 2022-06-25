export interface Lookup {
    id: string;
    headerId: string;
    code: string;
    name: string;
    inactive: boolean;
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

