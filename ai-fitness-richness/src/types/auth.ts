export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}