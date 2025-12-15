import { createContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        window.location.href = "/login";
      }
    };
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    console.log(email, password);
    try {
      const res = await authApi.login({ email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      window.location.href = "/";

      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authApi.register({ name, email, password });

      toast.success("Registration successful, please login");
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
