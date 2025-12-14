import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../../services/api';
import { NotificationStatus as Status } from '../../types/notification';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const NotificationStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getById(id!),
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!id,
  });

  const getStatusColor = (status: Status) => {
    const colors = {
      [Status.PENDING]: 'text-yellow-600 bg-yellow-100',
      [Status.QUEUED]: 'text-blue-600 bg-blue-100',
      [Status.PROCESSING]: 'text-purple-600 bg-purple-100',
      [Status.SENT]: 'text-green-600 bg-green-100',
      [Status.FAILED]: 'text-red-600 bg-red-100',
      [Status.RETRYING]: 'text-orange-600 bg-orange-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
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
    return Icon || Clock;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load notification details.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-red-600 hover:text-red-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { notification, logs } = data;
  const StatusIcon = getStatusIcon(notification.status);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Notification Details</h1>
        <p className="text-gray-600 mt-2">ID: {notification.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Status</h2>
              <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(notification.status)}`}>
                <StatusIcon size={18} />
                <span className="font-medium uppercase">{notification.status}</span>
              </div>
            </div>

            {notification.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700 text-sm mt-1">{notification.error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900 uppercase">{notification.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <p className="font-medium text-gray-900 capitalize">{notification.priority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Retry Count</p>
                <p className="font-medium text-gray-900">
                  {notification.retryCount} / {notification.maxRetries}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="font-medium text-gray-900">
                  {notification.processingTimeMs 
                    ? `${(notification.processingTimeMs / 1000).toFixed(2)}s`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Message Content</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-medium text-gray-900">{notification.recipient}</p>
              </div>

              {notification.subject && (
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-medium text-gray-900">{notification.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 mt-2">
                  <p className="text-gray-900 whitespace-pre-wrap">{notification.message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status Timeline</h2>
            
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`}></div>
                    {index < logs.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 uppercase">{log.status}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{log.message}</p>
                    {log.error && (
                      <p className="text-red-600 text-sm mt-1">Error: {log.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timestamps */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Timestamps</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-gray-900 font-medium">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              {notification.sentAt && (
                <div>
                  <p className="text-gray-600">Sent</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(notification.sentAt).toLocaleString()}
                  </p>
                </div>
              )}

              {notification.failedAt && (
                <div>
                  <p className="text-gray-600">Failed</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(notification.failedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900 font-medium">
                  {new Date(notification.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-secondary text-sm"
              >
                Refresh Status
              </button>
              
              <button
                onClick={() => navigate('/create')}
                className="w-full btn-primary text-sm"
              >
                Create Similar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationStatus;