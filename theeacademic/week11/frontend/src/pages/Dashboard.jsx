import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Send, Plus, TrendingUp, History } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, updateUserBalance } = useAuth()
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)
  const [depositError, setDepositError] = useState('')
  const [depositSuccess, setDepositSuccess] = useState('')

  useEffect(() => {
    fetchRecentTransactions()
  }, [])

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get('/transactions/history?limit=5')
      setRecentTransactions(response.data.transactions)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    setDepositLoading(true)
    setDepositError('')
    setDepositSuccess('')

    try {
      const amount = parseFloat(depositAmount)
      if (amount <= 0) {
        setDepositError('Amount must be greater than 0')
        return
      }

      await api.post('/transactions/deposit', {
        amount,
        description: 'Account deposit'
      })

      // Update user balance
      updateUserBalance(user.balance + amount)
      
      setDepositSuccess(`Successfully deposited $${amount.toFixed(2)}`)
      setDepositAmount('')
      
      // Refresh transactions
      fetchRecentTransactions()
    } catch (error) {
      setDepositError(error.response?.data?.message || 'Deposit failed')
    } finally {
      setDepositLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome back, {user?.firstName}!
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your payments and view your transaction history
        </p>
      </div>

      <div className="grid grid-2">
        {/* Balance Card */}
        <div className="card balance-card">
          <div className="balance-label">Current Balance</div>
          <div className="balance-amount">
            ${user?.balance?.toFixed(2) || '0.00'}
          </div>
          <div className="balance-label">USD</div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} />
            Quick Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/send" className="btn btn-primary">
              <Send size={16} />
              Send Money
            </Link>
            
            <Link to="/history" className="btn btn-secondary">
              <History size={16} />
              View All Transactions
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        {/* Deposit Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            Add Funds
          </h3>
          
          <form onSubmit={handleDeposit}>
            <div className="form-group">
              <label className="form-label">
                <Wallet size={16} style={{ marginRight: '0.5rem' }} />
                Deposit Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="form-input"
                placeholder="Enter amount to deposit"
                required
              />
            </div>

            {depositError && (
              <div className="error-message">{depositError}</div>
            )}

            {depositSuccess && (
              <div className="success-message">{depositSuccess}</div>
            )}

            <button
              type="submit"
              disabled={depositLoading}
              className="btn btn-success"
              style={{ width: '100%' }}
            >
              {depositLoading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Deposit Funds
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} />
            Recent Transactions
          </h3>
          
          {recentTransactions.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No transactions yet
            </p>
          ) : (
            <div>
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <h4>
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       transaction.sender ? `From ${transaction.sender.name}` : 
                       `To ${transaction.recipient.name}`}
                    </h4>
                    <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`transaction-amount ${
                    transaction.type === 'deposit' || transaction.recipient ? 'positive' : 'negative'
                  }`}>
                    {transaction.type === 'deposit' || transaction.recipient ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Link 
                to="/history" 
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  marginTop: '1rem',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                View all transactions →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard