import type { Request, Response } from 'express';
import { Task } from '../types/task';

// Simulating a database in memory
const tasks = [
  { id: '1', title: 'Fix Login Bug', status: 'Pending', assignee: 'Alex' },
  { id: '2', title: 'Setup CI/CD', status: 'In Progress', assignee: 'Sam' },
];

export const getTasks = (req: Request, res: Response) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = (req: Request, res: Response) => {
  try {
    const { title, assignee } = req.body;
    
    // Basic Validation
    if (!title || !assignee) {
      return res.status(400).json({ message: 'Title and Assignee are required' });
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: 'Pending',
      assignee
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};