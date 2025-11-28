import { Request, Response } from "express";

const tasks = [] as any[];

export const listTasks = (req: Request, res: Response) => {
  res.json({ success: true, data: tasks });
};

export const createTask = (req: Request, res: Response) => {
  const task = req.body;
  tasks.push(task);

  res.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
};
