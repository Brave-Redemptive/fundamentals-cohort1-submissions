import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userName: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<LoginResponse>>;

  register: (
    name: string,
    role: string,
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}
