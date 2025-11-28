import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/home.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="page-container">
      <Header />
      
      <main className="home-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to SyncForge</h1>
            {user && <h2>Hey {user.name}! 👋</h2>}
            <p>Build better software through distributed team collaboration</p>
            
            {user ? (
              <div className="button-group">
                <button className="btn-primary" onClick={() => navigate('/tasks')}>
                  View Tasks
                </button>
                <button className="btn-secondary" onClick={() => navigate('/team')}>
                  Browse Team
                </button>
                <button className="btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="button-group">
                <button className="btn-primary" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn-secondary" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="features">
          <h2>Why Choose SyncForge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="icon">🎯</span>
              <h3>Task Management</h3>
              <p>Organize and track tasks across your distributed team with ease</p>
            </div>
            <div className="feature-card">
              <span className="icon">👥</span>
              <h3>Team Collaboration</h3>
              <p>Connect with team members in different timezones seamlessly</p>
            </div>
            <div className="feature-card">
              <span className="icon">🔄</span>
              <h3>Code Reviews</h3>
              <p>Comprehensive code review process for quality assurance</p>
            </div>
            <div className="feature-card">
              <span className="icon">📊</span>
              <h3>Progress Tracking</h3>
              <p>Monitor project progress with real-time updates and insights</p>
            </div>
            <div className="feature-card">
              <span className="icon">🚀</span>
              <h3>Continuous Integration</h3>
              <p>Automated testing and deployment for faster delivery</p>
            </div>
            <div className="feature-card">
              <span className="icon">📚</span>
              <h3>Documentation</h3>
              <p>Centralized documentation for better knowledge sharing</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Transform Your Team?</h2>
          <p>Join SyncForge today and experience the future of distributed collaboration</p>
          {!user && (
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
