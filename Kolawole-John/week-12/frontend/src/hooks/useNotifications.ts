import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../services/api';
import { REFRESH_INTERVAL } from '../utils/constants';

export const useNotifications = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationService.getAll(filters),
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useNotification = (id: string | undefined) => {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getById(id!),
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!id,
  });
};

export const useSystemStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => notificationService.getStats(),
    refetchInterval: REFRESH_INTERVAL * 2, // Refresh every 10 seconds
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => notificationService.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
  });
};