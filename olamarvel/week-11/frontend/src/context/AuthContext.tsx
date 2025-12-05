import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../api/endpoints';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const { data } = await authAPI.getUser();
                    setUser(data);
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem('authToken');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await authAPI.login({ email, password });
            if (data.success && data.token) {
                localStorage.setItem('authToken', data.token);
                const userRes = await authAPI.getUser();
                setUser(userRes.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};