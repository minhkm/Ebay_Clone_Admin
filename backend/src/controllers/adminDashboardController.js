import {
  getOverviewService,
  getOrderOverviewService,
  getUserOverviewService,
  getAttentionRequiredService,
  getRecentOrdersService,
  getSystemHealthService,
  getAnalyticsService,
  getUsersListService,
  getUserDetailService,
  updateUserActionService,
  getProductsListService,
  getProductDetailService,
  updateProductStatusService,
  getOrdersListService,
  getOrderDetailService,
  getReturnsListService,
  getReturnDetailService,
  updateReturnStatusService,
  getReviewsListService,
  getReviewDetailService,
  updateReviewStatusService,
  getDisputesListService,
  getDisputeDetailService,
  resolveDisputeService,
} from '../services/adminDashboardService.js';

/**
 * Controller to handle Admin Dashboard Overview API (Phase 2)
 */
export const getOverview = async (req, res) => {
  try {
    const data = await getOverviewService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve overview', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard Order Overview API (Phase 4)
 */
export const getOrderOverview = async (req, res) => {
  try {
    const data = await getOrderOverviewService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getOrderOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve order overview', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard User Overview API (Phase 5)
 */
export const getUserOverview = async (req, res) => {
  try {
    const data = await getUserOverviewService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getUserOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user overview', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard Attention Required API (Phase 6)
 */
export const getAttentionRequired = async (req, res) => {
  try {
    const data = await getAttentionRequiredService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getAttentionRequired error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve attention tasks', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard Recent Orders API (Phase 7)
 */
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const data = await getRecentOrdersService(limit);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getRecentOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recent orders', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard System Health API (Phase 8)
 */
export const getSystemHealth = async (req, res) => {
  try {
    const data = await getSystemHealthService();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getSystemHealth error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve system health', error: error.message });
  }
};

/**
 * Controller to handle Admin Dashboard Analytics API (Phase 3)
 */
export const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const validPeriods = ['day', 'week', 'month', 'quarter'];
    if (!validPeriods.includes(period.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid period '${period}'. Supported periods are: ${validPeriods.join(', ')}`,
      });
    }
    const data = await getAnalyticsService(period.toLowerCase());
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[AdminDashboardController] getAnalytics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics', error: error.message });
  }
};

/**
 * =========================================================================
 * PHASE 9 — 6 BUSINESS MANAGEMENT CONTROLLERS
 * =========================================================================
 */

// 1. USERS
export const getUsers = async (req, res) => {
  try {
    const data = await getUsersListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const data = await getUserDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const lockUser = async (req, res) => {
  try {
    const data = await updateUserActionService(req.params.id, 'lock');
    return res.status(200).json({ success: true, data, message: 'User locked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unlockUser = async (req, res) => {
  try {
    const data = await updateUserActionService(req.params.id, 'unlock');
    return res.status(200).json({ success: true, data, message: 'User unlocked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const data = await updateUserActionService(req.params.id, 'approve');
    return res.status(200).json({ success: true, data, message: 'User approved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const data = await getProductsListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await getProductDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const hideProduct = async (req, res) => {
  try {
    const data = await updateProductStatusService(req.params.id, true);
    return res.status(200).json({ success: true, data, message: 'Product hidden successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unhideProduct = async (req, res) => {
  try {
    const data = await updateProductStatusService(req.params.id, false);
    return res.status(200).json({ success: true, data, message: 'Product made visible successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. ORDERS
export const getOrders = async (req, res) => {
  try {
    const data = await getOrdersListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const data = await getOrderDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 4. RETURNS
export const getReturns = async (req, res) => {
  try {
    const data = await getReturnsListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReturnById = async (req, res) => {
  try {
    const data = await getReturnDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const approveReturn = async (req, res) => {
  try {
    const data = await updateReturnStatusService(req.params.id, 'approved');
    return res.status(200).json({ success: true, data, message: 'Return request approved' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectReturn = async (req, res) => {
  try {
    const data = await updateReturnStatusService(req.params.id, 'rejected');
    return res.status(200).json({ success: true, data, message: 'Return request rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. REVIEWS
export const getReviews = async (req, res) => {
  try {
    const data = await getReviewsListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const data = await getReviewDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const hideReview = async (req, res) => {
  try {
    const data = await updateReviewStatusService(req.params.id, true);
    return res.status(200).json({ success: true, data, message: 'Review hidden successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DISPUTES
export const getDisputes = async (req, res) => {
  try {
    const data = await getDisputesListService(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDisputeById = async (req, res) => {
  try {
    const data = await getDisputeDetailService(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const { resolution = 'Full refund issued to buyer', status = 'resolved' } = req.body || {};
    const data = await resolveDisputeService(req.params.id, resolution, status);
    return res.status(200).json({ success: true, data, message: 'Dispute resolved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const partialRefundDispute = async (req, res) => {
  try {
    const { resolution = 'Partial refund issued to buyer' } = req.body || {};
    const data = await resolveDisputeService(req.params.id, resolution, 'resolved');
    return res.status(200).json({ success: true, data, message: 'Partial refund applied to dispute' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getOverview,
  getOrderOverview,
  getUserOverview,
  getAttentionRequired,
  getRecentOrders,
  getSystemHealth,
  getAnalytics,
  getUsers,
  getUserById,
  lockUser,
  unlockUser,
  approveUser,
  getProducts,
  getProductById,
  hideProduct,
  unhideProduct,
  getOrders,
  getOrderById,
  getReturns,
  getReturnById,
  approveReturn,
  rejectReturn,
  getReviews,
  getReviewById,
  hideReview,
  getDisputes,
  getDisputeById,
  resolveDispute,
  partialRefundDispute,
};
