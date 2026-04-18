import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Pill, 
  FileText, 
  ShoppingCart, 
  DollarSign,
  User,
  Menu,
  X,
  LogOut,
  Bell
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const PharmacistLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/pharmacy-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pharmacy/prescriptions', icon: FileText, label: 'Prescriptions' },
    { path: '/pharmacy/inventory', icon: Pill, label: 'Medicine Inventory' },
    { path: '/pharmacy/billing', icon: DollarSign, label: 'Billing' },
    { path: '/pharmacy/purchases', icon: ShoppingCart, label: 'Purchases' },
    { path: '/pharmacy/profile', icon: User, label: 'Profile' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/pharmacy-login')
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">💊</span>
            {sidebarOpen && <span>Pharmacy Module</span>}
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
            <button className="notification-btn" title="Notifications">
              <Bell size={20} />
              <span className="notification-badge">0</span>
            </button>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Pharmacist'}</span>
              <span className="user-role">{user?.role || 'Pharmacist'}</span>
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

export default PharmacistLayout
