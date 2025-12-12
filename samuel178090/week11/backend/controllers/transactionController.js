const Database = require('../models/database');

const createTransaction = async (req, res) => {
  try {
    const { amount, type, description, receiverId } = req.body;
    const userId = req.user.userId;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Amount and type required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    let transaction;
    
    if (type === 'transfer' && receiverId) {
      // Inter-account transfer
      const result = Database.processTransfer(userId, receiverId, parseFloat(amount), description);
      transaction = result.transaction;
    } else {
      // Deposit/Withdrawal
      const balanceType = type === 'deposit' ? 'credit' : 'debit';
      Database.updateUserBalance(userId, parseFloat(amount), balanceType);
      
      transaction = Database.createTransaction({
        senderId: type === 'withdrawal' ? userId : null,
        receiverId: type === 'deposit' ? userId : null,
        amount: parseFloat(amount),
        type,
        description: description || '',
        status: 'completed'
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Transaction failed' });
  }
};

const transferFunds = async (req, res) => {
  try {
    const { receiverId, amount, description } = req.body;
    const senderId = req.user.userId;

    if (!receiverId || !amount) {
      return res.status(400).json({ error: 'Receiver ID and amount required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot transfer to yourself' });
    }

    const result = Database.processTransfer(senderId, receiverId, parseFloat(amount), description);
    
    res.status(201).json({
      transaction: result.transaction,
      senderBalance: result.sender.balance,
      message: 'Transfer completed successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Transfer failed' });
  }
};

const getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const balance = Database.getUserBalance(userId);
    const user = Database.findUserById(userId);
    
    res.json({ 
      balance, 
      accountNumber: user.accountNumber,
      region: user.region 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

const getTransactionStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const stats = Database.getTransactionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = Database.getTransactionsByUserId(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const transactions = Database.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all transactions' });
  }
};

module.exports = { 
  createTransaction, 
  getTransactions, 
  getAllTransactions, 
  transferFunds, 
  getBalance, 
  getTransactionStats 
};