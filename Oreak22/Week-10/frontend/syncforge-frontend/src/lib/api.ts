import api from "./axios";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
};
