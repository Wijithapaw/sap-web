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