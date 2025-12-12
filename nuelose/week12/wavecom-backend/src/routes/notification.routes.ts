import { Router } from "express";
import NotificationJob from "../models/notificationJob.models";
import { publishToQueue } from "../config/rabbitmq";
import { CreateNotificationDto } from "../types";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { type, to, payload }: CreateNotificationDto = req.body;

    const job = await NotificationJob.create({
      type,
      to,
      payload,
    });

    publishToQueue({ jobId: job._id.toString() });

    res.status(201).json({
      success: true,
      message: "Notification queued successfully",
      data: job,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await NotificationJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const jobs = await NotificationJob.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await NotificationJob.countDocuments();

  res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
});

export default router;
