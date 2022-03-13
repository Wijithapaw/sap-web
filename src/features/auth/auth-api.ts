import { coreApi } from "../../app/core-api";
import { storageHelper, storageKeys } from "../../app/storage-helper";
import { AuthResult, LoginCredentials } from "./types";

export function login(credentials: LoginCredentials) {
  return coreApi.post<AuthResult>("users/login", credentials)
    .then(res => {
      storageHelper.setValue(storageKeys.authToken, res.authToken);
      return res;
    });
}
