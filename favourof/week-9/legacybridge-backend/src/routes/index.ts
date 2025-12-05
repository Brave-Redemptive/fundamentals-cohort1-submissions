import { Router } from "express";
import v1Payments from "./v1/payments";
import v2Payments from "./v2/payments";

const router = Router();

// Versioned routes
router.use("/v1/payments", v1Payments);
router.use("/v2/payments", v2Payments);

export default router;
