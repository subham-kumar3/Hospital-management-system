import React from 'react'
import { useSidebar } from '../hooks/useSidebar'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Calendar, 
  Pill,
  FlaskConical,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/patients', icon: UserCheck, label: 'Patient Management' },
    { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/admin/pharmacy', icon: Pill, label: 'Pharmacy' },
    { path: '/admin/lab', icon: FlaskConical, label: 'Lab Management' },
    { path: '/admin/financial', icon: DollarSign, label: 'Financial' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/profile', icon: User, label: 'Profile' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🏥</span>
            {sidebarOpen && <span>Admin Panel</span>}
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
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">Administrator</span>
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

export default AdminLayout
