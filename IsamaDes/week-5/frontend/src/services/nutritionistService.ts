// src/services/nutritionistService.ts
import axiosInstance from "../utils/AxiosInstance";

export interface MealPlanData {
  patientId: string;
  patientName: string;
  doctorName: string;
  healthGoal: string;
  nutritionalRequirement: string;
  dateRange: { start: string; end: string };
  assignedDoctor : string,
  numberOfWeeks: number;
  weeklyMealPlans: any[];
}

export const getDoctorProfile = async () => {
  try {
    const response = await axiosInstance.get("/nutritionist/profile");
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getClientsForDoctor = async () => {
  try {
    const response = await axiosInstance.get("/nutritionist/clients");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};


// Create a new meal plan
export const createMealPlan = async (mealPlanData: MealPlanData) => {
  const { data } = await axiosInstance.post("/nutritionist/create", mealPlanData);
  return data;
};

//  Get all meal plans
export const getAllMealPlans = async () => {
  const { data } = await axiosInstance.get("/nutritionist");
  return data;
};

//  Get a single meal plan by ID
export const getMealPlanById = async (id: string) => {
  const { data } = await axiosInstance.get(`/nutritionist/${id}`);
  return data;
};

//  Update meal plan by ID
export const updateMealPlan = async (id: string, updateData: Partial<MealPlanData>) => {
  const { data } = await axiosInstance.put(`/nutritionist/${id}`, updateData);
  return data;
};
