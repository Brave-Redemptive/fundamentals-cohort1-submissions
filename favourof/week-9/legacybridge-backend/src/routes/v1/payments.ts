import { Router } from "express";

const router = Router();

// Legacy passthrough (simulate old API)
router.get("/", (req, res) => {
  res.json({ message: "Legacy v1 payments endpoint" });
});

export default router;
