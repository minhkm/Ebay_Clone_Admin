import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Skeleton, Alert, Button, Tooltip } from 'antd';
import { ShoppingOutlined, InboxOutlined, RightOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import adminDashboardApi from '../../../../services/adminDashboardApi';
import { formatCurrencyVND, formatNumberVN } from '../../../../utils/currencyFormatter';
import './RecentOrdersPanel.css';

/**
 * Recent Orders Table Component
 * Phase 7: Connected to real MongoDB queries.
 * Displays live recent orders stream with real buyer, seller, amount, status, and timestamp.
 */
const RecentOrdersPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchRecentOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminDashboardApi.getRecentOrders(8);
      if (res && res.success && res.data) {
        setOrders(res.data.orders || []);
        setTotalOrders(res.data.total || 0);
      } else {
        throw new Error(res?.message || 'Failed to load recent orders');
      }
    } catch (err) {
      console.error('[RecentOrdersPanel] Error fetching recent orders:', err);
      setError(err.message || 'Unable to load recent orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentOrders();
  }, [fetchRecentOrders]);

  const formatDateVN = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  const getStatusTag = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'shipped':
      case 'completed':
        return <Tag color="success" className="order-status-tag">Shipped</Tag>;
      case 'shipping':
        return <Tag color="purple" className="order-status-tag">Shipping</Tag>;
      case 'processing':
        return <Tag color="processing" className="order-status-tag">Processing</Tag>;
      case 'pending':
        return <Tag color="warning" className="order-status-tag">Pending</Tag>;
      case 'cancelled':
        return <Tag color="error" className="order-status-tag">Cancelled</Tag>;
      case 'returned':
        return <Tag color="default" className="order-status-tag">Returned</Tag>;
      default:
        return <Tag color="default" className="order-status-tag">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Tooltip title={`Full ID: ${id}`}>
          <span className="order-id-code">#{id.slice(-8).toUpperCase()}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (buyer) => <span className="buyer-name">{buyer || '—'}</span>,
    },
    {
      title: 'Seller',
      dataIndex: 'seller',
      key: 'seller',
      render: (seller) => <span className="seller-name">{seller || '—'}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="order-amount">{formatCurrencyVND(amount)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <span className="order-date-text">{formatDateVN(date)}</span>
      ),
    },
  ];

  return (
    <div className="ebay-card recent-orders-panel">
      <div className="ebay-card-header">
        <div className="orders-title-group">
          <div className="orders-icon-badge">
            <ShoppingOutlined />
          </div>
          <div>
            <h3 className="ebay-card-title">Recent Orders</h3>
            <span className="orders-subtitle">
              {loading
                ? 'Loading orders...'
                : `Showing latest ${orders.length} transactions of ${formatNumberVN(totalOrders)} total orders`}
            </span>
          </div>
        </div>

        <a href="/admin/orders" className="orders-view-all-link">
          All Orders ({loading ? '—' : formatNumberVN(totalOrders)}) <RightOutlined style={{ fontSize: 10 }} />
        </a>
      </div>

      <div className="ebay-card-body orders-table-wrapper">
        {error && !loading ? (
          <div className="orders-error-box">
            <Alert
              type="error"
              showIcon
              icon={<WarningOutlined />}
              message="Unable to load recent orders"
              description={
                <div className="orders-error-retry">
                  <span>{error}</span>
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    onClick={fetchRecentOrders}
                  >
                    Retry
                  </Button>
                </div>
              }
            />
          </div>
        ) : loading ? (
          <div className="orders-loading-box">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            pagination={false}
            size="middle"
            rowKey="id"
            locale={{
              emptyText: (
                <div className="orders-empty-container">
                  <InboxOutlined className="empty-orders-icon" />
                  <p className="empty-title">No recent orders</p>
                  <p className="empty-desc">
                    Live orders will appear here automatically as buyers place orders on the marketplace.
                  </p>
                </div>
              ),
            }}
            className="ebay-table"
          />
        )}
      </div>
    </div>
  );
};

export default RecentOrdersPanel;
