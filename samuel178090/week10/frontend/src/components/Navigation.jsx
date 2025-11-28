import './Navigation.css';

export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>🚀 SyncForge</h1>
      </div>
      <ul className="nav-menu">
        <li>
          <button
            className={`nav-link ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={() => onNavigate('tasks')}
          >
            📋 Tasks
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${currentPage === 'team' ? 'active' : ''}`}
            onClick={() => onNavigate('team')}
          >
            👥 Team
          </button>
        </li>
      </ul>
    </nav>
  );
}
