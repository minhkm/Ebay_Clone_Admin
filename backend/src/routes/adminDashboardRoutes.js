import express from 'express';
import {
  getOverview,
  getOrderOverview,
  getUserOverview,
  getAttentionRequired,
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
// Alias for tasks
router.get('/tasks', getAttentionRequired);

// GET /api/admin/dashboard/analytics (Phase 3)
router.get('/analytics', getAnalytics);

// Placeholders for future phases (Phase 7+)
router.get('/orders', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented in Phase 6' });
});

router.get('/activity', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented in Phase 6' });
});

router.get('/system-health', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented in Phase 6' });
});

export default router;
