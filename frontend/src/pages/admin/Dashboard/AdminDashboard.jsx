import React, { useState, useEffect, useCallback } from 'react';
import { Button, Alert, message } from 'antd';
import {
  ReloadOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  DollarOutlined,
  DownloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import KpiCard from '../../../components/admin/dashboard/KpiCard/KpiCard';
import AnalyticsPanel from '../../../components/admin/dashboard/AnalyticsPanel/AnalyticsPanel';
import OverviewPanel from '../../../components/admin/dashboard/OverviewPanel/OverviewPanel';
import AttentionPanel from '../../../components/admin/dashboard/AttentionPanel/AttentionPanel';
import RecentOrdersPanel from '../../../components/admin/dashboard/RecentOrdersPanel/RecentOrdersPanel';
import SystemHealthPanel from '../../../components/admin/dashboard/SystemHealthPanel/SystemHealthPanel';
import adminDashboardApi from '../../../services/adminDashboardApi';
import { formatCurrencyVND, formatNumberVN } from '../../../utils/currencyFormatter';
import './AdminDashboard.css';

/**
 * AdminDashboard Page
 * Phase 2: Connect 4 main KPI cards to the REAL existing MongoDB database.
 */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiData, setKpiData] = useState({
    totalUsers: null,
    totalListings: null,
    totalOrders: null,
    totalRevenue: null,
  });

  const fetchKpiOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminDashboardApi.getOverview();
      if (res && res.success && res.data) {
        setKpiData(res.data);
      } else {
        throw new Error(res?.message || 'Invalid API response');
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching KPI data:', err);
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpiOverview();
  }, [fetchKpiOverview]);

  return (
    <div className="admin-dashboard-container">
      {/* 1. PAGE HEADER */}
      <section className="dashboard-page-header">
        <div className="header-titles">
          <h1 className="dashboard-main-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your marketplace</p>
        </div>

        <div className="dashboard-actions">
          <Button
            icon={<ReloadOutlined spin={loading} />}
            size="middle"
            className="action-refresh-btn"
            onClick={fetchKpiOverview}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="middle"
            className="action-export-btn"
            onClick={() => message.info('Export report functionality will be available in future phases.')}
          >
            Export Report
          </Button>
        </div>
      </section>

      {/* ERROR ALERT WITH RETRY */}
      {error && !loading && (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message="Unable to load dashboard data"
          description={
            <div className="error-alert-content">
              <span>{error}. Please verify the MongoDB connection and backend server.</span>
              <Button
                size="small"
                type="primary"
                danger
                onClick={fetchKpiOverview}
                style={{ marginLeft: 12 }}
              >
                Retry
              </Button>
            </div>
          }
          className="dashboard-error-alert"
        />
      )}

      {/* 2. KPI SECTION (4 Cards: Total Users, Total Listings, Total Orders, Revenue) */}
      <section className="dashboard-section kpi-section-grid">
        <KpiCard
          title="Total Users"
          value={error ? '—' : formatNumberVN(kpiData.totalUsers)}
          footnote="Registered marketplace accounts"
          icon={<UserOutlined />}
          iconBgColor="#e6f7ff"
          iconColor="#0064d2"
          loading={loading}
        />
        <KpiCard
          title="Total Listings"
          value={error ? '—' : formatNumberVN(kpiData.totalListings)}
          footnote="Active marketplace inventory"
          icon={<AppstoreOutlined />}
          iconBgColor="#f6ffed"
          iconColor="#52c41a"
          loading={loading}
        />
        <KpiCard
          title="Total Orders"
          value={error ? '—' : formatNumberVN(kpiData.totalOrders)}
          footnote="Cumulative transactions processed"
          icon={<ShoppingOutlined />}
          iconBgColor="#fff7e6"
          iconColor="#fa8c16"
          loading={loading}
        />
        <KpiCard
          title="Revenue"
          value={error ? '—' : formatCurrencyVND(kpiData.totalRevenue)}
          footnote="Gross merchandise value (GMV)"
          icon={<DollarOutlined />}
          iconBgColor="#f9f0ff"
          iconColor="#722ed1"
          loading={loading}
        />
      </section>

      {/* 3. ANALYTICS SECTION (Phase 1 structure preserved) */}
      <section className="dashboard-section">
        <AnalyticsPanel />
      </section>

      {/* 4. MARKETPLACE OVERVIEW (Phase 1 structure preserved) */}
      <section className="dashboard-section">
        <OverviewPanel />
      </section>

      {/* 5. ATTENTION REQUIRED & SYSTEM HEALTH (Phase 1 structure preserved) */}
      <section className="dashboard-section dashboard-dual-grid">
        <div className="dual-grid-left">
          <AttentionPanel />
        </div>
        <div className="dual-grid-right">
          <SystemHealthPanel />
        </div>
      </section>

      {/* 6. RECENT ORDERS TABLE (Phase 1 structure preserved) */}
      <section className="dashboard-section">
        <RecentOrdersPanel />
      </section>
    </div>
  );
};

export default AdminDashboard;
