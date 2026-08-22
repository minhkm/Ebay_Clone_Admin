import {
  getOverviewService,
  getOrderOverviewService,
  getUserOverviewService,
  getAttentionRequiredService,
  getAnalyticsService,
} from '../services/adminDashboardService.js';

/**
 * Controller to handle Admin Dashboard Overview API (Phase 2)
 */
export const getOverview = async (req, res) => {
  try {
    const data = await getOverviewService();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[AdminDashboardController] getOverview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard overview',
      error: error.message,
    });
  }
};

/**
 * Controller to handle Admin Dashboard Order Overview API (Phase 4)
 */
export const getOrderOverview = async (req, res) => {
  try {
    const data = await getOrderOverviewService();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[AdminDashboardController] getOrderOverview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order overview statistics',
      error: error.message,
    });
  }
};

/**
 * Controller to handle Admin Dashboard User Overview API (Phase 5)
 */
export const getUserOverview = async (req, res) => {
  try {
    const data = await getUserOverviewService();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[AdminDashboardController] getUserOverview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user overview statistics',
      error: error.message,
    });
  }
};

/**
 * Controller to handle Admin Dashboard Attention Required API (Phase 6)
 */
export const getAttentionRequired = async (req, res) => {
  try {
    const data = await getAttentionRequiredService();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[AdminDashboardController] getAttentionRequired error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attention required tasks',
      error: error.message,
    });
  }
};

/**
 * Controller to handle Admin Dashboard Analytics API (period = day|week|month|quarter) (Phase 3)
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
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[AdminDashboardController] getAnalytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve revenue analytics data',
      error: error.message,
    });
  }
};

export default {
  getOverview,
  getOrderOverview,
  getUserOverview,
  getAttentionRequired,
  getAnalytics,
};
