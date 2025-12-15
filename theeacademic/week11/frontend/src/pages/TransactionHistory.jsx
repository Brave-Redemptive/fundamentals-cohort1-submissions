import { useState, useEffect } from 'react'
import { History, ArrowUpRight, ArrowDownLeft, Plus, Filter } from 'lucide-react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchTransactions(1)
  }, [])

  const fetchTransactions = async (pageNum) => {
    try {
      const response = await api.get(`/transactions/history?page=${pageNum}&limit=10`)
      const { transactions: newTransactions, pagination } = response.data

      if (pageNum === 1) {
        setTransactions(newTransactions)
      } else {
        setTransactions(prev => [...prev, ...newTransactions])
      }

      setHasMore(pagination.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = async () => {
    setLoadingMore(true)
    await fetchTransactions(page + 1)
  }

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'deposit') {
      return <Plus size={20} style={{ color: '#10b981' }} />
    } else if (transaction.sender) {
      return <ArrowDownLeft size={20} style={{ color: '#10b981' }} />
    } else {
      return <ArrowUpRight size={20} style={{ color: '#ef4444' }} />
    }
  }

  const getTransactionTitle = (transaction) => {
    if (transaction.type === 'deposit') {
      return 'Deposit'
    } else if (transaction.sender) {
      return `From ${transaction.sender.name}`
    } else {
      return `To ${transaction.recipient.name}`
    }
  }

  const getTransactionAmount = (transaction) => {
    const isIncoming = transaction.type === 'deposit' || transaction.sender
    const sign = isIncoming ? '+' : '-'
    return `${sign}$${transaction.amount.toFixed(2)}`
  }

  if (loading) {
    return <LoadingSpinner message="Loading transaction history..." />
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Transaction History
        </h1>
        <p style={{ color: '#6b7280' }}>
          View all your payment transactions and transfers
        </p>
      </div>

      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} />
            All Transactions
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
            <Filter size={16} />
            <span style={{ fontSize: '0.875rem' }}>
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <History size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No transactions yet</h3>
            <p>Your transaction history will appear here once you start making payments.</p>
          </div>
        ) : (
          <div>
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="transaction-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getTransactionIcon(transaction)}
                  </div>
                  
                  <div className="transaction-info" style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.25rem' }}>
                      {getTransactionTitle(transaction)}
                    </h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {transaction.description && (
                      <p style={{ 
                        color: '#6b7280', 
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                        marginTop: '0.25rem'
                      }}>
                        "{transaction.description}"
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className={`transaction-amount ${
                    transaction.type === 'deposit' || transaction.sender ? 'positive' : 'negative'
                  }`} style={{ fontSize: '1rem', fontWeight: '600' }}>
                    {getTransactionAmount(transaction)}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>
                    {transaction.status.toUpperCase()}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#9ca3af',
                    fontFamily: 'monospace'
                  }}>
                    {transaction.referenceId?.slice(-8)}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn btn-secondary"
                >
                  {loadingMore ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory