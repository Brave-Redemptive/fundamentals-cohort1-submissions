import { Link } from 'react-router-dom';

const TaskCard = ({ task, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    urgent: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'review': 'bg-purple-100 text-purple-800',
    'done': 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status}
          </span>
          <span className="text-sm text-gray-500">👤 {task.assignee}</span>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/tasks/${task.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;