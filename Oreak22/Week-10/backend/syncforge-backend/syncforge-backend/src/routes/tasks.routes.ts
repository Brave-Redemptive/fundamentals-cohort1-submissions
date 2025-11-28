import { Router } from "express";
import validate from "../middlewares/validate.middleware";
import { createTask, listTasks } from "../controllers/tasks.controller";
import { taskSchema } from "../schemas/task.schema";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, listTasks);
router.post("/", requireAuth, validate(taskSchema), createTask);

export default router;
