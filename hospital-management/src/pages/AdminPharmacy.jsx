import React, { useState, useEffect } from 'react'
import { Search, AlertTriangle, Package, Plus } from 'lucide-react'
import { inventoryService } from '../services'
import './AdminPharmacy.css'

const AdminPharmacy = () => {
  const [medicines, setMedicines] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchMedicines()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await inventoryService.getInventoryStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      // Use medicine service or inventory service
      setMedicines([])
    } catch (error) {
      console.error('Error fetching medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={32} />
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  )

  return (
    <div className="admin-pharmacy">
      <div className="page-header">
        <h1>Pharmacy & Inventory Management</h1>
      </div>

      {stats && (
        <div className="stats-grid">
          <StatCard icon={Package} title="Total Medicines" value={stats.totalMedicines} color="primary" />
          <StatCard icon={AlertTriangle} title="Low Stock" value={stats.lowStockMedicines} color="warning" />
          <StatCard icon={AlertTriangle} title="Expiring Soon" value={stats.expiringSoon} color="danger" />
          <StatCard icon={Package} title="Total Value" value={`$${stats.totalValue.toFixed(2)}`} color="success" />
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          className={`btn-toggle ${showLowStock ? 'active' : ''}`}
          onClick={() => setShowLowStock(!showLowStock)}
        >
          Low Stock Only
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Min Level</th>
              <th>Expiry Date</th>
              <th>Supplier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="loading">Loading medicines...</td></tr>
            ) : medicines.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No medicines found</td></tr>
            ) : (
              medicines.map((med) => (
                <tr key={med._id}>
                  <td>{med.name}</td>
                  <td>{med.category}</td>
                  <td>{med.stock}</td>
                  <td>{med.minStockLevel}</td>
                  <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td>{med.supplier || '-'}</td>
                  <td>
                    {med.stock <= med.minStockLevel ? (
                      <span className="status-badge low">Low Stock</span>
                    ) : (
                      <span className="status-badge ok">In Stock</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPharmacy
