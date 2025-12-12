import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
