import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { taskAPI } from '../services/api';
import './TasksPage.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getAllTasks();
      // backend returns { success, message, data: tasks, count }
      setTasks(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const response = await taskAPI.createTask(formData);
      setTasks([response.data?.data || response.data, ...tasks]);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      const response = await taskAPI.updateTask(editingTask.id, formData);
      setTasks(tasks.map(t => t.id === editingTask.id ? (response.data?.data || response.data) : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await taskAPI.updateTask(id, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? (response.data?.data || response.data) : t));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Ensure we always operate on an array
  const tasksArray = Array.isArray(tasks) ? tasks : [];

  const getFilteredTasks = () => {
    if (filterStatus === 'all') return tasksArray;
    return tasksArray.filter(t => t.status === filterStatus);
  };

  const filteredTasks = getFilteredTasks();

  if (loading && tasks.length === 0) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2>📋 Task Management</h2>
        <button
          className="create-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
        >
          {showForm ? '✕ Cancel' : '✨ New Task'}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchTasks} />}

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      <div className="filters">
        <span className="filter-label">Filter by status:</span>
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({tasksArray.length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'todo' ? 'active' : ''}`}
          onClick={() => setFilterStatus('todo')}
        >
          Todo ({tasksArray.filter(t => t.status === 'todo').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilterStatus('in-progress')}
        >
          In Progress ({tasksArray.filter(t => t.status === 'in-progress').length})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({tasksArray.filter(t => t.status === 'completed').length})
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started! 🎉</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
