export type UserRole = "STUDENT" | "ADMIN" | "TEACHER";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  firstname: string;
  lastname: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    data: User;
  };
  token: string;
}
