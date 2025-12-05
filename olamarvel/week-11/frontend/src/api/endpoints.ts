import apiClient from './axios';
import type { AuthResponse, User, BalanceResponse } from '../types';

export const authAPI = {
    login: (credentials: { email: string; password: string }) => 
        apiClient.post<AuthResponse>('/api/auth/login', credentials),
    
    register: (data: { name: string; email: string; password: string }) => 
        apiClient.post<AuthResponse>('/api/auth/register', data),
    
    logout: () => apiClient.post('/api/auth/logout'),
    
    getUser: () => apiClient.get<User>('/api/auth/getUser'),
};

export const transactionAPI = {
    getBalance: () => apiClient.get<BalanceResponse>('/api/transactions/balance'),
    
    deposit: (amount: number) => 
        apiClient.post('/api/transactions/deposit', { amount }),
    
    sendFunds: (recipientEmail: string, amount: number) => 
        apiClient.post('/api/transactions/send', { recipientEmail, amount }),
        
    getStatement: (page: number = 1) => 
        apiClient.get(`/api/transactions/statement?page=${page}&pagesize=10`),
};