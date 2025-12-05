import { Link } from 'react-router-dom'
import { LogOut, User, Send, History, Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            PayVerse
          </Link>
          
          <div className="navbar-nav">
            <Link to="/dashboard" className="navbar-link">
              <Home size={16} />
              Dashboard
            </Link>
            <Link to="/send" className="navbar-link">
              <Send size={16} />
              Send Money
            </Link>
            <Link to="/history" className="navbar-link">
              <History size={16} />
              History
            </Link>
            
            <div className="navbar-link">
              <User size={16} />
              {user?.firstName} {user?.lastName}
            </div>
            
            <button 
              onClick={logout}
              className="btn btn-secondary"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar