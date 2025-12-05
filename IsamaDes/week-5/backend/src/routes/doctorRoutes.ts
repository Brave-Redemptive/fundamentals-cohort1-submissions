import express from "express";
const router = express.Router();

import { getDoctorProfile } from "../controllers/doctorController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

router.post("/", 
    protect,                
  authorizeRoles("doctor, admin, patient"), 
    getDoctorProfile)

export default router;