const Subscription = require('../models/Subscription.model');
const mongoose = require('mongoose');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all active subscriptions
    const subscriptions = await Subscription.find({ 
      userId, 
      status: 'Active' 
    });

    if (subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalSubscriptions: 0,
          averageMonthlySpending: 0,
          averageSubscriptionCost: 0,
          highestSpendingCategory: null,
          lowestSpendingCategory: null
        }
      });
    }

    // Calculate monthly costs
    const monthlyCosts = subscriptions.map(sub => {
      let monthlyCost = sub.price;
      if (sub.billingCycle === 'Quarterly') monthlyCost = sub.price / 3;
      if (sub.billingCycle === 'Yearly') monthlyCost = sub.price / 12;
      return {
        serviceName: sub.serviceName,
        category: sub.category,
        monthlyCost,
        price: sub.price,
        currency: sub.currency
      };
    });

    // Average monthly spending
    const totalMonthlySpending = monthlyCosts.reduce((sum, item) => sum + item.monthlyCost, 0);
    const averageMonthlySpending = totalMonthlySpending / subscriptions.length;

    // Average subscription cost
    const totalPrice = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const averageSubscriptionCost = totalPrice / subscriptions.length;

    // Category-wise spending
    const categorySpending = {};
    monthlyCosts.forEach(item => {
      if (categorySpending[item.category]) {
        categorySpending[item.category] += item.monthlyCost;
      } else {
        categorySpending[item.category] = item.monthlyCost;
      }
    });

    // Find highest and lowest spending categories
    let highestCategory = null;
    let lowestCategory = null;
    let highestAmount = -Infinity;
    let lowestAmount = Infinity;

    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = category;
      }
      if (amount < lowestAmount) {
        lowestAmount = amount;
        lowestCategory = category;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSubscriptions: subscriptions.length,
        averageMonthlySpending: Math.round(averageMonthlySpending * 100) / 100,
        averageSubscriptionCost: Math.round(averageSubscriptionCost * 100) / 100,
        highestSpendingCategory: {
          category: highestCategory,
          amount: Math.round(highestAmount * 100) / 100
        },
        lowestSpendingCategory: {
          category: lowestCategory,
          amount: Math.round(lowestAmount * 100) / 100
        },
        categoryBreakdown: categorySpending
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get monthly expense summary
// @route   GET /api/analytics/monthly
// @access  Private
const getMonthlyExpenseSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    const targetMonth = month ? parseInt(month) : new Date().getMonth();
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // Get active subscriptions
    const subscriptions = await Subscription.find({ 
      userId, 
      status: 'Active' 
    });

    let monthlyTotal = 0;
    const breakdown = [];

    subscriptions.forEach(sub => {
      let monthlyCost = sub.price;
      if (sub.billingCycle === 'Quarterly') monthlyCost = sub.price / 3;
      if (sub.billingCycle === 'Yearly') monthlyCost = sub.price / 12;

      monthlyTotal += monthlyCost;
      breakdown.push({
        serviceName: sub.serviceName,
        category: sub.category,
        monthlyCost: Math.round(monthlyCost * 100) / 100,
        currency: sub.currency
      });
    });

    res.status(200).json({
      success: true,
      data: {
        month: targetMonth,
        year: targetYear,
        totalMonthlySpending: Math.round(monthlyTotal * 100) / 100,
        breakdown: breakdown.sort((a, b) => b.monthlyCost - a.monthlyCost)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get yearly expense summary
// @route   GET /api/analytics/yearly
// @access  Private
const getYearlyExpenseSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;

    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    // Get active subscriptions
    const subscriptions = await Subscription.find({ 
      userId, 
      status: 'Active' 
    });

    let yearlyTotal = 0;
    const breakdown = [];

    subscriptions.forEach(sub => {
      let yearlyCost = sub.price;
      if (sub.billingCycle === 'Monthly') yearlyCost = sub.price * 12;
      if (sub.billingCycle === 'Quarterly') yearlyCost = sub.price * 4;

      yearlyTotal += yearlyCost;
      breakdown.push({
        serviceName: sub.serviceName,
        category: sub.category,
        yearlyCost: Math.round(yearlyCost * 100) / 100,
        currency: sub.currency
      });
    });

    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        totalYearlySpending: Math.round(yearlyTotal * 100) / 100,
        breakdown: breakdown.sort((a, b) => b.yearlyCost - a.yearlyCost)
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
  getAnalyticsSummary,
  getMonthlyExpenseSummary,
  getYearlyExpenseSummary
};