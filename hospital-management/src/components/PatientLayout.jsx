import React from 'react'
import { useSidebar } from '../hooks/useSidebar'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  Stethoscope, 
  FileText, 
  ClipboardList,
  FlaskConical,
  CreditCard,
  Bell,
  User,
  HelpCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './PatientLayout.css'

const PatientLayout = () => {
  const { sidebarOpen, toggleSidebar, closeSidebar, isMobile } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/patient/doctors', icon: Stethoscope, label: 'Doctors' },
    { path: '/patient/medical-records', icon: FileText, label: 'Medical Records' },
    { path: '/patient/prescriptions', icon: ClipboardList, label: 'Prescriptions' },
    { path: '/patient/lab-reports', icon: FlaskConical, label: 'Lab Reports' },
    { path: '/patient/billing', icon: CreditCard, label: 'Billing' },
    { path: '/patient/notifications', icon: Bell, label: 'Notifications' },
    { path: '/patient/profile', icon: User, label: 'Profile' },
    { path: '/patient/support', icon: HelpCircle, label: 'Support' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/patient-login')
  }

  return (
    <div className="patient-layout">
      {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`patient-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🏥</span>
            {sidebarOpen && <span>Patient Portal</span>}
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
              <span className="user-name">{user?.name || 'Patient'}</span>
              <span className="user-role">Patient</span>
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

export default PatientLayout
