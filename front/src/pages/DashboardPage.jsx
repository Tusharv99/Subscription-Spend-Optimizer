import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import SubscriptionsList from '@/components/dashboard/SubscriptionsList';
import AnalyticsPage from '@/components/dashboard/AnalyticsPage';
import RenewalsPage from '@/components/dashboard/RenewalsPage';
import AdminPanel from '@/components/dashboard/AdminPanel';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="md:pl-64">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/subscriptions" element={<SubscriptionsList />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/renewals" element={<RenewalsPage />} />
          {user?.role === 'admin' && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPage;