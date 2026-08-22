import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip, Button } from 'antd';
import { ToolOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './AdminPlaceholderPage.css';

/**
 * Placeholder component for future Admin modules (Phase 2+)
 */
const AdminPlaceholderPage = ({ title, moduleName }) => {
  const location = useLocation();
  const name = title || moduleName || location.pathname.split('/').pop();

  return (
    <div className="admin-placeholder-container">
      <div className="ebay-card placeholder-card">
        <div className="placeholder-icon-circle">
          <ToolOutlined />
        </div>
        <h2 className="placeholder-title">
          {name.charAt(0).toUpperCase() + name.slice(1)} Module
        </h2>
        <p className="placeholder-description">
          This module is part of the future implementation phase. The Admin Dashboard Foundation (Phase 1) is active.
        </p>
        <div className="placeholder-meta-box">
          <span>Route: <code>{location.pathname}</code></span>
        </div>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          href="/admin/dashboard"
          className="back-to-dashboard-btn"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminPlaceholderPage;
