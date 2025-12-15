import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import NotificationStats from '../components/notifications/NotificationStats';
import NotificationList from '../components/notifications/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import { notificationService } from '../services/notificationService';

const Dashboard = () => {
  const { notifications, loading, refetch } = useNotifications({ limit: 10 });
  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const data = await notificationService.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    await Promise.all([refetch(), fetchStats()]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your notification delivery performance</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading || statsLoading}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${(loading || statsLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <NotificationStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">Latest notification jobs and their status</p>
            </div>
            <NotificationList 
              notifications={notifications} 
              loading={loading}
              compact={true}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Status</h3>
            <div className="space-y-3">
              {stats.queues && Object.entries(stats.queues).map(([queue, info]) => (
                <div key={queue} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 capitalize">{queue}</span>
                  <span className="text-sm text-gray-900">{info.messageCount || 0} msgs</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Queue Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;