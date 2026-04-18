import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LabLayout.css';

const LabLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <aside className={`lab-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="lab-sidebar-header">
          <h2>🔬 Lab Portal</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
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
        {children}
      </main>
    </div>
  );
};

export default LabLayout;
