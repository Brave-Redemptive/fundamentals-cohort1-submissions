import { Router } from "express";
import { sendMoney } from "../controller/transactionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/send", authMiddleware, sendMoney);

export default router;
