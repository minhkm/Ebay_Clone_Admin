import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ToolOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './AdminPlaceholderPage.css';

/**
 * Placeholder component for sub-modules managed by other team members
 */
const AdminPlaceholderPage = ({ title, moduleName }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
          Phần module này do thành viên khác phụ trách trong dự án. 
          Module <strong>Admin Dashboard</strong> chính đã hoàn thiện đầy đủ và kết nối trực tiếp với MongoDB.
        </p>
        <div className="placeholder-meta-box">
          <span>Đường dẫn: <code>{location.pathname}</code></span>
        </div>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/dashboard')}
          className="back-to-dashboard-btn"
        >
          Về trang Dashboard chính
        </Button>
      </div>
    </div>
  );
};

export default AdminPlaceholderPage;
