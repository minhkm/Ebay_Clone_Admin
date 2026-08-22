import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Drawer } from 'antd';
import AdminHeader from '../../components/admin/layout/AdminHeader/AdminHeader';
import AdminSidebar from '../../components/admin/layout/AdminSidebar/AdminSidebar';
import './AdminLayout.css';

/**
 * AdminLayout Component
 * Reusable master layout containing eBay-styled Header, responsive Sidebar, and Main Content.
 */
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Responsive breakpoint listener
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsMobile(true);
        setCollapsed(false);
      } else if (width < 1024) {
        setIsMobile(false);
        setCollapsed(true);
      } else {
        setIsMobile(false);
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="admin-layout-root">
      {/* HEADER */}
      <AdminHeader
        collapsed={collapsed}
        onToggleSidebar={handleToggleSidebar}
        isMobile={isMobile}
      />

      <div className="admin-layout-body">
        {/* DESKTOP / TABLET SIDEBAR */}
        {!isMobile && (
          <AdminSidebar
            collapsed={collapsed}
            isMobile={false}
          />
        )}

        {/* MOBILE DRAWER SIDEBAR */}
        {isMobile && (
          <Drawer
            placement="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            styles={{ body: { padding: 0 } }}
            width={260}
            closable={false}
            className="mobile-sidebar-drawer"
          >
            <div className="mobile-drawer-header">
              <span className="ebay-logo">
                <span className="letter-e">e</span>
                <span className="letter-b">b</span>
                <span className="letter-a">a</span>
                <span className="letter-y">y</span>
              </span>
              <span className="brand-badge">Admin</span>
            </div>
            <AdminSidebar
              collapsed={false}
              isMobile={true}
              onCloseDrawer={() => setMobileDrawerOpen(false)}
            />
          </Drawer>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
