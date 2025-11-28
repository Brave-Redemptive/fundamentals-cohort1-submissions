import type { Response, NextFunction } from "express";
import { UserRepository } from "../repositories/userRepository.js";
import { createMealPlanService } from "../services/mealPlan/createMealPlan.service.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import {  creatAppointmentservice, getMealPlanByIdService, getMealPlansService, updateMealPlanService } from "../services/mealPlan";


export const getDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id; 

    const nutritionist = await UserRepository.findById(userId);

    res.status(200).json({
      success: true,
      data: nutritionist,
    });
  } catch (error: any) {
    console.error("Error fetching nutritionist profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const createAppointment = async (req: {
  date: Date;
  doctorId: string;
  patientId: string;
  notes: string;
}, res: Response) => {
  try{
  const { date, doctorId, patientId, notes } = req;
  const appointment = await creatAppointmentservice(date, doctorId, patientId, notes);
  res.status(201).json({ success: true, data: appointment });
  }catch(error: any){
    console.error("Error fetching creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  } 
};


export const createMealPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id
    const mealPlan = await createMealPlanService(userId, req.body);
    res.status(201).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};


export const getMealPlans = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id
    const result = await getMealPlansService(userId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    next(err);
  }
};


export const updateMealPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id
    const { id } = req.params;
    const updatedPlan = await updateMealPlanService(userId, id, req.body);
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (err: any) {
    next(err);
  }
};


export const getMealPlanById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!._id
    const { id } = req.params;

    const mealPlan = await getMealPlanByIdService(userId, id);
    res.status(200).json({ success: true, data: mealPlan });
  } catch (err: any) {
    next(err);
  }
};