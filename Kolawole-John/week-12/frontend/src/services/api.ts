import axios from 'axios';
import type {
  CreateNotificationRequest,
  NotificationResponse,
  NotificationListResponse,
  NotificationDetailResponse,
  SystemStatsResponse,
  NotificationFilters,
} from '../types/notification';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Notification Service
export const notificationService = {
  /**
   * Create a new notification
   */
  create: async (data: CreateNotificationRequest): Promise<NotificationResponse> => {
    const response = await apiClient.post<NotificationResponse>('/api/notifications', data);
    return response.data;
  },

  /**
   * Get notification by ID with logs
   */
  getById: async (id: string): Promise<NotificationDetailResponse['data']> => {
    const response = await apiClient.get<NotificationDetailResponse>(`/api/notifications/${id}`);
    return response.data.data;
  },

  /**
   * Get all notifications with filters
   */
  getAll: async (filters?: NotificationFilters): Promise<NotificationListResponse['data']> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);

    const queryString = params.toString();
    const url = queryString ? `/api/notifications?${queryString}` : '/api/notifications';

    const response = await apiClient.get<NotificationListResponse>(url);
    return response.data.data;
  },

  /**
   * Get system statistics
   */
  getStats: async (): Promise<SystemStatsResponse['data']> => {
    const response = await apiClient.get<SystemStatsResponse>('/api/notifications/stats/system');
    return response.data.data;
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Export axios instance for custom requests
export default apiClient;
