import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { adminService } from '@/services/api';
import { format, formatDistanceToNow } from 'date-fns';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, subscriptions
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, subsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ limit: 10 }),
        adminService.getAllSubscriptions({ limit: 10 })
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users || []);
      setSubscriptions(subsRes.data.data.subscriptions || []);
      setPagination(usersRes.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, block) => {
    try {
      if (block) {
        await adminService.blockUser(userId);
      } else {
        await adminService.unblockUser(userId);
      }
      fetchAdminData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their subscriptions?')) {
      try {
        await adminService.deleteUser(userId);
        fetchAdminData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await adminService.getUserDetails(userId);
      setSelectedUser(response.data.data);
      setUserDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      change: '+12%',
      bg: 'bg-gray-100'
    },
    { 
      title: 'Total Subscriptions', 
      value: stats?.totalSubscriptions || 0, 
      icon: CreditCard,
      change: '+8%',
      bg: 'bg-gray-100'
    },
    { 
      title: 'Active Subscriptions', 
      value: stats?.activeSubscriptions || 0, 
      icon: AlertCircle,
      change: '+5%',
      bg: 'bg-gray-100'
    },
    { 
      title: 'Monthly Revenue', 
      value: `$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`, 
      icon: DollarSign,
      change: '+15%',
      bg: 'bg-gray-100'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage users, subscriptions, and platform analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'subscriptions'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Subscriptions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800 text-lg">Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topCategories?.length > 0 ? (
                  stats.topCategories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <span className="font-medium text-gray-900">{cat._id}</span>
                        <span className="ml-2 text-sm text-gray-500">{cat.count} subscriptions</span>
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-800 rounded-full"
                          style={{ 
                            width: `${(cat.count / (stats.topCategories[0]?.count || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No categories data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800 text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-0">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 border-gray-300 bg-white text-gray-900"
                    />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSearch('')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={user.role === 'admin' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={user.isBlocked ? 'bg-gray-500 text-white' : 'bg-gray-800 text-white'}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUser(user._id)}
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.role !== 'admin' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBlockUser(user._id, !user.isBlocked)}
                                  className={`${
                                    user.isBlocked 
                                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                >
                                  {user.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'subscriptions' && (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No subscriptions found</td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => {
                      const getStatusColor = (status) => {
                        switch(status) {
                          case 'Active': return 'bg-gray-800 text-white';
                          case 'Expired': return 'bg-gray-400 text-white';
                          case 'Cancelled': return 'bg-gray-200 text-gray-700';
                          case 'Paused': return 'bg-gray-300 text-gray-800';
                          default: return 'bg-gray-100 text-gray-700';
                        }
                      };
                      return (
                        <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{sub.serviceName}</div>
                              <div className="text-sm text-gray-500">{sub.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sub.userId?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{sub.userId?.email || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            ${sub.price} {sub.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(sub.status)}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {format(new Date(sub.renewalDate), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(sub.createdAt), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">User Details</DialogTitle>
            <DialogDescription className="text-gray-500">
              View user information and their subscriptions
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xl">
                  {selectedUser.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.user?.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.user?.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge className="bg-gray-200 text-gray-700">
                      {selectedUser.user?.role}
                    </Badge>
                    <Badge className={selectedUser.user?.isBlocked ? 'bg-gray-500 text-white' : 'bg-gray-800 text-white'}>
                      {selectedUser.user?.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.subscriptionCount || 0}</p>
                  <p className="text-sm text-gray-500">Subscriptions</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">${selectedUser.totalSpending?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-gray-500">Total Spending</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedUser.subscriptions?.filter(s => s.status === 'Active').length || 0}
                  </p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>

              {/* User's Subscriptions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Subscriptions</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUser.subscriptions?.length > 0 ? (
                    selectedUser.subscriptions.map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">{sub.serviceName}</p>
                          <p className="text-sm text-gray-500">{sub.category} • {sub.billingCycle}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${sub.price}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            sub.status === 'Active' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No subscriptions</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;