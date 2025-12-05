import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.MODE === 'production' 
                       ? 'https://syncforge-backend.onrender.com'
                       : 'http://localhost:3000');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tasks API
export const taskAPI = {
  getAllTasks: () => apiClient.get('/api/tasks'),
  getTaskById: (id) => apiClient.get(`/api/tasks/${id}`),
  getTasksByStatus: (status) => apiClient.get('/api/tasks', { params: { status } }),
  getTasksByAssignee: (assignee) => apiClient.get('/api/tasks', { params: { assignee } }),
  createTask: (taskData) => apiClient.post('/api/tasks', taskData),
  updateTask: (id, updates) => apiClient.put(`/api/tasks/${id}`, updates),
  deleteTask: (id) => apiClient.delete(`/api/tasks/${id}`)
};

// Team API
export const teamAPI = {
  getAllMembers: () => apiClient.get('/api/team'),
  getMemberById: (id) => apiClient.get(`/api/team/${id}`),
  getMembersByRole: (role) => apiClient.get('/api/team', { params: { role } })
};

// Health check
export const healthCheck = () => apiClient.get('/health');

export default apiClient;
