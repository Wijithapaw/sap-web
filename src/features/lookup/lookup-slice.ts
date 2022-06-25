import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { IDictionary } from "../../app/types";
import { getHeaderByCode, getLookupsByHeader } from "./lookup-api";
import { LookupData, LookupHeader } from "./types";

export interface LookupState {
    lookupCollection: IDictionary<LookupData>;
}

const initialState: LookupState = {
    lookupCollection: {}
}

export const getLookupHeaderAsync = createAsyncThunk(
    'lookup/getheader',
    async (code: string) => {
        const header = await getHeaderByCode(code);
        return header;
    });

export const getLookupsByHeaderAsync = createAsyncThunk(
    'lookup/getbyheader',
    async (header: LookupHeader) => {
        const lookups = await getLookupsByHeader(header.id);
        return {lookups, headerCode: header.code};
    });

const lookupSlice = createSlice({
    name: 'lookup',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getLookupHeaderAsync.fulfilled, (state, action) => {
            const dict = { ...state.lookupCollection, [action.payload.code]: { header: action.payload, lookups: [] } };
            state.lookupCollection = dict;
        }).addCase(getLookupsByHeaderAsync.fulfilled, (state, action) => {
            state.lookupCollection[action.payload.headerCode].lookups = action.payload.lookups;
        })
    }
});

export const { } = lookupSlice.actions;

export default lookupSlice.reducer;

export const lookupHeaderSelector = (state: RootState) => {
    return (header: string) => state.lookup.lookupCollection[header]?.header
}

export const lookupsSelector = (state: RootState) => {
    return (header: string) => state.lookup.lookupCollection[header]?.lookups || []
}