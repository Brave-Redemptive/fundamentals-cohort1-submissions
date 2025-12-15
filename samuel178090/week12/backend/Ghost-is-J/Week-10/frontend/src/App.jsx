import {Routes, Route, Link} from 'react-router-dom';
import TasksPage from './pages/TasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';

export default function App() {
  return (
    <div style={{padding: 20}}>
      <h2>SyncForge Tasks</h2>

      <nav style={{marginBottom: 20}}>
        <Link to="/tasks" style={{marginRight: 10}}>Tasks</Link>
        <Link to="/tasks/create">Create Task</Link>
      </nav>

      <Routes>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
      </Routes>
    </div>
  );
}
