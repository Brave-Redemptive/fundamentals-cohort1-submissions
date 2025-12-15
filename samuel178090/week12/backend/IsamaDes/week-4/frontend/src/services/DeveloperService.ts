import axiosInstance from "../utils/AxiosInstance";
import logAxiosError from "../utils/LogAxiosError";
import type{ User } from "../types/User";



export const getDeveloperProfile = async (): Promise<User> => {
  try{
   const response = await axiosInstance.get("/user/me");
   return response.data.data;
  }catch(error: any){
   logAxiosError(error, "CLIENT_PROFILE");
   throw error.response?.data || error;
  }
}

export const createProject = async(title: string, description: string) => {
  const res = await axiosInstance.post("/projects/create-project", { title, description });
  return res.data.data;
}

export const getProjects = async () => {
  const res = await axiosInstance.get("/projects");
  return res.data;
};

export const commentOnProject = async (id: string, text: string) => {
    try{
  const res = await axiosInstance.post(`/projects/${id}/comment`, { text });
  return res.data.data;
    }catch (error: any) {
    console.error("❌ Failed to comment on project:", error);
    throw error.response?.data || error;
  }
};