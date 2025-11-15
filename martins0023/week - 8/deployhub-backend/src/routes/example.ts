import { Router } from 'express';
import { getExampleData, triggerError } from '../controllers/exampleController';

const router = Router();

router.get('/', getExampleData);
router.get('/error', triggerError);

export default router;