import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  Bell,
  User,
  Search,
  LogOut,
  Menu,
  X,
  PieChart as PieChartIcon,
  BarChart3,
  Home,
  Settings,
  FileText
} from 'lucide-react';
import { getCurrentUser, logout } from '../utils/localStorage';
import { useDashboardData } from '../hooks/useDashboardData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const COLORS = ['#2563EB', '#22C55E', '#EAB308', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const data = useDashboardData();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Stat Card Component
  const StatCard = ({ title, value, description, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-secondary mt-2">{value}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      expired: 'bg-red-100 text-red-700 border-red-200',
      paused: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SO</span>
            </div>
            <h1 className="text-xl font-bold text-secondary hidden sm:block">
              Subscription Optimizer
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              placeholder="Search subscriptions..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-48 focus:outline-none"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-[10px] flex items-center justify-center font-medium">3</span>
          </button>
          
          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-secondary">{user.name}</span>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SO</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary">Subscription</h1>
              <p className="text-xs text-gray-500">Optimizer</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {[
            { icon: Home, label: 'Dashboard', active: true },
            { icon: CreditCard, label: 'Subscriptions' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: FileText, label: 'Reports' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-danger hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 md:p-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your subscription spending</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Subscriptions"
            value={data.totalSubscriptions}
            description="Active subscriptions"
            icon={LayoutDashboard}
            color="blue"
          />
          <StatCard
            title="Monthly Spending"
            value={`₹${data.monthlySpending.toLocaleString()}`}
            description="Per month"
            icon={CreditCard}
            color="green"
          />
          <StatCard
            title="Yearly Spending"
            value={`₹${data.yearlySpending.toLocaleString()}`}
            description="Per year"
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Upcoming Renewals"
            value={data.upcomingRenewals}
            description="In next 7 days"
            icon={Calendar}
            color="yellow"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-secondary mb-4">Monthly Spending Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#2563EB" 
                    strokeWidth={2} 
                    dot={{ fill: '#2563EB', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Spending (₹)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscriptions" 
                    stroke="#22C55E" 
                    strokeWidth={2} 
                    dot={{ fill: '#22C55E', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Subscriptions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-secondary mb-4">Category-wise Spending</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`₹${value}`, 'Spending']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-secondary">Recent Subscriptions</h3>
              <p className="text-sm text-gray-500 mt-1">Latest 8 subscriptions</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-secondary">{sub.serviceName}</td>
                    <td className="px-6 py-4 text-gray-600">{sub.category}</td>
                    <td className="px-6 py-4 font-medium text-secondary">₹{sub.price}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(sub.renewalDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;