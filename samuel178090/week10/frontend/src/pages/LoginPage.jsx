import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import '../styles/auth.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Get all users and find matching email
      const response = await usersAPI.getAll();
      const user = response.data.data.find(u => u.email === email);

      if (!user) {
        setError('User not found. Please check your email.');
        setLoading(false);
        return;
      }

      // In a real app, you'd verify the password here
      localStorage.setItem('currentUser', JSON.stringify(user));
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🔐 Login to SyncForge</h1>
        <p className="subtitle">Access your team collaboration workspace</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-users">
          <p><strong>Demo Accounts:</strong></p>
          <ul>
            <li>👤 alice.chen@syncforge.com</li>
            <li>👤 bob.smith@syncforge.com</li>
            <li>👤 priya.patel@syncforge.com</li>
          </ul>
        </div>

        <p className="auth-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
