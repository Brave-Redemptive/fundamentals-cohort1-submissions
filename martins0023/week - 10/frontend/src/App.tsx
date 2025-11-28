import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="logo">SyncForge</Link>
          <div style={{display:'flex', gap:'1rem'}}>
             {/* Mock user for visual completeness */}
             <span>Welcome, Engineer</span>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;