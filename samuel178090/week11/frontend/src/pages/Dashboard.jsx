import React, { useState, useEffect } from 'react';
import { transactionAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'deposit',
    description: ''
  });
  const [transferData, setTransferData] = useState({
    receiverId: '',
    amount: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
    fetchUserProfile();
    fetchBalance();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = user?.role === 'admin' 
        ? await transactionAPI.getAllAdmin()
        : await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await transactionAPI.getBalance();
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to fetch balance');
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await userAPI.search(query);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed');
    }
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.fullName : `User ${userId}`;
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await transactionAPI.create(newTransaction);
      setNewTransaction({ amount: '', type: 'deposit', description: '' });
      setSuccess('Transaction created successfully!');
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create transaction');
    } finally {
      setCreating(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await transactionAPI.transfer(transferData);
      setTransferData({ receiverId: '', amount: '', description: '' });
      setSearchQuery('');
      setSearchResults([]);
      setShowTransferForm(false);
      setSuccess(`Transfer completed! New balance: ₦${response.data.senderBalance.toLocaleString()}`);
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      setError(error.response?.data?.error || 'Transfer failed');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value
    });
  };

  const handleTransferChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const selectReceiver = (user) => {
    setTransferData({ ...transferData, receiverId: user.id });
    setSearchQuery(user.fullName);
    setSearchResults([]);
  };

  // Calculate stats
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    sent: transactions.filter(t => t.direction === 'sent').length,
    received: transactions.filter(t => t.direction === 'received').length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0)
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Loading PayVerse Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          {user?.role === 'admin' ? '🛡️ Admin Control Panel' : `Welcome back, ${user?.email?.split('@')[0]}!`}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          {user?.role === 'admin' ? 'System Administrator - Full Platform Control' : 'Your Personal Payment Dashboard'}
        </p>
      </div>

      {/* Admin vs User Stats */}
      {user?.role === 'admin' ? (
        // ADMIN STATS - System Overview
        <>
          <div className="grid grid-cols-4" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                {users.length}
              </div>
              <div style={{ color: '#991b1b', fontSize: '14px', fontWeight: '600' }}>👥 Total Users</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f9ff' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7', marginBottom: '4px' }}>
                {stats.total}
              </div>
              <div style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: '600' }}>🏦 System Transactions</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                ₦{stats.totalVolume.toLocaleString()}
              </div>
              <div style={{ color: '#166534', fontSize: '14px', fontWeight: '600' }}>💰 Total Volume</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffbeb' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div style={{ color: '#92400e', fontSize: '14px', fontWeight: '600' }}>📊 Success Rate</div>
            </div>
          </div>
          
          {/* Admin Control Panel */}
          <div className="card" style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', marginBottom: '20px' }}>
            <h3 style={{ color: '#92400e', marginBottom: '16px' }}>⚡ Admin Controls</h3>
            <div className="grid grid-cols-3">
              <button 
                className="btn btn-primary" 
                style={{ margin: '4px' }}
                onClick={() => setShowUsers(!showUsers)}
              >
                👥 {showUsers ? 'Hide' : 'Show'} Users ({users.length})
              </button>
              <button 
                className="btn btn-success" 
                style={{ margin: '4px' }}
                onClick={() => {
                  const report = `📊 PAYVERSE SYSTEM REPORT\n\nTotal Volume: ₦${transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}\nTransactions: ${stats.total}\nUsers: ${users.length}\nSuccess Rate: ${stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%\nGenerated: ${new Date().toLocaleString()}`;
                  setSuccess(report);
                }}
              >
                📊 System Reports
              </button>
              <button 
                className="btn btn-danger" 
                style={{ margin: '4px' }}
                onClick={() => {
                  const status = `🔧 PAYVERSE SYSTEM STATUS\n\n✅ REST API: Operational\n✅ JWT Authentication: Active\n✅ Database: Connected\n✅ Transaction Processing: Online\n✅ User Management: Functional\n\nLast Check: ${new Date().toLocaleString()}`;
                  setSuccess(status);
                }}
              >
                🔧 Platform Settings
              </button>
            </div>
          </div>
          
          {/* Admin User Management Panel */}
          {showUsers && (
            <div className="card" style={{ backgroundColor: '#f0f9ff', border: '2px solid #0284c7' }}>
              <h3 style={{ color: '#0c4a6e', marginBottom: '16px' }}>👥 User Management</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const userTransactions = transactions.filter(t => t.userId === u.id);
                      return (
                        <tr key={u.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{u.id}</td>
                          <td style={{ fontWeight: '600' }}>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                              {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td>{userTransactions.length} transactions</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        // USER STATS - Personal Overview
        <>
          <div className="grid grid-cols-4" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f9ff' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7', marginBottom: '4px' }}>
                ₦{userBalance.toLocaleString()}
              </div>
              <div style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: '600' }}>💰 Current Balance</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                {stats.received}
              </div>
              <div style={{ color: '#166534', fontSize: '14px', fontWeight: '600' }}>📥 Received</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                {stats.sent}
              </div>
              <div style={{ color: '#991b1b', fontSize: '14px', fontWeight: '600' }}>📤 Sent</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffbeb' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
                {userProfile?.region || 'NG-LAGOS'}
              </div>
              <div style={{ color: '#92400e', fontSize: '14px', fontWeight: '600' }}>🌍 Region</div>
            </div>
          </div>
          
          {/* Transfer Money Section */}
          <div className="card" style={{ backgroundColor: '#f0f9ff', border: '2px solid #0284c7', marginBottom: '20px' }}>
            <h3 style={{ color: '#0c4a6e', marginBottom: '16px' }}>💸 Send Money</h3>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowTransferForm(!showTransferForm)}
              style={{ marginBottom: showTransferForm ? '20px' : '0' }}
            >
              {showTransferForm ? '❌ Cancel Transfer' : '💸 Transfer Funds'}
            </button>
            
            {showTransferForm && (
              <form onSubmit={handleTransfer}>
                <div className="grid grid-cols-1" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label>Search Recipient</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by name, email, or account number..."
                    />
                    {searchResults.length > 0 && (
                      <div style={{ 
                        border: '1px solid #d1d5db', 
                        borderRadius: '8px', 
                        marginTop: '8px',
                        backgroundColor: 'white'
                      }}>
                        {searchResults.map(user => (
                          <div 
                            key={user.id}
                            onClick={() => selectReceiver(user)}
                            style={{
                              padding: '12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f3f4f6'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                              {user.email} • {user.accountNumber} • {user.region}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label>Amount (₦)</label>
                      <input
                        type="number"
                        name="amount"
                        value={transferData.amount}
                        onChange={handleTransferChange}
                        required
                        min="100"
                        step="100"
                        placeholder="25000"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={transferData.description}
                        onChange={handleTransferChange}
                        placeholder="Payment for..."
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={creating || !transferData.receiverId || !transferData.amount}
                  >
                    {creating ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                        Processing Transfer...
                      </>
                    ) : (
                      '💸 Send Money'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {/* Different Transaction Forms */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          {user?.role === 'admin' ? '🛠️ Admin: Create System Transaction' : '💳 Create New Transaction'}
        </h3>
        {user?.role === 'admin' && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #fca5a5'
          }}>
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '700' }}>
              ⚠️ ADMIN MODE: Creating transactions for the entire system
            </p>
          </div>
        )}
        <form onSubmit={handleCreateTransaction}>
          <div className="grid grid-cols-4" style={{ alignItems: 'end' }}>
            <div className="form-group">
              <label>Amount (₦)</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
                min="100"
                step="100"
                placeholder="50000"
              />
            </div>
            
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
              >
                <option value="deposit">💰 Deposit (Add Money)</option>
                <option value="withdrawal">💸 Withdrawal (Remove Money)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Payment description..."
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn ${newTransaction.type === 'deposit' ? 'btn-success' : 'btn-primary'}`}
              disabled={creating}
              style={{ marginBottom: '20px' }}
            >
              {creating ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  Processing...
                </>
              ) : (
                `${newTransaction.type === 'deposit' ? '💰' : '💸'} ${newTransaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}`
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1f2937' }}>
            📊 {user?.role === 'admin' ? 'All System Transactions' : 'Your Transaction History'}
          </h3>
          <span style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '14px',
            color: '#374151',
            fontWeight: '600'
          }}>
            {transactions.length} transactions
          </span>
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <p>No transactions yet. Create your first transaction above!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  {user?.role === 'admin' && <th>User</th>}
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{transaction.id}</td>
                    {user?.role === 'admin' && (
                      <td>
                        {transaction.senderId && transaction.receiverId ? 
                          `${transaction.senderId} → ${transaction.receiverId}` : 
                          `User ${transaction.senderId || transaction.receiverId}`
                        }
                      </td>
                    )}
                    <td>
                      <span style={{ 
                        color: transaction.direction === 'received' || transaction.type === 'deposit' ? '#16a34a' : '#dc2626',
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {(transaction.direction === 'received' || transaction.type === 'deposit') ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${transaction.type}`}>
                        {transaction.type === 'transfer' ? '🔄 Transfer' : 
                         transaction.type === 'deposit' ? '💰 Deposit' : '💸 Withdrawal'}
                      </span>
                      {transaction.direction && (
                        <span className={`badge badge-${transaction.direction === 'received' ? 'success' : 'primary'}`} style={{ marginLeft: '4px' }}>
                          {transaction.direction === 'received' ? '📥' : '📤'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                        {transaction.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280' }}>
                      {transaction.description || 'No description'}
                      {transaction.counterparty && (
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {transaction.direction === 'sent' ? 'To: ' : 'From: '}{transaction.counterparty}
                        </div>
                      )}
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '14px' }}>
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        <p>🔒 PayVerse - Secure Payment Processing Platform</p>
        <p>Demonstrating: SQL Database • JWT Authentication • REST API</p>
      </div>
    </div>
  );
};

export default Dashboard;