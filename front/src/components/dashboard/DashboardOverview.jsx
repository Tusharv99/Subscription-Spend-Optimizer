import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dashboardService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [recentSubs, setRecentSubs] = useState([]);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);

  // Minimal grey color palette
  const COLORS = ['#3a3a3a', '#6b6b6b', '#9a9a9a', '#c4c4c4', '#d4d4d4', '#e8e8e8'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, categoryRes, recentRes, renewalsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getCategorySpending(),
        dashboardService.getRecent(),
        dashboardService.getUpcomingRenewals(30)
      ]);

      setStats(statsRes.data.data);
      setCategoryData(categoryRes.data.data);
      setRecentSubs(recentRes.data.data);
      setUpcomingRenewals(renewalsRes.data.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Monthly Spending',
      value: `$${stats?.totalMonthlySpending?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeCount || 0,
      icon: CreditCard,
    },
    {
      title: 'Renewals This Month',
      value: stats?.renewingThisMonth || 0,
      icon: Clock,
    },
    {
      title: 'Total Subscriptions',
      value: stats?.totalCount || 0,
      icon: AlertCircle,
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="text-gray-700 mt-1">
          Welcome back, {user?.name}! Here's your subscription overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Spending Chart */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Category Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
                  <XAxis dataKey="_id" tick={{ fill: '#6b6b6b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b6b6b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      color: '#1a1a1a'
                    }}
                  />
                  <Bar dataKey="totalMonthlyCost" fill="#2d2d2d" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Active Subscriptions</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.activeCount || 0}/{stats?.totalCount || 0}</span>
                </div>
                <Progress 
                  value={((stats?.activeCount || 0) / (stats?.totalCount || 1)) * 100} 
                  className="h-1.5 bg-gray-200" 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Renewing in Next 7 Days</span>
                  <span className="text-sm font-medium text-gray-900">{stats?.renewingNext7Days || 0}</span>
                </div>
                <Progress 
                  value={((stats?.renewingNext7Days || 0) / (stats?.activeCount || 1)) * 100} 
                  className="h-1.5 bg-gray-200" 
                />
              </div>

              {stats?.mostExpensive && (
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600">Most Expensive</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.mostExpensive.serviceName}: ${stats.mostExpensive.price}
                  </span>
                </div>
              )}

              {stats?.cheapest && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cheapest</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.cheapest.serviceName}: ${stats.cheapest.price}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubs.length === 0 ? (
                <p className="text-gray-500 text-center py-6 text-sm">No subscriptions yet</p>
              ) : (
                recentSubs.slice(0, 5).map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{sub.serviceName}</p>
                      <p className="text-sm text-gray-500">
                        {sub.category} • {sub.billingCycle}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">${sub.price}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRenewals.length === 0 ? (
                <p className="text-gray-500 text-center py-6 text-sm">No upcoming renewals</p>
              ) : (
                upcomingRenewals.slice(0, 5).map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{sub.serviceName}</p>
                      <p className="text-sm text-gray-500">
                        Renews {formatDistanceToNow(new Date(sub.renewalDate), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                      ${sub.price}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;