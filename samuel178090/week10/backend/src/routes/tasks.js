import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// GET all tasks or filter by status/assignee
router.get('/', getAllTasks);

// POST new task
router.post('/', createTask);

// GET task by ID
router.get('/:id', getTaskById);

// PUT (update) task by ID
router.put('/:id', updateTask);

// DELETE task by ID
router.delete('/:id', deleteTask);

export default router;
