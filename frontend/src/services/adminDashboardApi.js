import axios from 'axios';

/**
 * Admin Dashboard & Management API Service
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin/dashboard';

export const adminDashboardApi = {
  // DASHBOARD APIs (Phases 2 - 8)
  getOverview: async (params) => {
    const response = await axios.get(`${API_BASE}/overview`, { params });
    return response.data;
  },

  getAnalytics: async (period = 'month') => {
    const response = await axios.get(`${API_BASE}/analytics`, { params: { period } });
    return response.data;
  },

  getOrderOverview: async () => {
    const response = await axios.get(`${API_BASE}/order-overview`);
    return response.data;
  },

  getUserOverview: async () => {
    const response = await axios.get(`${API_BASE}/user-overview`);
    return response.data;
  },

  getRecentOrders: async (limit = 8) => {
    const response = await axios.get(`${API_BASE}/recent-orders`, { params: { limit } });
    return response.data;
  },

  getAttentionRequired: async () => {
    const response = await axios.get(`${API_BASE}/attention-required`);
    return response.data;
  },

  getPendingTasks: async () => {
    const response = await axios.get(`${API_BASE}/tasks`);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await axios.get(`${API_BASE}/system-health`);
    return response.data;
  },

  // PHASE 9 — 6 BUSINESS MANAGEMENT APIs

  // 1. User Management
  getUsers: async (params) => {
    const response = await axios.get(`${API_BASE}/users`, { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axios.get(`${API_BASE}/users/${id}`);
    return response.data;
  },
  lockUser: async (id) => {
    const response = await axios.post(`${API_BASE}/users/${id}/lock`);
    return response.data;
  },
  unlockUser: async (id) => {
    const response = await axios.post(`${API_BASE}/users/${id}/unlock`);
    return response.data;
  },
  approveUser: async (id) => {
    const response = await axios.post(`${API_BASE}/users/${id}/approve`);
    return response.data;
  },

  // 2. Product Management
  getProducts: async (params) => {
    const response = await axios.get(`${API_BASE}/products`, { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await axios.get(`${API_BASE}/products/${id}`);
    return response.data;
  },
  hideProduct: async (id) => {
    const response = await axios.post(`${API_BASE}/products/${id}/hide`);
    return response.data;
  },
  unhideProduct: async (id) => {
    const response = await axios.post(`${API_BASE}/products/${id}/unhide`);
    return response.data;
  },

  // 3. Order Management
  getOrders: async (params) => {
    const response = await axios.get(`${API_BASE}/orders`, { params });
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await axios.get(`${API_BASE}/orders/${id}`);
    return response.data;
  },

  // 4. Return Management
  getReturns: async (params) => {
    const response = await axios.get(`${API_BASE}/returns`, { params });
    return response.data;
  },
  getReturnById: async (id) => {
    const response = await axios.get(`${API_BASE}/returns/${id}`);
    return response.data;
  },
  approveReturn: async (id) => {
    const response = await axios.post(`${API_BASE}/returns/${id}/approve`);
    return response.data;
  },
  rejectReturn: async (id) => {
    const response = await axios.post(`${API_BASE}/returns/${id}/reject`);
    return response.data;
  },

  // 5. Review Moderation
  getReviews: async (params) => {
    const response = await axios.get(`${API_BASE}/reviews`, { params });
    return response.data;
  },
  getReviewById: async (id) => {
    const response = await axios.get(`${API_BASE}/reviews/${id}`);
    return response.data;
  },
  hideReview: async (id) => {
    const response = await axios.post(`${API_BASE}/reviews/${id}/hide`);
    return response.data;
  },

  // 6. Dispute Resolution
  getDisputes: async (params) => {
    const response = await axios.get(`${API_BASE}/disputes`, { params });
    return response.data;
  },
  getDisputeById: async (id) => {
    const response = await axios.get(`${API_BASE}/disputes/${id}`);
    return response.data;
  },
  resolveDispute: async (id, body) => {
    const response = await axios.post(`${API_BASE}/disputes/${id}/resolve`, body);
    return response.data;
  },
  partialRefundDispute: async (id, body) => {
    const response = await axios.post(`${API_BASE}/disputes/${id}/partial-refund`, body);
    return response.data;
  },
};

export default adminDashboardApi;
