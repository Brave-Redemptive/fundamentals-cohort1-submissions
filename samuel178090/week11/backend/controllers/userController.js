const Database = require('../models/database');

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const users = Database.getAllUsers().map(user => ({
      ...user,
      balance: Database.getUserBalance(user.id),
      accountNumber: Database.findUserById(user.id).accountNumber,
      region: Database.findUserById(user.id).region
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.userId;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const allUsers = Database.getAllUsers();
    const filteredUsers = allUsers
      .filter(user => 
        user.id !== currentUserId && // Exclude current user
        (user.fullName.toLowerCase().includes(query.toLowerCase()) ||
         user.email.toLowerCase().includes(query.toLowerCase()) ||
         Database.findUserById(user.id).accountNumber.includes(query.toUpperCase()))
      )
      .map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: Database.findUserById(user.id).accountNumber,
        region: Database.findUserById(user.id).region
      }));
    
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = Database.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      balance: user.balance,
      accountNumber: user.accountNumber,
      region: user.region
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = { getAllUsers, searchUsers, getUserProfile };