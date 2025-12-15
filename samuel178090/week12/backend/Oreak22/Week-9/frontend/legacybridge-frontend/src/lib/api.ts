import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

export const getPayments = async () => {
  const res = await api.get("/v2/payments");
  return res.data;
};

export default api;
