export interface User {
    id: string;
    name: string;
    email: string;
    balance?: number; 
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user?: User;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'DEPOSIT' | 'TRANSFER';
    date: string;
    recipient?: string;
    sender?: string;
}

export interface BalanceResponse {
    balance: number;
}