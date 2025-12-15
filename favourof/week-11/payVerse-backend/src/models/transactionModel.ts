export interface Transaction {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  status: string;
  description?: string;
  created_at: Date;
}

export interface CreateTransactionDTO {
  toAccountNumber: string;
  amount: number;
  description?: string;
}
