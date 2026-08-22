import express from 'express';
import {
  getOverview,
  getOrderOverview,
  getUserOverview,
  getAttentionRequired,
  getRecentOrders,
  getAnalytics,
} from '../controllers/adminDashboardController.js';

const router = express.Router();

// GET /api/admin/dashboard/overview (Phase 2)
router.get('/overview', getOverview);

// GET /api/admin/dashboard/order-overview (Phase 4)
router.get('/order-overview', getOrderOverview);

// GET /api/admin/dashboard/user-overview (Phase 5)
router.get('/user-overview', getUserOverview);

// GET /api/admin/dashboard/attention-required (Phase 6)
router.get('/attention-required', getAttentionRequired);
router.get('/tasks', getAttentionRequired);

// GET /api/admin/dashboard/recent-orders (Phase 7)
router.get('/recent-orders', getRecentOrders);
router.get('/orders', getRecentOrders);

// GET /api/admin/dashboard/analytics (Phase 3)
router.get('/analytics', getAnalytics);

// Placeholders for future phases (Phase 8+)
router.get('/activity', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented in Phase 7' });
});

router.get('/system-health', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented in Phase 7' });
});

export default router;
