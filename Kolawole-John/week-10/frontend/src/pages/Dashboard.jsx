import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, tasksData] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getAllTasks(),
      ]);
      
      setStats(statsData.data.stats);
      setRecentTasks(tasksData.data.tasks.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to SyncForge Task Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon="📋"
          color="bg-blue-500"
        />
        <StatCard
          title="In Progress"
          value={stats?.byStatus['in-progress'] || 0}
          icon="⚡"
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed"
          value={stats?.byStatus.done || 0}
          icon="✅"
          color="bg-green-500"
        />
        <StatCard
          title="Urgent Tasks"
          value={stats?.byPriority.urgent || 0}
          icon="🔥"
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Status Breakdown</h2>
          <div className="space-y-3">
            <StatusBar label="To Do" value={stats?.byStatus.todo || 0} total={stats?.total || 1} color="bg-gray-400" />
            <StatusBar label="In Progress" value={stats?.byStatus['in-progress'] || 0} total={stats?.total || 1} color="bg-blue-500" />
            <StatusBar label="Review" value={stats?.byStatus.review || 0} total={stats?.total || 1} color="bg-purple-500" />
            <StatusBar label="Done" value={stats?.byStatus.done || 0} total={stats?.total || 1} color="bg-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet. Create one to get started!</p>
            ) : (
              recentTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.assignee}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${color} text-white p-4 rounded-lg text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatusBar = ({ label, value, total, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-600">{value}/{total}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all`}
        style={{ width: `${(value / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;