import express from "express";
const router = express.Router();

import { getPatientProfile } from "../controllers/patientController.js";
import { protect } from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

router.post("/", 
    protect,                
  authorizeRoles("doctor, admin, patient"), 
    getPatientProfile)

export default router;