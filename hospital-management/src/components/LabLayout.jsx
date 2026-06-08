import React from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LabLayout.css';

const LabLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebar();

  const navItems = [
    { path: '/lab-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lab-tests', label: 'Test Requests', icon: '🧪' },
    { path: '/lab-samples', label: 'Sample Management', icon: '🧬' },
    { path: '/lab-results', label: 'Test Results', icon: '📝' },
    { path: '/lab-reports', label: 'Reports', icon: '📄' },
    { path: '/lab-notifications', label: 'Notifications', icon: '🔔' },
    { path: '/lab-profile', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="lab-layout">
      {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`lab-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="lab-sidebar-header">
          <h2>🔬 Lab Portal</h2>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="lab-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`lab-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="lab-sidebar-footer">
          <div className="user-info">
            {sidebarOpen && (
              <>
                <p className="user-name">{user?.name}</p>
                <p className="user-role">Lab Technician</p>
              </>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      <main className="lab-main-content">
        {isMobile && (
          <div className="lab-mobile-header">
            <button className="lab-mobile-menu-btn" onClick={toggleSidebar} aria-label="Open menu">
              ☰
            </button>
            <h3>🔬 Lab Portal</h3>
            <button className="logout-btn" onClick={handleLogout} style={{ width: 'auto', padding: '8px 12px' }}>
              🚪
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default LabLayout;
