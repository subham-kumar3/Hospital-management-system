import React from 'react'
import { useSidebar } from '../hooks/useSidebar'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText,
  ClipboardList,
  TestTube,
  Bell,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import './Layout.css'

const DoctorLayout = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}')

  const menuItems = [
    { path: '/doctor-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor-appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor-patients', icon: Users, label: 'My Patients' },
    { path: '/doctor-prescriptions', icon: ClipboardList, label: 'Prescriptions' },
    { path: '/doctor-medical-records', icon: FileText, label: 'Medical Records' },
    { path: '/doctor-lab-reports', icon: TestTube, label: 'Lab Reports' },
    { path: '/doctor-notifications', icon: Bell, label: 'Notifications' },
    { path: '/doctor-profile', icon: User, label: 'Profile' },
  ]

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
              <span className="user-name">{userData.name || 'Doctor'}</span>
              <span className="user-role">Doctor</span>
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

export default DoctorLayout
