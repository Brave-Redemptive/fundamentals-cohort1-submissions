import { Request, Response } from "express";
import NotificationService from "../services/notification.service";

export const createNotification = async (req: Request, res: Response) => {
  console.log("Request Body:", req.body);
  try {
    const job = await NotificationService.createJob(req.body);
    res.status(201).json(job);
    console.log("Created Job:", job);
  } catch (error) {
    console.error("Error creating notification job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobStatus = async (req: Request, res: Response) => {
  const job = await NotificationService.getJob(req.params.id);
  res.json(job);
};

export const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await NotificationService.listJobs();
  res.json(jobs);
};
