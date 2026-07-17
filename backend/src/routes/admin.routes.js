const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getUsers,
  getUserDetails,
  deleteUser,
  blockUser,
  unblockUser,
  getAllSubscriptions,
  getAdminDashboardStats
} = require('../controllers/admin.controller');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);

// Subscription management
router.get('/subscriptions', getAllSubscriptions);

// Admin dashboard
router.get('/stats', getAdminDashboardStats);

module.exports = router;