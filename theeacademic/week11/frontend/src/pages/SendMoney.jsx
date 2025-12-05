import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Search, User, DollarSign, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const SendMoney = () => {
  const navigate = useNavigate()
  const { user, updateUserBalance } = useAuth()
  
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const searchUsers = async () => {
    if (!searchEmail.trim()) return

    setSearchLoading(true)
    try {
      const response = await api.get(`/users/search?email=${encodeURIComponent(searchEmail)}`)
      setSearchResults(response.data.users)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const selectRecipient = (recipient) => {
    setSelectedRecipient(recipient)
    setSearchResults([])
    setSearchEmail('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const transferAmount = parseFloat(amount)
      
      if (transferAmount <= 0) {
        setError('Amount must be greater than 0')
        return
      }

      if (transferAmount > user.balance) {
        setError('Insufficient balance')
        return
      }

      const response = await api.post('/transactions/send', {
        toUserId: selectedRecipient.id,
        amount: transferAmount,
        description: description.trim() || undefined
      })

      // Update user balance
      updateUserBalance(user.balance - transferAmount)
      
      setSuccess(`Successfully sent $${transferAmount.toFixed(2)} to ${selectedRecipient.name}`)
      
      // Reset form
      setSelectedRecipient(null)
      setAmount('')
      setDescription('')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error.response?.data?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Send Money
        </h1>
        <p style={{ color: '#6b7280' }}>
          Transfer money to other PayVerse users
        </p>
      </div>

      <div className="grid grid-2">
        {/* Recipient Selection */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} />
            Select Recipient
          </h3>

          {!selectedRecipient ? (
            <div>
              <div className="form-group">
                <label className="form-label">
                  <Search size={16} style={{ marginRight: '0.5rem' }} />
                  Search by Email
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter recipient's email"
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  />
                  <button
                    type="button"
                    onClick={searchUsers}
                    disabled={searchLoading || !searchEmail.trim()}
                    className="btn btn-primary"
                  >
                    {searchLoading ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    ) : (
                      <Search size={16} />
                    )}
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Search Results:
                  </p>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => selectRecipient(user)}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6'
                        e.target.style.borderColor = '#3b82f6'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white'
                        e.target.style.borderColor = '#e5e7eb'
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>{user.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f0f9ff',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: '500', color: '#1e40af' }}>{selectedRecipient.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#3730a3' }}>{selectedRecipient.email}</div>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedRecipient(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                Change Recipient
              </button>
            </div>
          )}
        </div>

        {/* Transfer Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={20} />
            Transfer Details
          </h3>

          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Available Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              ${user?.balance?.toFixed(2) || '0.00'}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={16} style={{ marginRight: '0.5rem' }} />
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={user?.balance || 0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                placeholder="Enter amount to send"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MessageSquare size={16} style={{ marginRight: '0.5rem' }} />
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                placeholder="What's this for?"
                maxLength={500}
              />
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message" style={{ marginBottom: '1rem' }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedRecipient || !amount}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send ${amount || '0.00'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SendMoney