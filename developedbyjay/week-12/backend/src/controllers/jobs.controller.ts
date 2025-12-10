import { Request, Response } from "express";
import { publishToQueue } from "../rabbitmq/publisher.js";
import { Job } from "@/models/job.js";

export const createJob = async (req: Request, res: Response) => {
  const job = await Job.create(req.body);
  const jobDoc = Array.isArray(job) ? job[0] : job;
  await publishToQueue("notifications", { jobId: jobDoc._id });
  res.status(201).json(jobDoc);
};

export const getJob = async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
};

export const getJobs = async (_req: Request, res: Response) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};
