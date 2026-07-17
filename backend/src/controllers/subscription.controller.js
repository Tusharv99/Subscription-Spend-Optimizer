const Subscription = require('../models/Subscription.model');

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const subscriptionData = {
      ...req.body,
      userId: req.user._id
    };

    const subscription = await Subscription.create(subscriptionData);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private
const getSubscriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      billingCycle,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { userId: req.user._id };

    if (search) {
      filter.serviceName = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (billingCycle) {
      filter.billingCycle = billingCycle;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Subscription.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update fields
    const allowedFields = [
      'serviceName', 'provider', 'category', 'price', 'currency',
      'billingCycle', 'renewalDate', 'lastUsedDate', 'status',
      'autoRenew', 'description'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        subscription[field] = req.body[field];
      }
    });

    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unused subscriptions
// @route   GET /api/subscriptions/unused
// @access  Private
const getUnusedSubscriptions = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const subscriptions = await Subscription.find({
      userId: req.user._id,
      lastUsedDate: { $lt: cutoffDate },
      status: 'Active'
    });

    const recommendation = parseInt(days) >= 90 
      ? 'Consider cancelling this subscription as it has been unused for a long time.'
      : parseInt(days) >= 60
      ? 'This subscription has been unused for more than 60 days. Consider cancelling.'
      : 'This subscription has been unused for more than 30 days. Review if you still need it.';

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        count: subscriptions.length,
        daysThreshold: parseInt(days),
        recommendation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  getUnusedSubscriptions
};