import React from 'react'
import { useSidebar } from '../hooks/useSidebar'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  FileText, 
  Building2,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const Layout = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin-user-management', icon: Users, label: 'User Management' },
    { path: '/admin/patients', icon: Users, label: 'Patient Management' },
    { path: '/admin/staff', icon: Stethoscope, label: 'Staff Management' },
    { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/admin/pharmacy', icon: FileText, label: 'Pharmacy & Inventory' },
    { path: '/admin/lab', icon: FileText, label: 'Lab Management' },
    { path: '/admin/financial', icon: FileText, label: 'Billing & Finance' },
    { path: '/admin/reports', icon: FileText, label: 'Reports & Analytics' },
    { path: '/admin/notifications', icon: FileText, label: 'Notifications' },
    { path: '/admin/settings', icon: Building2, label: 'Settings' },
    { path: '/admin/profile', icon: Building2, label: 'Profile' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🏥</span>
            {sidebarOpen && <span>Hospital HMS</span>}
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <button 
            className="toggle-sidebar"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.name || 'Dr. Admin'}</span>
              <span className="user-role">{user?.role || 'Administrator'}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
