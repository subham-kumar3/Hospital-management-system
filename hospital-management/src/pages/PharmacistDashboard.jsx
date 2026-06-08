import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Pill, 
  FileText, 
  DollarSign, 
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Package
} from 'lucide-react'
import { medicineAPI, prescriptionAPI, billAPI } from '../services/pharmacyApi'
import { onDashboardUpdate } from '../services/socketService'
import './Dashboard.css'

const PharmacistDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    pendingPrescriptions: 0,
    todayRevenue: 0
  })
  const [lowStockMedicines, setLowStockMedicines] = useState([])
  const [todayPrescriptions, setTodayPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    // Setup real-time listeners
    const cleanup = onDashboardUpdate((data) => {
      console.log('🔄 Pharmacist: Real-time update:', data.data.type)
      loadDashboardData()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [medicineStats, prescriptionStats, billStats, lowStockRes, todayRx] = await Promise.all([
        medicineAPI.getStats().catch(() => ({ success: false, data: {} })),
        prescriptionAPI.getStats().catch(() => ({ success: false, data: {} })),
        billAPI.getStats().catch(() => ({ success: false, data: {} })),
        medicineAPI.getLowStockAlerts().catch(() => ({ success: false, data: [] })),
        prescriptionAPI.getToday().catch(() => ({ success: false, data: [] }))
      ])

      if (medicineStats.success) {
        setStats(prev => ({
          ...prev,
          totalMedicines: medicineStats.data.totalMedicines || 0,
          lowStock: medicineStats.data.lowStock || 0
        }))
      }

      if (prescriptionStats.success) {
        setStats(prev => ({
          ...prev,
          pendingPrescriptions: prescriptionStats.data.pendingPrescriptions || 0
        }))
      }

      if (billStats.success) {
        setStats(prev => ({
          ...prev,
          todayRevenue: billStats.data.todayRevenue || 0
        }))
      }

      if (lowStockRes.success) {
        setLowStockMedicines(lowStockRes.data || [])
      }

      if (todayRx.success) {
        setTodayPrescriptions(todayRx.data || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      icon: Pill,
      color: '#16a34a',
      bgColor: '#dcfce7'
    },
    {
      title: 'Pending Prescriptions',
      value: stats.pendingPrescriptions,
      icon: FileText,
      color: '#ea580c',
      bgColor: '#ffedd5'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: '#0891b2',
      bgColor: '#cffafe'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: '#dc2626',
      bgColor: '#fee2e2'
    }
  ]

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Pharmacy Dashboard</h1>
        <p>Welcome to Pharmacy Management System</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <AlertTriangle size={20} />
              Low Stock Medicines
            </h2>
            <button onClick={() => navigate('/pharmacy/inventory')} className="btn-link">
              View All
            </button>
          </div>
          <div className="card-content">
            {lowStockMedicines.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockMedicines.slice(0, 5).map((medicine) => (
                    <tr key={medicine._id}>
                      <td>{medicine.name}</td>
                      <td>{medicine.category}</td>
                      <td>
                        <span className="badge badge-danger">
                          {medicine.stockQuantity} units
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-sm btn-primary"
                          onClick={() => navigate('/pharmacy/purchases')}
                        >
                          Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">All medicines are well stocked</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <Clock size={20} />
              Today's Prescriptions
            </h2>
            <button onClick={() => navigate('/pharmacy/prescriptions')} className="btn-link">
              View All
            </button>
          </div>
          <div className="card-content">
            {todayPrescriptions.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayPrescriptions.slice(0, 5).map((rx) => (
                    <tr key={rx._id}>
                      <td>{rx.patient?.name || 'N/A'}</td>
                      <td>{rx.doctor?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge ${rx.status === 'Dispensed' ? 'badge-success' : 'badge-warning'}`}>
                          {rx.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-sm btn-primary"
                          onClick={() => navigate('/pharmacy/prescriptions')}
                        >
                          {rx.status === 'Dispensed' ? 'View' : 'Dispense'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No prescriptions today</p>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/pharmacy/prescriptions')}>
            <FileText size={32} />
            <span>Dispense Medicine</span>
          </button>
          <button className="action-card" onClick={() => navigate('/pharmacy/inventory')}>
            <Package size={32} />
            <span>Add Stock</span>
          </button>
          <button className="action-card" onClick={() => navigate('/pharmacy/billing')}>
            <DollarSign size={32} />
            <span>Generate Bill</span>
          </button>
          <button className="action-card" onClick={() => navigate('/pharmacy/purchases')}>
            <ShoppingCart size={32} />
            <span>New Purchase</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PharmacistDashboard
