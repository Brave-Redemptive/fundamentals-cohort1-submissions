import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/api';
import { Notification, NotificationStatus as Status } from '../../types/notification';
import { Bell, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', selectedStatus],
    queryFn: () => notificationService.getAll({ 
      page: 1, 
      limit: 20,
      status: selectedStatus || undefined 
    }),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => notificationService.getStats(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getStatusBadge = (status: Status) => {
    const badges = {
      [Status.PENDING]: 'badge badge-warning',
      [Status.QUEUED]: 'badge badge-info',
      [Status.PROCESSING]: 'badge bg-purple-100 text-purple-800',
      [Status.SENT]: 'badge badge-success',
      [Status.FAILED]: 'badge badge-error',
      [Status.RETRYING]: 'badge bg-orange-100 text-orange-800',
    };
    return badges[status] || 'badge';
  };

  const getStatusIcon = (status: Status) => {
    const icons = {
      [Status.PENDING]: Clock,
      [Status.QUEUED]: Clock,
      [Status.PROCESSING]: AlertTriangle,
      [Status.SENT]: CheckCircle,
      [Status.FAILED]: XCircle,
      [Status.RETRYING]: AlertTriangle,
    };
    const Icon = icons[status];
    return Icon ? <Icon size={16} /> : null;
  };

  const statsData = stats?.statusBreakdown || [];
  const totalNotifications = statsData.reduce((sum, stat) => sum + stat.count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load notifications. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your notification delivery system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Notifications</p>
              <p className="text-3xl font-bold text-gray-900">{totalNotifications}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Bell className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sent</p>
              <p className="text-3xl font-bold text-green-600">
                {statsData.find(s => s._id === 'sent')?.count || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Failed</p>
              <p className="text-3xl font-bold text-red-600">
                {statsData.find(s => s._id === 'failed')?.count || 0}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {statsData.find(s => s._id === 'pending' || s._id === 'queued')?.count || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="queued">Queued</option>
            <option value="processing">Processing</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="retrying">Retrying</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.notifications.map((notification: Notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 uppercase">
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{notification.recipient}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(notification.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(notification.status)}
                        {notification.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{notification.priority}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/notifications/${notification.id}`)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;