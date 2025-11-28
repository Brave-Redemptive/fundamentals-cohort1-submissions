import express from 'express';
import { processTransaction, recentTransactions } from '../controllers/transaction.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { TransactionSchema } from '../validators/transaction.validator.js';

const router = express.Router();


router.post('/', validate(TransactionSchema), processTransaction);
router.get('/user/:userId/recent', recentTransactions);

export default router;
