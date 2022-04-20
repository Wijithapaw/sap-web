import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageHelper, storageKeys } from '../../app/storage-helper';
import { RootState, AppThunk } from '../../app/store';
import { login } from './auth-api';
import { AuthUser, LoginCredentials } from './types';
import jwt_decode from 'jwt-decode';

function extractRolesAndPermission(token: string) {
  var decoded = jwt_decode<any>(token);
  return decoded;
}

export interface AuthState {
  initialized?: boolean;
  user?: AuthUser;
  authInprogress: boolean;
  authError?: string;
}

const initialState: AuthState = {
  authInprogress: false,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (creds: LoginCredentials) => {
    const authResult = await login(creds);
    return authResult;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authInitialize: (state) => {
      const authToken = storageHelper.getValue(storageKeys.authToken);

      if (authToken) {
        const authData = extractRolesAndPermission(authToken);
        const permissions = authData["sap/permission"] || [];
        const email = authData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        const givenName = authData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

        state.user = {
          email,
          roles: [],
          permissions,
          givenName
        };        
      }
      state.initialized = true;
    },
    logout: (state) => {
      state.user = undefined;
      state.authError = undefined;
      storageHelper.removeValue(storageKeys.authToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.authInprogress = true;
        state.authError = undefined;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { succeeded, email, errorCode, authToken } = action.payload;
      
        if (succeeded) {
          storageHelper.setValue(storageKeys.authToken, authToken);

          const authData = extractRolesAndPermission(authToken);
          const permissions = authData["sap/permission"] || [];  
          const givenName = authData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];

          state.user = {
            email,
            roles: [],
            permissions,
            givenName
          };
          state.authInprogress = false;
          state.authError = undefined;
        } else {
          state.authError = errorCode;
          storageHelper.removeValue(storageKeys.authToken);
        }
      });
  },
});

export const { logout, authInitialize } = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const authSelector = (state: RootState) => !!state.auth.user;
export const hasPermission = (state: RootState, permission: string) => !!state.auth.user && state.auth.user.permissions.includes(permission)

export default authSlice.reducer;
