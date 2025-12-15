import '../../styles/tasks.css';
import TaskCard from './TaskCard';
import LoadingSpinner from '../common/LoadingSpinner';

export const TaskList = ({ tasks, loading, error, onUpdate, onDelete }) => {
  if (loading) return <LoadingSpinner message="Loading tasks..." />;
  
  if (error) {
    return (
      <div className="error-message">
        <p>❌ Error: {error}</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No tasks found</p>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
