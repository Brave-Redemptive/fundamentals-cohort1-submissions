import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { POLLING_INTERVAL } from '../utils/constants';

export const useNotifications = (initialParams = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications({
        ...initialParams,
        ...params
      });
      
      setNotifications(response.jobs || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const createNotification = useCallback(async (data) => {
    try {
      const response = await notificationService.createNotification(data);
      // Refresh the list after creation
      await fetchNotifications();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create notification');
    }
  }, [fetchNotifications]);

  const createBulkNotifications = useCallback(async (jobs) => {
    try {
      const response = await notificationService.createBulkNotifications(jobs);
      // Refresh the list after creation
      await fetchNotifications();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to create bulk notifications');
    }
  }, [fetchNotifications]);

  // Auto-refresh notifications
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    pagination,
    fetchNotifications,
    createNotification,
    createBulkNotifications,
    refetch: fetchNotifications
  };
};