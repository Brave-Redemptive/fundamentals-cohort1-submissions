import '../styles/common.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🔄 SyncForge</h1>
          <p>Team Collaboration Platform</p>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/tasks">Tasks</a>
          <a href="/team">Team</a>
          <a href="/login">Login</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
