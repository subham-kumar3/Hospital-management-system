import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  UserPlus,
  Users, 
  Calendar, 
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services'
import './ReceptionistLayout.css'

const ReceptionistLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/receptionist-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patient-registration', icon: UserPlus, label: 'Patient Registration' },
    { path: '/patient-list', icon: Users, label: 'Patient List' },
    { path: '/receptionist-appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor-schedule', icon: Clock, label: 'Doctor Schedule' },
    { path: '/billing', icon: DollarSign, label: 'Billing' },
    { path: '/enquiries', icon: MessageSquare, label: 'Enquiries' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/receptionist-profile', icon: Settings, label: 'Profile Settings' },
  ]

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000) // Poll every 60 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data.count)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🏥</span>
            {sidebarOpen && <span>Receptionist Portal</span>}
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
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="header-right">
            <Link to="/notifications" className="notification-bell">
              <Bell size={20} />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </Link>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Receptionist'}</span>
              <span className="user-role">{user?.role || 'Receptionist'}</span>
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

export default ReceptionistLayout
