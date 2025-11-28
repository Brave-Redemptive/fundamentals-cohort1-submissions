import { Router } from "express";
import { addTask, getTasks } from "../controllers/tasks.controller";
import { validateTask } from "../middleware/validatetask.middleware";

const router = Router();

router.get("/tasks", getTasks);
router.post("/tasks", validateTask, addTask );

export default router;
