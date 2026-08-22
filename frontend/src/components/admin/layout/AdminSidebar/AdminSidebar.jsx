import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  StarOutlined,
  WarningOutlined,
  RollbackOutlined,
  LineChartOutlined,
  BellOutlined,
  HeartOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import './AdminSidebar.css';

const navSections = [
  {
    type: 'single',
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    path: '/admin/dashboard',
  },
  {
    type: 'group',
    title: 'MARKETPLACE',
    items: [
      { key: 'users', label: 'Users', icon: <UserOutlined />, path: '/admin/users' },
      { key: 'listings', label: 'Listings', icon: <AppstoreOutlined />, path: '/admin/listings' },
      { key: 'orders', label: 'Orders', icon: <ShoppingOutlined />, path: '/admin/orders' },
    ],
  },
  {
    type: 'group',
    title: 'MODERATION',
    items: [
      { key: 'reviews', label: 'Reviews', icon: <StarOutlined />, path: '/admin/reviews' },
      { key: 'disputes', label: 'Disputes', icon: <WarningOutlined />, path: '/admin/disputes' },
      { key: 'returns', label: 'Returns', icon: <RollbackOutlined />, path: '/admin/returns' },
    ],
  },
  {
    type: 'single',
    key: 'analytics',
    label: 'Analytics',
    icon: <LineChartOutlined />,
    path: '/admin/analytics',
  },
  {
    type: 'single',
    key: 'notifications',
    label: 'Notifications',
    icon: <BellOutlined />,
    path: '/admin/notifications',
  },
  {
    type: 'group',
    title: 'SYSTEM',
    items: [
      { key: 'system-health', label: 'System Health', icon: <HeartOutlined />, path: '/admin/system-health' },
      { key: 'audit-logs', label: 'Audit Logs', icon: <FileTextOutlined />, path: '/admin/audit-logs' },
      { key: 'security', label: 'Security', icon: <SafetyCertificateOutlined />, path: '/admin/security' },
    ],
  },
];

const AdminSidebar = ({ collapsed, isMobile, onCloseDrawer }) => {
  const location = useLocation();

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path || (item.key === 'dashboard' && location.pathname === '/admin');

    const content = (
      <NavLink
        to={item.path}
        className={({ isActive: linkActive }) =>
          `sidebar-nav-item ${isActive || linkActive ? 'active' : ''}`
        }
        onClick={() => {
          if (isMobile && onCloseDrawer) {
            onCloseDrawer();
          }
        }}
      >
        <span className="nav-item-icon">{item.icon}</span>
        {!collapsed && <span className="nav-item-label">{item.label}</span>}
      </NavLink>
    );

    if (collapsed && !isMobile) {
      return (
        <Tooltip title={item.label} placement="right" key={item.key}>
          <li className="sidebar-item-wrapper">{content}</li>
        </Tooltip>
      );
    }

    return (
      <li className="sidebar-item-wrapper" key={item.key}>
        {content}
      </li>
    );
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu-list">
            {navSections.map((section, index) => {
              if (section.type === 'single') {
                return renderNavItem(section);
              }

              if (section.type === 'group') {
                return (
                  <li className="sidebar-group-wrapper" key={section.title || index}>
                    {!collapsed && (
                      <div className="sidebar-group-title">{section.title}</div>
                    )}
                    {collapsed && <div className="sidebar-group-divider" />}
                    <ul className="sidebar-sub-menu">
                      {section.items.map((subItem) => renderNavItem(subItem))}
                    </ul>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        {!collapsed ? (
          <div className="sidebar-version-badge">
            <span className="status-dot online" />
            <span>eBay Admin v1.0 (Phase 1)</span>
          </div>
        ) : (
          <div className="sidebar-collapsed-dot">
            <span className="status-dot online" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
