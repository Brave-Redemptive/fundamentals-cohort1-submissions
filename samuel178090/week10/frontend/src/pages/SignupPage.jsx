import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import '../styles/auth.css';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Team Member',
    timezone: 'UTC'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await usersAPI.create({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        timezone: formData.timezone
      });

      if (response.data.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.data));
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
    } catch (err) {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 Join SyncForge</h1>
        <p className="subtitle">Create your account and start collaborating</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option>Team Member</option>
                <option>Frontend Engineer</option>
                <option>Backend Engineer</option>
                <option>DevOps Engineer</option>
                <option>Product Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <select name="timezone" value={formData.timezone} onChange={handleChange}>
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>IST</option>
                <option>CET</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
