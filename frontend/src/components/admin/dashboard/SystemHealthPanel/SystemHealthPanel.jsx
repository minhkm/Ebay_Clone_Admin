import React from 'react';
import {
  HeartOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import './SystemHealthPanel.css';

/**
 * System Health Panel Component
 * Displays infrastructural heartbeat and connectivity status.
 * Phase 1: Structure with '—' values (No live infrastructure connection).
 */
const SystemHealthPanel = () => {
  const healthItems = [
    {
      id: 'api',
      name: 'API Server',
      icon: <CloudServerOutlined />,
      status: '—',
      latency: '—',
    },
    {
      id: 'database',
      name: 'Database (MongoDB)',
      icon: <DatabaseOutlined />,
      status: '—',
      latency: '—',
    },
    {
      id: 'nginx',
      name: 'Nginx Gateway',
      icon: <GlobalOutlined />,
      status: '—',
      latency: '—',
    },
    {
      id: 'ratelimit',
      name: 'Rate Limiting',
      icon: <ThunderboltOutlined />,
      status: '—',
      latency: '—',
    },
    {
      id: 'k8s',
      name: 'Kubernetes Cluster',
      icon: <ClusterOutlined />,
      status: '—',
      latency: '—',
    },
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
      </div>

      <div className="ebay-card-body health-body">
        <div className="health-items-list">
          {healthItems.map((item) => (
            <div className="health-item-row" key={item.id}>
              <div className="health-service-info">
                <div className="health-item-icon">{item.icon}</div>
                <span className="health-service-name">{item.name}</span>
              </div>

              <div className="health-metrics">
                <span className="health-latency">{item.latency}</span>
                <span className="health-status-badge">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPanel;
