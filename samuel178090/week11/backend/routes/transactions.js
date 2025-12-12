const express = require('express');
const { 
  createTransaction, 
  getTransactions, 
  getAllTransactions, 
  transferFunds, 
  getBalance, 
  getTransactionStats 
} = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', createTransaction);
router.post('/transfer', transferFunds);
router.get('/', getTransactions);
router.get('/all', getAllTransactions);
router.get('/balance', getBalance);
router.get('/stats', getTransactionStats);

module.exports = router;