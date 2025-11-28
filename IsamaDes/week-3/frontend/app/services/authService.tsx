import axiosInstance from "../../utils/AxiosInstance";
import logAxiosError from "../../utils/LogAxiosError"

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client" | "nutritionist";
}

// export interface RegisterResponse {
//   message: string;
//   verificationToken: string;
//   user?: { name: string; email: string; role: string };
// }


interface LoginData {
  email: string;
  password: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    logAxiosError(error, "REGISTER");
    throw error.response?.data || error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    console.log("📡 Axios Base URL:", axiosInstance.defaults.baseURL);
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    logAxiosError(error, "LOGIN");
    throw error.response?.data || error;
  }
};

export const clientUser = async (): Promise<ClientData> => {
  try{
     const response = await axiosInstance.get("/client/profile/me");
     return response.data.data;
  }catch(error: any){
   logAxiosError(error, "CLIENT_PROFILE");
   throw error.response?.data || error;
  }
}

export const getAdminOverview = async () => {
  try{
     const response = await axiosInstance.get("/admin/profile");
     return response.data;
  }catch(error: any){
   logAxiosError(error, "ADMIN_PROFILE");
   throw error.response?.data || error;
  }
}

export const getActiveClients = async () => {
  try{
    const response = await axiosInstance.get("/admin/active-clients");
    return response.data;
  }catch(error: any){
  logAxiosError(error, "ADMIN_PROFILE");
   throw error.response?.data || error
  }
}
