import axios from 'axios';

/**
 * Admin Dashboard API Service
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/dashboard';

export const adminDashboardApi = {
  // GET /api/admin/dashboard/overview (KPIs and metrics from MongoDB)
  getOverview: async (params) => {
    const response = await axios.get(`${API_BASE}/overview`, { params });
    return response.data;
  },

  // GET /api/admin/dashboard/analytics (Revenue & growth charts)
  getAnalytics: async (period = 'month') => {
    const response = await axios.get(`${API_BASE}/analytics`, { params: { period } });
    return response.data;
  },

  // GET /api/admin/dashboard/order-overview (Order status statistics from MongoDB - Phase 4)
  getOrderOverview: async () => {
    const response = await axios.get(`${API_BASE}/order-overview`);
    return response.data;
  },

  // GET /api/admin/dashboard/user-overview (User segment statistics from MongoDB - Phase 5)
  getUserOverview: async () => {
    const response = await axios.get(`${API_BASE}/user-overview`);
    return response.data;
  },

  // GET /api/admin/dashboard/recent-orders (Recent orders table from MongoDB - Phase 7)
  getRecentOrders: async (limit = 8) => {
    const response = await axios.get(`${API_BASE}/recent-orders`, { params: { limit } });
    return response.data;
  },

  // GET /api/admin/dashboard/attention-required (Attention required tasks from MongoDB - Phase 6)
  getAttentionRequired: async () => {
    const response = await axios.get(`${API_BASE}/attention-required`);
    return response.data;
  },

  // GET /api/admin/dashboard/tasks (Attention required / pending actions)
  getPendingTasks: async () => {
    const response = await axios.get(`${API_BASE}/tasks`);
    return response.data;
  },

  // GET /api/admin/dashboard/activity (Marketplace activity logs)
  getActivityLog: async (params) => {
    const response = await axios.get(`${API_BASE}/activity`, { params });
    return response.data;
  },

  // GET /api/admin/dashboard/system-health (Infrastructure and service status)
  getSystemHealth: async () => {
    const response = await axios.get(`${API_BASE}/system-health`);
    return response.data;
  },
};

export default adminDashboardApi;
