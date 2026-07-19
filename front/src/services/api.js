import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Subscription Services
export const subscriptionService = {
  getAll: (params) => api.get('/subscriptions', { params }),
  getById: (id) => api.get(`/subscriptions/${id}`),
  create: (data) => api.post('/subscriptions', data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  delete: (id) => api.delete(`/subscriptions/${id}`),
  getUnused: (days) => api.get('/subscriptions/unused', { params: { days } }),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getCategorySpending: () => api.get('/dashboard/category-spending'),
  getRecent: () => api.get('/dashboard/recent'),
  getUpcomingRenewals: (days) => api.get('/dashboard/upcoming-renewals', { params: { days } }),
};

// Analytics Services
export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getMonthly: (month, year) => api.get('/analytics/monthly', { params: { month, year } }),
  getYearly: (year) => api.get('/analytics/yearly', { params: { year } }),
};

// Admin Services
export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  getAllSubscriptions: (params) => api.get('/admin/subscriptions', { params }),
  getStats: () => api.get('/admin/stats'),
};

export default api;