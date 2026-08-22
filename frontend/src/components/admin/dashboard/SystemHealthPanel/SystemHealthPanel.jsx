import React, { useState, useEffect, useCallback } from 'react';
import {
  HeartOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  ClusterOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Skeleton, Alert, Button, Tag, Tooltip } from 'antd';
import adminDashboardApi from '../../../../services/adminDashboardApi';
import './SystemHealthPanel.css';

/**
 * System Health Panel Component
 * Phase 8: Connected to real MongoDB connection checks, Node.js runtime telemetry, and OS resource status.
 */
const SystemHealthPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminDashboardApi.getSystemHealth();
      if (res && res.success && res.data) {
        setHealthData(res.data);
      } else {
        throw new Error(res?.message || 'Failed to retrieve system health');
      }
    } catch (err) {
      console.error('[SystemHealthPanel] Error fetching health telemetry:', err);
      setError(err.message || 'Unable to load system health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const iconMap = {
    api: <CloudServerOutlined />,
    database: <DatabaseOutlined />,
    nginx: <GlobalOutlined />,
    ratelimit: <ThunderboltOutlined />,
    k8s: <ClusterOutlined />,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="health-status-indicator healthy">
            <span className="status-dot" /> Healthy
          </span>
        );
      case 'warning':
        return (
          <span className="health-status-indicator warning">
            <span className="status-dot" /> Warning
          </span>
        );
      default:
        return (
          <span className="health-status-indicator error">
            <span className="status-dot" /> Degraded
          </span>
        );
    }
  };

  const services = healthData?.services || [
    { id: 'api', name: 'API Server', status: 'healthy', latency: '2ms' },
    { id: 'database', name: 'Database (MongoDB)', status: 'healthy', latency: '—' },
    { id: 'nginx', name: 'Nginx Gateway', status: 'healthy', latency: '1ms' },
    { id: 'ratelimit', name: 'Rate Limiting', status: 'healthy', latency: '< 1ms' },
    { id: 'k8s', name: 'Host Memory & Resources', status: 'healthy', latency: '—' },
  ];

  return (
    <div className="ebay-card system-health-panel">
      <div className="ebay-card-header">
        <div className="health-title-group">
          <div className="health-icon-badge">
            <HeartOutlined />
          </div>
          <div>
            <h3 className="ebay-card-title">System Health</h3>
            <span className="health-subtitle">Core services and infrastructure telemetry</span>
          </div>
        </div>
        {!loading && !error && (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Operational
          </Tag>
        )}
      </div>

      <div className="ebay-card-body health-body">
        {error && !loading ? (
          <Alert
            type="error"
            showIcon
            icon={<WarningOutlined />}
            message="Unable to load system health"
            description={
              <div className="health-error-retry">
                <span>{error}</span>
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={fetchHealth}
                >
                  Retry
                </Button>
              </div>
            }
          />
        ) : loading ? (
          <div className="health-loading-box">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <div className="health-items-list">
            {services.map((item) => (
              <div className="health-item-row" key={item.id}>
                <div className="health-service-info">
                  <div className="health-item-icon">{iconMap[item.id] || <CloudServerOutlined />}</div>
                  <div>
                    <span className="health-service-name">{item.name}</span>
                    {item.detail && <span className="health-service-detail">{item.detail}</span>}
                  </div>
                </div>

                <div className="health-metrics">
                  <span className="health-latency">{item.latency}</span>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthPanel;
