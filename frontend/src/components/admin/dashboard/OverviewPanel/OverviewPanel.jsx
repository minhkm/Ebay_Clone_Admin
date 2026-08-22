import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingOutlined, TeamOutlined, RightOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import { Skeleton, Button, Alert } from 'antd';
import adminDashboardApi from '../../../../services/adminDashboardApi';
import { formatNumberVN } from '../../../../utils/currencyFormatter';
import './OverviewPanel.css';

/**
 * Marketplace Overview Panel Component
 * Phase 4: Order Overview connected to real MongoDB aggregation.
 * Phase 5: User Overview connected to real MongoDB aggregation.
 */
const OverviewPanel = () => {
  // Order Overview State
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    shipping: 0,
    shipped: 0,
    cancelled: 0,
    returned: 0,
    total: 0,
  });

  // User Overview State (Phase 5)
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    buyers: 0,
    sellers: 0,
    newUsers: 0,
  });

  const fetchOrderOverview = useCallback(async () => {
    try {
      setOrderLoading(true);
      setOrderError(null);
      const res = await adminDashboardApi.getOrderOverview();
      if (res && res.success && res.data) {
        setOrderStats(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load order statistics');
      }
    } catch (err) {
      console.error('[OverviewPanel] Error fetching order overview:', err);
      setOrderError(err.message || 'Unable to load order statistics');
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const fetchUserOverview = useCallback(async () => {
    try {
      setUserLoading(true);
      setUserError(null);
      const res = await adminDashboardApi.getUserOverview();
      if (res && res.success && res.data) {
        setUserStats(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load user statistics');
      }
    } catch (err) {
      console.error('[OverviewPanel] Error fetching user overview:', err);
      setUserError(err.message || 'Unable to load user statistics');
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderOverview();
    fetchUserOverview();
  }, [fetchOrderOverview, fetchUserOverview]);

  const orderStatuses = [
    { key: 'pending', label: 'Pending', count: orderStats.pending, color: '#fa8c16', bg: '#fff7e6' },
    { key: 'processing', label: 'Processing', count: orderStats.processing, color: '#1890ff', bg: '#e6f7ff' },
    { key: 'shipping', label: 'Shipping', count: orderStats.shipping, color: '#722ed1', bg: '#f9f0ff' },
    { key: 'shipped', label: 'Shipped', count: orderStats.shipped, color: '#52c41a', bg: '#f6ffed' },
    { key: 'cancelled', label: 'Cancelled', count: orderStats.cancelled, color: '#ff4d4f', bg: '#fff1f0' },
    { key: 'returned', label: 'Returned', count: orderStats.returned, color: '#8c8c8c', bg: '#f5f5f5' },
  ];

  const userSegments = [
    { key: 'total', label: 'Total Users', count: userStats.totalUsers, desc: 'All registered platform accounts' },
    { key: 'buyers', label: 'Buyers', count: userStats.buyers, desc: 'Accounts with buyer activity' },
    { key: 'sellers', label: 'Sellers', count: userStats.sellers, desc: 'Verified seller storefronts' },
    { key: 'newUsers', label: 'New Users', count: userStats.newUsers, desc: 'Registered in the last 30 days' },
  ];

  return (
    <div className="overview-container-grid">
      {/* LEFT: Order Overview (Phase 4 Real Data) */}
      <div className="ebay-card overview-card">
        <div className="ebay-card-header">
          <div className="overview-title-group">
            <div className="overview-icon-badge order-badge">
              <ShoppingOutlined />
            </div>
            <div>
              <h3 className="ebay-card-title">Order Overview</h3>
              <span className="overview-subtitle">
                Order status breakdown ({orderLoading ? '—' : `${formatNumberVN(orderStats.total)} total`})
              </span>
            </div>
          </div>
          <a href="/admin/orders" className="overview-view-link">
            Orders <RightOutlined style={{ fontSize: 10 }} />
          </a>
        </div>

        <div className="ebay-card-body">
          {orderError && !orderLoading ? (
            <Alert
              type="error"
              showIcon
              icon={<WarningOutlined />}
              message="Unable to load order statistics"
              description={
                <div className="overview-error-retry">
                  <span>{orderError}</span>
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    onClick={fetchOrderOverview}
                  >
                    Retry
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="order-status-grid">
              {orderStatuses.map((item) => (
                <div className="order-status-item" key={item.key}>
                  <div className="status-header">
                    <span
                      className="status-bullet"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="status-name">{item.label}</span>
                  </div>
                  <div className="status-count-box">
                    {orderLoading ? (
                      <Skeleton.Input active size="small" style={{ width: 45, height: 24 }} />
                    ) : (
                      <span className="status-count">{formatNumberVN(item.count)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: User Overview (Phase 5 Real Data) */}
      <div className="ebay-card overview-card">
        <div className="ebay-card-header">
          <div className="overview-title-group">
            <div className="overview-icon-badge user-badge">
              <TeamOutlined />
            </div>
            <div>
              <h3 className="ebay-card-title">User Overview</h3>
              <span className="overview-subtitle">
                Customer segment breakdown ({userLoading ? '—' : `${formatNumberVN(userStats.totalUsers)} total`})
              </span>
            </div>
          </div>
          <a href="/admin/users" className="overview-view-link">
            Users <RightOutlined style={{ fontSize: 10 }} />
          </a>
        </div>

        <div className="ebay-card-body">
          {userError && !userLoading ? (
            <Alert
              type="error"
              showIcon
              icon={<WarningOutlined />}
              message="Unable to load user statistics"
              description={
                <div className="overview-error-retry">
                  <span>{userError}</span>
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    onClick={fetchUserOverview}
                  >
                    Retry
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="user-segment-list">
              {userSegments.map((seg) => (
                <div className="user-segment-row" key={seg.key}>
                  <div className="segment-info">
                    <span className="segment-name">{seg.label}</span>
                    <span className="segment-desc">{seg.desc}</span>
                  </div>
                  <div className="segment-count-badge">
                    {userLoading ? (
                      <Skeleton.Input active size="small" style={{ width: 35, height: 20 }} />
                    ) : (
                      <span className="segment-value">{formatNumberVN(seg.count)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
