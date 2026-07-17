const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAnalyticsSummary,
  getMonthlyExpenseSummary,
  getYearlyExpenseSummary
} = require('../controllers/analytics.controller');

// All routes are protected
router.use(protect);

router.get('/summary', getAnalyticsSummary);
router.get('/monthly', getMonthlyExpenseSummary);
router.get('/yearly', getYearlyExpenseSummary);

module.exports = router;