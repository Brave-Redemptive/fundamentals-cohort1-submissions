import express from "express";
const router = express.Router();

import {createProject, getProjects, commentOnProject} from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";

router.use(protect)
router.post("/create-project", createProject);
router.get("/", getProjects);
router.post("/:id/comment", commentOnProject);




export default router;



