const Subscription = require('../models/Subscription.model');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    // Get all subscriptions for the user
    const subscriptions = await Subscription.find({ userId });

    // Calculate stats
    let totalMonthlySpending = 0;
    let totalYearlySpending = 0;
    let activeCount = 0;
    let expiredCount = 0;
    let renewingNext7Days = 0;
    let renewingThisMonth = 0;
    let mostExpensive = null;
    let cheapest = null;

    subscriptions.forEach(sub => {
      // Calculate monthly cost
      let monthlyCost = sub.price;
      if (sub.billingCycle === 'Quarterly') monthlyCost = sub.price / 3;
      if (sub.billingCycle === 'Yearly') monthlyCost = sub.price / 12;
      
      // Calculate yearly cost
      let yearlyCost = sub.price;
      if (sub.billingCycle === 'Monthly') yearlyCost = sub.price * 12;
      if (sub.billingCycle === 'Quarterly') yearlyCost = sub.price * 4;

      if (sub.status === 'Active') {
        totalMonthlySpending += monthlyCost;
        totalYearlySpending += yearlyCost;
        activeCount++;
      }

      if (sub.status === 'Expired') {
        expiredCount++;
      }

      // Check renewals
      if (sub.status === 'Active') {
        const renewalDate = new Date(sub.renewalDate);
        
        // Renewing in next 7 days
        if (renewalDate >= today && renewalDate <= nextWeek) {
          renewingNext7Days++;
        }
        
        // Renewing this month
        if (renewalDate.getMonth() === today.getMonth() && 
            renewalDate.getFullYear() === today.getFullYear()) {
          renewingThisMonth++;
        }
      }

      // Track most and least expensive
      if (sub.status === 'Active') {
        if (!mostExpensive || sub.price > mostExpensive.price) {
          mostExpensive = sub;
        }
        if (!cheapest || sub.price < cheapest.price) {
          cheapest = sub;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalMonthlySpending: Math.round(totalMonthlySpending * 100) / 100,
        totalYearlySpending: Math.round(totalYearlySpending * 100) / 100,
        activeCount,
        expiredCount,
        totalCount: subscriptions.length,
        renewingNext7Days,
        renewingThisMonth,
        mostExpensive: mostExpensive ? {
          serviceName: mostExpensive.serviceName,
          price: mostExpensive.price,
          currency: mostExpensive.currency
        } : null,
        cheapest: cheapest ? {
          serviceName: cheapest.serviceName,
          price: cheapest.price,
          currency: cheapest.currency
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get category-wise spending
// @route   GET /api/dashboard/category-spending
// @access  Private
const getCategorySpending = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryData = await Subscription.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'Active'
        }
      },
      {
        $group: {
          _id: '$category',
          totalMonthlyCost: {
            $sum: {
              $cond: [
                { $eq: ['$billingCycle', 'Monthly'] },
                '$price',
                { $cond: [
                  { $eq: ['$billingCycle', 'Quarterly'] },
                  { $divide: ['$price', 3] },
                  { $divide: ['$price', 12] }
                ]}
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalMonthlyCost: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent subscriptions
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentSubscriptions = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const subscriptions = await Subscription.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get upcoming renewals
// @route   GET /api/dashboard/upcoming-renewals
// @access  Private
const getUpcomingRenewals = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const subscriptions = await Subscription.find({
      userId: req.user._id,
      status: 'Active',
      renewalDate: { $gte: today, $lte: futureDate }
    }).sort({ renewalDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        count: subscriptions.length,
        daysRange: parseInt(days)
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
  getDashboardStats,
  getCategorySpending,
  getRecentSubscriptions,
  getUpcomingRenewals
};