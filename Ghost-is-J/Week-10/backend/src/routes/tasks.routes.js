import {Router} from 'express';
import {createTask, getTasks} from '../controllers/tasks.controller.js';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);

export default router;
