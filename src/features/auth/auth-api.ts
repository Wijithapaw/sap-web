import { coreApi } from "../../app/core-api";
import { storageHelper, storageKeys } from "../../app/storage-helper";
import { AuthResult, ChangePasswordDto, ChangePasswordResult, LoginCredentials } from "./types";

export function login(credentials: LoginCredentials) {
  return coreApi.post<AuthResult>("users/login", credentials);
}

export function changePassword(data: ChangePasswordDto) {
  return coreApi.post<ChangePasswordResult>("users/changepassword", data);
}
