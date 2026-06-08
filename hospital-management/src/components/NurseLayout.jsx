import React from 'react'
import { useSidebar } from '../hooks/useSidebar'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Pill,
  FileText,
  Bed,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  CheckSquare,
  FlaskConical
} from 'lucide-react'
import './Layout.css'

const NurseLayout = () => {
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
    { path: '/nurse-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/nurse-patients', icon: Users, label: 'My Patients' },
    { path: '/nurse-vitals', icon: Activity, label: 'Vitals' },
    { path: '/nurse-medications', icon: Pill, label: 'Medications' },
    { path: '/nurse-notes', icon: FileText, label: 'Notes' },
    { path: '/nurse-tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/nurse-lab-reports', icon: FlaskConical, label: 'Lab Reports' },
    { path: '/nurse-ward', icon: Bed, label: 'Ward Management' },
    { path: '/nurse-notifications', icon: Bell, label: 'Notifications' },
    { path: '/nurse-profile', icon: User, label: 'Profile' },
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
              <span className="user-name">{userData.name || 'Nurse'}</span>
              <span className="user-role">Nurse</span>
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

export default NurseLayout
