import { Router } from "express";
import { SSEController } from "../controllers/sse.controller";

const router = Router();

router.get("/stream", SSEController.stream);

export default router;
