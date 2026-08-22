import express from 'express';
import {
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
} from '../controllers/adminDashboardController.js';

const router = express.Router();

// DASHBOARD MODULE ROUTES (Phases 2 - 8)
router.get('/overview', getOverview);
router.get('/order-overview', getOrderOverview);
router.get('/user-overview', getUserOverview);
router.get('/attention-required', getAttentionRequired);
router.get('/tasks', getAttentionRequired);
router.get('/recent-orders', getRecentOrders);
router.get('/system-health', getSystemHealth);
router.get('/analytics', getAnalytics);

// PHASE 9 — 6 MANAGEMENT MODULE ROUTES

// 1. User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users/:id/lock', lockUser);
router.post('/users/:id/unlock', unlockUser);
router.post('/users/:id/approve', approveUser);

// 2. Product Management (Supports /products and /listings)
router.get('/products', getProducts);
router.get('/listings', getProducts);
router.get('/products/:id', getProductById);
router.get('/listings/:id', getProductById);
router.post('/products/:id/hide', hideProduct);
router.post('/products/:id/unhide', unhideProduct);
router.post('/listings/:id/hide', hideProduct);
router.post('/listings/:id/unhide', unhideProduct);

// 3. Order Management
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);

// 4. Return Management
router.get('/returns', getReturns);
router.get('/returns/:id', getReturnById);
router.post('/returns/:id/approve', approveReturn);
router.get('/returns/:id/approve', approveReturn);
router.post('/returns/:id/reject', rejectReturn);
router.get('/returns/:id/reject', rejectReturn);

// 5. Review Moderation
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewById);
router.post('/reviews/:id/hide', hideReview);

// 6. Dispute Resolution
router.get('/disputes', getDisputes);
router.get('/disputes/:id', getDisputeById);
router.post('/disputes/:id/resolve', resolveDispute);
router.post('/disputes/:id/partial-refund', partialRefundDispute);

export default router;
