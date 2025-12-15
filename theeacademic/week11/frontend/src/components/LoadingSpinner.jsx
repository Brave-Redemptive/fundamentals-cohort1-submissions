const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner