import React from 'react';
import { Dropdown, Badge, Button, Input } from 'antd';
import {
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import './AdminHeader.css';

const AdminHeader = ({ collapsed, onToggleSidebar, isMobile }) => {
  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Admin Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      // Reusable hook / action for logout
      console.log('Logout action triggered');
    }
  };

  return (
    <header className="admin-header">
      {/* LEFT SECTION: Logo and Sidebar Toggle */}
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        <a href="/admin/dashboard" className="header-brand">
          <span className="ebay-logo">
            <span className="letter-e">e</span>
            <span className="letter-b">b</span>
            <span className="letter-a">a</span>
            <span className="letter-y">y</span>
          </span>
          <span className="brand-badge">Admin</span>
        </a>
      </div>

      {/* CENTER SECTION: eBay-style Search Bar */}
      <div className="header-center">
        <div className="ebay-search-container">
          <Input
            placeholder="Search users, orders, listings, disputes..."
            prefix={<SearchOutlined className="search-icon" />}
            className="ebay-search-input"
            allowClear
          />
          <button type="button" className="ebay-search-btn">
            Search
          </button>
        </div>
      </div>

      {/* RIGHT SECTION: Quick Actions & Profile */}
      <div className="header-right">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-action-btn marketplace-link"
          title="Visit Marketplace Front"
        >
          <GlobalOutlined />
          <span className="action-text">Marketplace</span>
        </a>

        <button
          type="button"
          className="header-action-btn notification-btn"
          aria-label="View notifications"
        >
          <Badge count={0} showZero={false} dot={false} offset={[-2, 2]}>
            <BellOutlined className="action-icon" />
          </Badge>
        </button>

        <div className="header-divider" />

        <Dropdown
          menu={{ items: profileMenuItems, onClick: handleMenuClick }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="admin-profile-trigger">
            <div className="admin-avatar">
              <UserOutlined />
            </div>
            <div className="admin-info">
              <span className="admin-name">Admin User</span>
              <span className="admin-role">Super Admin</span>
            </div>
            <DownOutlined className="dropdown-arrow" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default AdminHeader;
