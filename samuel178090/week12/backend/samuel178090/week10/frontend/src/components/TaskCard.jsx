import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#27ae60'
    };
    return colors[priority] || '#95a5a6';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'todo': '📋 Todo',
      'in-progress': '⏳ In Progress',
      'completed': '✅ Completed'
    };
    return badges[status] || status;
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className="meta-item">👤 {task.assignee}</span>
        <span className="meta-item">📅 {task.dueDate || 'No due date'}</span>
      </div>

      <div className="task-status">
        <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <span className="status-text">{getStatusBadge(task.status)}</span>
      </div>

      <div className="task-actions">
        <button className="edit-btn" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
