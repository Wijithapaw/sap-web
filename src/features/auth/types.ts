export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  succeeded: string;
  errorCode: string;
  authToken: string;
  email: string;
  userId: string;
}

export interface AuthUser {
  email: string;
  roles: string[];
  permissions: string[];
}

export interface ChangePasswordDto {
  currentPwd: string;
  newPwd: string;
  newPwdConfirm: string;
}


export interface ChangePasswordResult {
    succeeded: boolean;
    errorMessage: string;
}