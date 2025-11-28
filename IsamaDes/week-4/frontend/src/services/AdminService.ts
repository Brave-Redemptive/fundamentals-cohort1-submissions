import axiosInstance from "../utils/AxiosInstance";
import logAxiosError from "../utils/LogAxiosError";



export const getAdminOverview = async () => {
  try{
     const response = await axiosInstance.get("/user/me");
     return response.data.data;
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