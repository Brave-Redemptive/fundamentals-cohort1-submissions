import { Router, Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/tasks (With Pagination)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const projectId = req.query.projectId as string;

    const result = taskService.getAll(page, limit, projectId);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total
      }
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/status/:status
router.get('/status/:status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = taskService.getByStatus(req.params.status);
    res.json({ success: true, data: tasks, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = taskService.getById(req.params.id);
    res.json({ success: true, data: task, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = taskService.create(req.body);
    res.status(201).json({ success: true, data: task, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = taskService.update(req.params.id, req.body);
    res.json({ success: true, data: task, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    taskService.delete(req.params.id);
    res.json({ success: true, message: 'Task deleted', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

export default router;