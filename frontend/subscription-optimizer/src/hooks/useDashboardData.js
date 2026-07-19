import { useState, useEffect } from 'react';
import subscriptionData from '../data/subscriptions.json';

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalSubscriptions: 0,
    monthlySpending: 0,
    yearlySpending: 0,
    upcomingRenewals: 0,
    categoryChartData: [],
    statusChartData: [],
    monthlyTrendData: [],
    recentSubscriptions: []
  });

  useEffect(() => {
    calculateData();
  }, []);

  const calculateData = () => {
    const subs = subscriptionData.subscriptions;
    
    // Total subscriptions
    const totalSubscriptions = subs.length;
    
    // Calculate spending
    let monthlySpending = 0;
    let yearlySpending = 0;
    
    subs.forEach(sub => {
      if (sub.billingCycle === 'monthly') {
        monthlySpending += sub.price;
        yearlySpending += sub.price * 12;
      } else {
        monthlySpending += sub.price / 12;
        yearlySpending += sub.price;
      }
    });
    
    // Upcoming renewals (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingRenewals = subs.filter(sub => {
      const renewal = new Date(sub.renewalDate);
      return renewal >= today && renewal <= nextWeek && sub.status === 'active';
    }).length;
    
    // Category spending
    const categoryMap = {};
    subs.forEach(sub => {
      const monthlyCost = sub.billingCycle === 'monthly' ? sub.price : sub.price / 12;
      if (categoryMap[sub.category]) {
        categoryMap[sub.category] += monthlyCost;
      } else {
        categoryMap[sub.category] = monthlyCost;
      }
    });
    
    const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));
    
    // Status distribution
    const statusMap = {};
    subs.forEach(sub => {
      if (statusMap[sub.status]) {
        statusMap[sub.status]++;
      } else {
        statusMap[sub.status] = 1;
      }
    });
    
    const statusChartData = Object.entries(statusMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    // Monthly trend (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTrendData = months.map((month, i) => ({
      month,
      spending: Math.round(200 + i * 30 + Math.random() * 50),
      subscriptions: Math.round(5 + i * 1.5 + Math.random() * 3)
    }));
    
    // Recent subscriptions
    const recentSubscriptions = subs.slice(0, 8);
    
    setData({
      totalSubscriptions,
      monthlySpending: Math.round(monthlySpending),
      yearlySpending: Math.round(yearlySpending),
      upcomingRenewals,
      categoryChartData,
      statusChartData,
      monthlyTrendData,
      recentSubscriptions
    });
  };

  return data;
};