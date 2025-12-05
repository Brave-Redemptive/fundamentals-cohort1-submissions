import '../../styles/tasks.css';
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/helpers';

export const TaskCard = ({ task, onUpdate, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button className="btn-small edit" onClick={() => onUpdate(task)}>Edit</button>
          <button className="btn-small delete" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <span 
          className="badge status" 
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {task.status}
        </span>
        
        <span 
          className="badge priority" 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
      </div>
      
      <div className="task-footer">
        <p><strong>Assigned to:</strong> {task.assignee}</p>
        <p><strong>Due:</strong> {formatDate(task.dueDate)}</p>
      </div>
    </div>
  );
};

export default TaskCard;
