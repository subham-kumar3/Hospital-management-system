import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle, Package } from 'lucide-react'
import { medicineAPI } from '../services/pharmacyApi'
import './Appointments.css'

const MedicineInventory = () => {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Tablet',
    manufacturer: '',
    batchNumber: '',
    price: '',
    stockQuantity: '',
    lowStockThreshold: '10',
    expiryDate: '',
    description: '',
    requiresPrescription: true
  })
  const [stockData, setStockData] = useState({ quantity: '', operation: 'add' })

  useEffect(() => {
    loadMedicines()
  }, [categoryFilter])

  const loadMedicines = async () => {
    try {
      setLoading(true)
      const response = await medicineAPI.getAll({ category: categoryFilter })
      if (response.success) {
        setMedicines(response.data)
      }
    } catch (error) {
      console.error('Error loading medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    try {
      const response = await medicineAPI.create(formData)
      if (response.success) {
        alert('Medicine added successfully!')
        setShowAddModal(false)
        resetForm()
        loadMedicines()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding medicine')
    }
  }

  const handleUpdateStock = async (e) => {
    e.preventDefault()
    try {
      const response = await medicineAPI.updateStock(selectedMedicine._id, stockData)
      if (response.success) {
        alert('Stock updated successfully!')
        setShowStockModal(false)
        setStockData({ quantity: '', operation: 'add' })
        loadMedicines()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating stock')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      category: 'Tablet',
      manufacturer: '',
      batchNumber: '',
      price: '',
      stockQuantity: '',
      lowStockThreshold: '10',
      expiryDate: '',
      description: '',
      requiresPrescription: true
    })
  }

  const openStockModal = (medicine) => {
    setSelectedMedicine(medicine)
    setShowStockModal(true)
  }

  const filteredMedicines = medicines.filter(med => 
    search === '' || 
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loading">Loading medicines...</div>

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Medicine Inventory</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      <div className="filters-bar">
        <form onSubmit={(e) => e.preventDefault()} className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="filter-group">
          <Package size={18} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Injection">Injection</option>
            <option value="Ointment">Ointment</option>
            <option value="Drops">Drops</option>
            <option value="Powder">Powder</option>
            <option value="Inhaler">Inhaler</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Batch No.</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((med) => {
                const isLowStock = med.stockQuantity <= med.lowStockThreshold
                const isExpired = new Date(med.expiryDate) < new Date()
                
                return (
                  <tr key={med._id}>
                    <td>
                      <div>
                        <strong>{med.name}</strong>
                        {med.genericName && (
                          <div className="text-muted" style={{ fontSize: '12px' }}>
                            {med.genericName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{med.category}</td>
                    <td>{med.manufacturer}</td>
                    <td>{med.batchNumber}</td>
                    <td>₹{med.price}</td>
                    <td>
                      <span className={isLowStock ? 'badge badge-danger' : 'badge badge-success'}>
                        {med.stockQuantity}
                      </span>
                    </td>
                    <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                    <td>
                      {isExpired ? (
                        <span className="badge badge-danger">Expired</span>
                      ) : med.status === 'Out of Stock' ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-icon btn-primary"
                        onClick={() => openStockModal(med)}
                        title="Update Stock"
                      >
                        <Package size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="9" className="empty-state">No medicines found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Medicine</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddMedicine}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Medicine Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Generic Name</label>
                    <input
                      type="text"
                      name="genericName"
                      value={formData.genericName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Drops">Drops</option>
                      <option value="Powder">Powder</option>
                      <option value="Inhaler">Inhaler</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Manufacturer *</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Batch Number *</label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showStockModal && selectedMedicine && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Stock - {selectedMedicine.name}</h2>
              <button className="btn-close" onClick={() => setShowStockModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="info-box">
                <p><strong>Current Stock:</strong> {selectedMedicine.stockQuantity} units</p>
              </div>
              <form onSubmit={handleUpdateStock}>
                <div className="form-group">
                  <label>Operation</label>
                  <select
                    value={stockData.operation}
                    onChange={(e) => setStockData(prev => ({ ...prev, operation: e.target.value }))}
                  >
                    <option value="add">Add Stock</option>
                    <option value="subtract">Remove Stock</option>
                    <option value="set">Set Absolute Quantity</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={stockData.quantity}
                    onChange={(e) => setStockData(prev => ({ ...prev, quantity: e.target.value }))}
                    min="0"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicineInventory
