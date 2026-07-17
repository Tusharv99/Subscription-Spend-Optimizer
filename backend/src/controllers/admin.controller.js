const User = require('../models/User.model');
const Subscription = require('../models/Subscription.model');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
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

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's subscriptions
    const subscriptions = await Subscription.find({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        user,
        subscriptionCount: subscriptions.length,
        subscriptions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user and their subscriptions
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Subscription.deleteMany({ userId: req.params.id })
    ]);

    res.status(200).json({
      success: true,
      message: 'User and their subscriptions deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Block user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block an admin user'
      });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unblock user
// @route   PUT /api/admin/users/:id/unblock
// @access  Private/Admin
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all subscriptions (admin view)
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (search) {
      filter.serviceName = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
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

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalSubscriptions, activeSubscriptions] = await Promise.all([
      User.countDocuments(),
      Subscription.countDocuments(),
      Subscription.countDocuments({ status: 'Active' })
    ]);

    // Get monthly revenue
    const subscriptions = await Subscription.find({ status: 'Active' });
    let monthlyRevenue = 0;
    subscriptions.forEach(sub => {
      let monthlyCost = sub.price;
      if (sub.billingCycle === 'Quarterly') monthlyCost = sub.price / 3;
      if (sub.billingCycle === 'Yearly') monthlyCost = sub.price / 12;
      monthlyRevenue += monthlyCost;
    });

    // Get top categories
    const categoryStats = await Subscription.aggregate([
      {
        $match: { status: 'Active' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSubscriptions,
        activeSubscriptions,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        topCategories: categoryStats
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
  getUsers,
  getUserDetails,
  deleteUser,
  blockUser,
  unblockUser,
  getAllSubscriptions,
  getAdminDashboardStats
};