// Simulated PostgreSQL database operations
// In production, this would use actual pg client

const users = [
  { id: 1, email: 'admin@payverse.com', password: '$2a$10$example', role: 'admin', fullName: 'System Administrator', balance: 1000000, accountNumber: 'PV001', region: 'NG-LAGOS' },
  { id: 2, email: 'user@payverse.com', password: '$2a$10$example', role: 'user', fullName: 'Demo User', balance: 150000, accountNumber: 'PV002', region: 'NG-ABUJA' },
  { id: 3, email: 'alice@payverse.com', password: '$2a$10$example', role: 'user', fullName: 'Alice Johnson', balance: 75000, accountNumber: 'PV003', region: 'NG-LAGOS' },
  { id: 4, email: 'bob@payverse.com', password: '$2a$10$example', role: 'user', fullName: 'Bob Smith', balance: 200000, accountNumber: 'PV004', region: 'NG-KANO' }
];

const transactions = [
  { id: 1, senderId: null, receiverId: 1, amount: 50000, type: 'deposit', status: 'completed', createdAt: new Date(), currency: 'NGN', description: 'Initial deposit', region: 'NG-LAGOS' },
  { id: 2, senderId: 2, receiverId: 1, amount: 25000, type: 'transfer', status: 'completed', createdAt: new Date(), currency: 'NGN', description: 'Payment to admin', region: 'NG-ABUJA' },
  { id: 3, senderId: null, receiverId: 3, amount: 75000, type: 'deposit', status: 'completed', createdAt: new Date(), currency: 'NGN', description: 'Account funding', region: 'NG-LAGOS' }
];

const refreshTokens = [];

class Database {
  static findUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findUserById(id) {
    return users.find(user => user.id === id);
  }

  static getAllUsers() {
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }));
  }

  static createTransaction(transaction) {
    const newTransaction = {
      id: transactions.length + 1,
      ...transaction,
      currency: 'NGN',
      createdAt: new Date(),
      region: transaction.region || 'NG-LAGOS'
    };
    transactions.push(newTransaction);
    return newTransaction;
  }

  static processTransfer(senderId, receiverId, amount, description = '') {
    const sender = this.findUserById(senderId);
    const receiver = this.findUserById(receiverId);
    
    if (!sender || !receiver) {
      throw new Error('Invalid sender or receiver');
    }
    
    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;
    
    // Create transaction record
    const transaction = this.createTransaction({
      senderId,
      receiverId,
      amount,
      type: 'transfer',
      status: 'completed',
      description,
      region: sender.region
    });
    
    return { transaction, sender, receiver };
  }

  static getUserBalance(userId) {
    const user = this.findUserById(userId);
    return user ? user.balance : 0;
  }

  static updateUserBalance(userId, amount, type = 'credit') {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    
    if (type === 'credit') {
      user.balance += amount;
    } else {
      if (user.balance < amount) throw new Error('Insufficient balance');
      user.balance -= amount;
    }
    
    return user.balance;
  }

  static getTransactionStats() {
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;
    const regionStats = {};
    
    transactions.forEach(t => {
      if (!regionStats[t.region]) {
        regionStats[t.region] = { count: 0, volume: 0 };
      }
      regionStats[t.region].count++;
      regionStats[t.region].volume += t.amount;
    });
    
    return { totalVolume, totalTransactions, regionStats };
  }

  static getTransactionsByUserId(userId) {
    return transactions.filter(t => t.senderId === userId || t.receiverId === userId)
      .map(t => ({
        ...t,
        direction: t.senderId === userId ? 'sent' : 'received',
        counterparty: t.senderId === userId ? 
          this.findUserById(t.receiverId)?.fullName : 
          this.findUserById(t.senderId)?.fullName
      }));
  }

  static getAllTransactions() {
    return transactions;
  }

  static createUser(userData) {
    const newUser = {
      id: users.length + 1,
      email: userData.email,
      password: userData.password, // In production, hash this
      fullName: userData.fullName,
      role: 'user'
    };
    users.push(newUser);
    return newUser;
  }

  static saveRefreshToken(tokenEntry) {
    // tokenEntry: { token, userId, expiresAt }
    refreshTokens.push(tokenEntry);
    return tokenEntry;
  }

  static findRefreshToken(token) {
    return refreshTokens.find(t => t.token === token);
  }

  static revokeRefreshToken(token) {
    const idx = refreshTokens.findIndex(t => t.token === token);
    if (idx >= 0) refreshTokens.splice(idx, 1);
  }
}

module.exports = Database;