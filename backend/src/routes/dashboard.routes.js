const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getDashboardStats,
  getCategorySpending,
  getRecentSubscriptions,
  getUpcomingRenewals
} = require('../controllers/dashboard.controller');

// All routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/category-spending', getCategorySpending);
router.get('/recent', getRecentSubscriptions);
router.get('/upcoming-renewals', getUpcomingRenewals);

module.exports = router;