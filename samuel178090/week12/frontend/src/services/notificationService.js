import api from './api';

export const notificationService = {
  // Create single notification
  createNotification: async (data) => {
    const response = await api.post('/notifications/jobs', data);
    return response.data;
  },

  // Create bulk notifications
  createBulkNotifications: async (jobs) => {
    const response = await api.post('/notifications/jobs/bulk', { jobs });
    return response.data;
  },

  // Get all notifications with pagination and filters
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications/jobs', { params });
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (jobId) => {
    const response = await api.get(`/notifications/jobs/${jobId}`);
    return response.data;
  },

  // Get notification logs
  getNotificationLogs: async (jobId) => {
    const response = await api.get(`/notifications/jobs/${jobId}/logs`);
    return response.data;
  },

  // Get system statistics
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/admin/health');
    return response.data;
  },

  // Get queue stats
  getQueueStats: async () => {
    const response = await api.get('/admin/health/queues');
    return response.data;
  }
};

export default notificationService;