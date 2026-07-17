const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createSubscriptionValidator,
  updateSubscriptionValidator
} = require('../validators/subscription.validator');
const {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  getUnusedSubscriptions
} = require('../controllers/subscription.controller');

// All routes are protected
router.use(protect);

// Unused subscriptions (must come before /:id)
router.get('/unused', getUnusedSubscriptions);

// CRUD routes
router.post('/', createSubscriptionValidator, validate, createSubscription);
router.get('/', getSubscriptions);
router.get('/:id', getSubscription);
router.put('/:id', updateSubscriptionValidator, validate, updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;