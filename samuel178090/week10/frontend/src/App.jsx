import { useState } from 'react';
import Navigation from './components/Navigation';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('tasks');

  return (
    <div className="app">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'tasks' && <TasksPage />}
        {currentPage === 'team' && <TeamPage />}
      </main>
      <footer className="app-footer">
        <p>© 2025 SyncForge - Building High-Quality Software as a Remote Team</p>
      </footer>
    </div>
  );
}

export default App;
