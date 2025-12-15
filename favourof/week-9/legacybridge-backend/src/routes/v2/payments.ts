import { Router } from "express";
import { getPayments } from "../../controllers/paymentController";

const router = Router();

router.get("/", getPayments); // ✅ now it's a function

export default router;
