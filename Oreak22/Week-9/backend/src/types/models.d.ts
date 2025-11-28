export interface V2Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  customerId?: string;
  createdAt: string;
  raw?: any;
}

export interface V2Customer {
  id: string;
  name: string;
  email?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  raw?: any;
}
