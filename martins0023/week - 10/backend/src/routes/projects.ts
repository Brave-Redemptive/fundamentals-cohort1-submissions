import { Router, Request, Response, NextFunction } from 'express';
import { projectService } from '../services/projectService';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/projects
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = projectService.getAll();
    const response: ApiResponse = {
      success: true,
      data: projects,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/status/:status
router.get('/status/:status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = projectService.getAll(req.params.status);
    res.json({ success: true, data: projects, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = projectService.getById(req.params.id);
    res.json({ success: true, data: project, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = projectService.create(req.body);
    res.status(201).json({ success: true, data: project, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = projectService.update(req.params.id, req.body);
    res.json({ success: true, data: project, timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    projectService.delete(req.params.id);
    res.json({ success: true, message: 'Project deleted', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

export default router;