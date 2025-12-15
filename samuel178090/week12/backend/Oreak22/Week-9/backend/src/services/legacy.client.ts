import axios from "axios";
import axiosRetry from "axios-retry";
import { LegacyPayment, LegacyCustomer } from "../types/legacy";

const BASE = process.env.MOCK_LEGACY_URL || "http://localhost:4000";
const client = axios.create({ baseURL: BASE, timeout: 4000 });

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(err) 
    );
  },
});

export async function fetchPayments(): Promise<LegacyPayment[]> {
  const resp = await client.get("/legacy/payments");
  return resp.data;
}

export async function fetchPaymentById(
  id: string
): Promise<LegacyPayment | null> {
  try {
    const resp = await client.get(`/legacy/payments/${id}`);
    return resp.data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function fetchCustomers(): Promise<LegacyCustomer[]> {
  const resp = await client.get("/legacy/customers");
  return resp.data;
}
