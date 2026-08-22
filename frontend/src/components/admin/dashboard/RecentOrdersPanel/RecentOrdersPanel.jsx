import React from 'react';
import { Table, Empty, Button } from 'antd';
import { ShoppingOutlined, InboxOutlined, RightOutlined } from '@ant-design/icons';
import './RecentOrdersPanel.css';

/**
 * Recent Orders Table Component
 * Displays the latest marketplace transactions.
 * Phase 1: Clean table structure with empty state "No recent orders" (NO fake orders).
 */
const RecentOrdersPanel = () => {
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="order-id-cell">{text || '—'}</span>,
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (text) => <span className="buyer-cell">{text || '—'}</span>,
    },
    {
      title: 'Seller',
      dataIndex: 'seller',
      key: 'seller',
      render: (text) => <span className="seller-cell">{text || '—'}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span className="amount-cell">{text || '—'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span className="status-cell">{status || '—'}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span className="date-cell">{date || '—'}</span>,
    },
  ];

  // In Phase 1: No fake data. Empty list is passed to render empty state.
  const data = [];

  return (
    <div className="ebay-card recent-orders-panel">
      <div className="ebay-card-header">
        <div className="orders-title-group">
          <div className="orders-icon-badge">
            <ShoppingOutlined />
          </div>
          <div>
            <h3 className="ebay-card-title">Recent Orders</h3>
            <span className="orders-subtitle">Live stream of latest marketplace transactions</span>
          </div>
        </div>

        <a href="/admin/orders" className="orders-view-all-link">
          All Orders <RightOutlined style={{ fontSize: 10 }} />
        </a>
      </div>

      <div className="ebay-card-body orders-table-wrapper">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          size="middle"
          rowKey="orderId"
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
      </div>
    </div>
  );
};

export default RecentOrdersPanel;
