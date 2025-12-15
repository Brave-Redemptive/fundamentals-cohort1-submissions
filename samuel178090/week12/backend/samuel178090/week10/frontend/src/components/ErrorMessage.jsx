import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-content">
        <h3>⚠️ Error</h3>
        <p>{message}</p>
        {onRetry && (
          <button className="retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
