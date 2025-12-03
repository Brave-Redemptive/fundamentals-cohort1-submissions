import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import  protect  from "../middleware/authMiddleware.js"; 

const router = express.Router();
router.use(protect)

// GET /admin/profile/me
router.get("/me", getUserProfile )

export default router;
