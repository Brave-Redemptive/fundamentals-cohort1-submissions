import { Request, Response } from "express";
import {AuthenticatedRequest} from "../middleware/authMiddleware.js";
import { projectRepository } from "../repositories/projectRepository.js";
import expressAsyncHandler from "express-async-handler";



export const createProject = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try{
    const { title, description } = req.body;
  const createdBy = req.user?._id;
  console.log("Create project payload:", req.body);
  console.log("Authenticated user:", req.user);
  const project = await projectRepository.create( title, description, createdBy );
  res.status(201).json(project);
  }catch(err: any){
   console.error("❌ Error inside createProject:", err);
    res.status(400).json({ message: err.message || "Failed to create project" });
  }
});

export const getProjects = expressAsyncHandler(async (_: Request, res: Response) => {
  const projects = await projectRepository.getAll()
  res.json(projects);
});

export const commentOnProject = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try{
     const { text } = req.body;
  const id = req.params.id

  console.log("🧠 Commenting on project:", id);
  console.log("🧠 Commenting on project ID:", id);
    console.log("🧠 Comment text:", text);
    console.log("🧠 Comment user:", req.user);

  const project = await projectRepository.findById(id);
  if (!project) {
  res.status(404).json({ message: "Project not found" });
  return;
  }  
  project.comments.push({ text, user: req.user?._id! });
      console.log("✅ Added comment:", project.comments[project.comments.length - 1]);

 
  //refecth to get the comment details for frontend
 const savedProject = await projectRepository.save(project)

     console.log("🧩 Saved project comments after save:", savedProject.comments);

  res.json(savedProject);
  }catch(err: any){
   console.error("❌ Error inside commentProject:", err);
    res.status(400).json({ message: err.message || "Failed to comment on project" });
  }
});
