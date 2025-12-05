export interface LegacyPayment {
  id: string | number;
  amount: number | string;
  currency?: string;
  status?: string;
  customer_id?: string | number;
  created_at: string;
  [k: string]: any;
}

export interface LegacyCustomer {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  meta?: Record<string, any>;
  created_at: string;
  [k: string]: any;
}
