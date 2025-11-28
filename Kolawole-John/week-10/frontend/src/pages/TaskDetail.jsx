import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.getTaskById(id);
      setTask(data.data.task);
      setEditData(data.data.task);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(task);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updates = {
        title: editData.title,
        description: editData.description,
        assignee: editData.assignee,
        priority: editData.priority,
        status: editData.status,
      };
      
      const data = await taskAPI.updateTask(id, updates);
      setTask(data.data.task);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskAPI.deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      alert('Failed to delete task: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTask} />;
  if (!task) return <ErrorMessage message="Task not found" />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Tasks
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="text-3xl font-bold text-gray-900 w-full border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex space-x-3 ml-4">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Status & Priority Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isEditing ? (
            <>
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </>
          ) : (
            <>
              <span className={`px-4 py-2 rounded-md text-sm font-medium ${
                task.status === 'done' ? 'bg-green-100 text-green-800' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                task.status === 'review' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Status: {task.status}
              </span>
              <span className={`px-4 py-2 rounded-md text-sm font-medium ${
                task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Priority: {task.priority}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          {isEditing ? (
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          )}
        </div>

        {/* Assignee */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Assignee</h2>
          {isEditing ? (
            <input
              type="text"
              name="assignee"
              value={editData.assignee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-900 font-medium">{task.assignee}</span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-md">
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-gray-900 font-medium">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="text-gray-900 font-medium">
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;

