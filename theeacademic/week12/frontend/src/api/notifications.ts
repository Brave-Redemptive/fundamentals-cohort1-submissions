import {
  NotificationPayload,
  JobsListResponse,
  JobDetailResponse,
  StatsResponse
} from '../types/notification';

const API_BASE = '/api/notifications';

export const createNotification = async (payload: NotificationPayload): Promise<{ jobId: string; status: string; message: string }> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create notification');
  }
  return response.json();
};

export const getNotificationStatus = async (jobId: string): Promise<JobDetailResponse> => {
  const response = await fetch(`${API_BASE}/${jobId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch job');
  }
  return response.json();
};

export const getAllNotifications = async (page = 1, limit = 20, status?: string): Promise<JobsListResponse> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.append('status', status);
  const response = await fetch(`${API_BASE}?${params}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch jobs');
  }
  return response.json();
};

export const getStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${API_BASE}/stats/summary`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch stats');
  }
  return response.json();
};
