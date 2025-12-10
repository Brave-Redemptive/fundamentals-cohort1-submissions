import { Router } from 'express';
import { createJob, getJob, getJobs } from '../controllers/jobs.controller.js';


const router = Router();
router.post('/', createJob);
router.get('/:id', getJob);
router.get('/', getJobs);


export default router;
