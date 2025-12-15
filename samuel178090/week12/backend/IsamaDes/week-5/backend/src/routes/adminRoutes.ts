import express from "express";
const router = express.Router();

import { getAdminDashboard } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

router.post("/", 
    protect,                
  authorizeRoles("doctor, admin, patient"), 
    getAdminDashboard)

export default router;