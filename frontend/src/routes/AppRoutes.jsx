import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard';
import AdminPlaceholderPage from '../pages/admin/Placeholder/AdminPlaceholderPage';

/**
 * AppRoutes Component
 * Scope: Admin Dashboard module only. Other modules are placeholders handled by teammates.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Admin Dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin Module Routes wrapped in AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Main Dashboard - Primary Responsibility */}
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Other modules handled by other team members */}
        <Route path="users" element={<AdminPlaceholderPage title="User Management" />} />
        <Route path="listings" element={<AdminPlaceholderPage title="Listings Management" />} />
        <Route path="products" element={<AdminPlaceholderPage title="Product Management" />} />
        <Route path="orders" element={<AdminPlaceholderPage title="Order Management" />} />
        <Route path="returns" element={<AdminPlaceholderPage title="Return Management" />} />
        <Route path="reviews" element={<AdminPlaceholderPage title="Review Moderation" />} />
        <Route path="disputes" element={<AdminPlaceholderPage title="Dispute Resolution" />} />
        <Route path="analytics" element={<AdminPlaceholderPage title="Detailed Analytics" />} />
        <Route path="notifications" element={<AdminPlaceholderPage title="Notification Center" />} />
        <Route path="system-health" element={<AdminPlaceholderPage title="System Health & Telemetry" />} />
        <Route path="audit-logs" element={<AdminPlaceholderPage title="Audit Logs" />} />
        <Route path="security" element={<AdminPlaceholderPage title="Security Settings" />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
