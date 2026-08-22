import React, { useState, useEffect, useCallback } from 'react';
import { AlertOutlined, WarningOutlined, ReloadOutlined, CheckCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Skeleton, Alert, Tag } from 'antd';
import adminDashboardApi from '../../../../services/adminDashboardApi';
import { formatNumberVN } from '../../../../utils/currencyFormatter';
import './AttentionPanel.css';

/**
 * Attention Required Panel Component
 * Phase 6: Connected to real MongoDB queries for Return Requests, Disputes, Reports & Approvals.
 */
const AttentionPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [attentionData, setAttentionData] = useState({
    returnRequests: { count: 0, items: [] },
    activeDisputes: { count: 0, items: [] },
    reportedProducts: { count: 0, items: [] },
    reportedReviews: { count: 0, items: [] },
    pendingSellerApprovals: { count: 0, items: [] },
    total: 0,
  });

  const fetchAttention = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminDashboardApi.getAttentionRequired();
      if (res && res.success && res.data) {
        setAttentionData(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load attention required items');
      }
    } catch (err) {
      console.error('[AttentionPanel] Error fetching attention items:', err);
      setError(err.message || 'Unable to load attention items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttention();
  }, [fetchAttention]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const tasks = [
    {
      id: 'disputes',
      label: 'Open buyer-seller disputes',
      count: attentionData.activeDisputes?.count || 0,
      items: attentionData.activeDisputes?.items || [],
      severity: (attentionData.activeDisputes?.count || 0) > 0 ? 'high' : 'neutral',
      path: '/admin/disputes?filter=open',
      emptyText: 'No active disputes requiring arbitration',
    },
    {
      id: 'returns',
      label: 'Pending return requests',
      count: attentionData.returnRequests?.count || 0,
      items: attentionData.returnRequests?.items || [],
      severity: (attentionData.returnRequests?.count || 0) > 0 ? 'medium' : 'neutral',
      path: '/admin/returns?filter=pending',
      emptyText: 'No pending return requests',
    },
    {
      id: 'sellers',
      label: 'Seller account approvals',
      count: attentionData.pendingSellerApprovals?.count || 0,
      items: attentionData.pendingSellerApprovals?.items || [],
      severity: (attentionData.pendingSellerApprovals?.count || 0) > 0 ? 'high' : 'neutral',
      path: '/admin/users?filter=pending-approval',
      emptyText: 'All seller accounts and stores are reviewed',
    },
    {
      id: 'listings',
      label: 'Reported listings',
      count: attentionData.reportedProducts?.count || 0,
      items: attentionData.reportedProducts?.items || [],
      severity: (attentionData.reportedProducts?.count || 0) > 0 ? 'medium' : 'neutral',
      path: '/admin/listings?filter=reported',
      emptyText: 'No reported listings flagged for violation',
    },
    {
      id: 'reviews',
      label: 'Reported reviews',
      count: attentionData.reportedReviews?.count || 0,
      items: attentionData.reportedReviews?.items || [],
      severity: (attentionData.reportedReviews?.count || 0) > 0 ? 'low' : 'neutral',
      path: '/admin/reviews?filter=flagged',
      emptyText: 'No reported reviews flagged',
    },
  ];

  return (
    <div className="ebay-card attention-panel">
      <div className="ebay-card-header">
        <div className="attention-title-group">
          <div className="attention-icon-badge">
            <AlertOutlined />
          </div>
          <div>
            <h3 className="ebay-card-title">Attention Required</h3>
            <span className="attention-subtitle">
              {loading ? 'Loading...' : `${formatNumberVN(attentionData.total)} action items requiring administrator review`}
            </span>
          </div>
        </div>
        {attentionData.total === 0 && !loading && !error && (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            All clear
          </Tag>
        )}
      </div>

      <div className="ebay-card-body attention-body">
        {error && !loading ? (
          <Alert
            type="error"
            showIcon
            icon={<WarningOutlined />}
            message="Unable to load attention required items"
            description={
              <div className="attention-error-retry">
                <span>{error}</span>
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={fetchAttention}
                >
                  Retry
                </Button>
              </div>
            }
          />
        ) : (
          <div className="attention-task-list">
            {tasks.map((task) => {
              const isExpanded = expandedId === task.id;
              const hasItems = task.items && task.items.length > 0;

              return (
                <div className="attention-task-wrapper" key={task.id}>
                  <div className="attention-task-row">
                    <div className="task-info">
                      <span className={`task-dot ${task.severity}`} />
                      <span className="task-label">{task.label}</span>
                    </div>

                    <div className="task-actions">
                      <span className="task-count">
                        {loading ? <Skeleton.Input active size="small" style={{ width: 30, height: 18 }} /> : formatNumberVN(task.count)}
                      </span>
                      {hasItems ? (
                        <Button
                          size="small"
                          className="ebay-task-btn"
                          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                          onClick={() => toggleExpand(task.id)}
                        >
                          {isExpanded ? 'Hide' : 'Details'}
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          className="ebay-task-btn disabled"
                          disabled
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Preview of Recent Items */}
                  {isExpanded && hasItems && (
                    <div className="task-items-dropdown">
                      {task.items.map((item) => (
                        <div className="task-dropdown-item" key={item.id}>
                          <div className="item-meta">
                            <span className="item-title">
                              {task.id === 'returns' && `Yêu cầu trả hàng: ${item.reason}`}
                              {task.id === 'disputes' && `Khiếu nại: ${item.description}`}
                            </span>
                            <span className="item-sub">
                              Người yêu cầu: <strong>{item.buyerName || item.raisedByName}</strong> • Trạng thái: <em>{item.status}</em>
                            </span>
                          </div>
                          <Tag color={item.status === 'under_review' ? 'orange' : 'blue'} style={{ textTransform: 'capitalize' }}>
                            {item.status}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttentionPanel;
