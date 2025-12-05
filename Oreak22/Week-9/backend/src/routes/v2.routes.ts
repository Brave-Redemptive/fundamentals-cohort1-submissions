import { Router } from "express";
import {
  getPayments,
  getCustomers,
  getPaymentById,
} from "../controllers/v2.controller";

const router = Router();

router.get("/payments", getPayments);
router.get("/payments/:id", getPaymentById);
router.get("/customers", getCustomers);

export default router;
