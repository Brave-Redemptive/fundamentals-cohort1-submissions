import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const getPayments = async () => {
  const response = await axios.get(`${API_BASE}/v2/payments`);
  return response.data;
};
