import { Router } from "express";
import {
  createNotification,
  getJobStatus,
  getAllJobs,
} from "../controllers/notification.controller";

const router = Router();

router.post("/", createNotification);
router.get("/:id", getJobStatus);
router.get("/", getAllJobs);

export default router;
