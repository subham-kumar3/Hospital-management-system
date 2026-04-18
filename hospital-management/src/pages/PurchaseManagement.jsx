import React, { useState, useEffect } from 'react'
import { Search, Plus, Eye, Truck } from 'lucide-react'
import { purchaseAPI, medicineAPI } from '../services/pharmacyApi'
import './Appointments.css'

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [formData, setFormData] = useState({
    supplier: { name: '', contact: '', email: '', address: '' },
    items: [],
    tax: 0,
    expectedDeliveryDate: '',
    notes: ''
  })

  useEffect(() => {
    loadPurchases()
    loadMedicines()
  }, [deliveryFilter])

  const loadPurchases = async () => {
    try {
      setLoading(true)
      const response = await purchaseAPI.getAll({ deliveryStatus: deliveryFilter })
      if (response.success) {
        setPurchases(response.data)
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMedicines = async () => {
    try {
      const response = await medicineAPI.getAll()
      if (response.success) {
        setMedicines(response.data)
      }
    } catch (error) {
      console.error('Error loading medicines:', error)
    }
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { medicine: '', quantity: 0, unitPrice: 0, batchNumber: '', expiryDate: '' }]
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    
    // Auto-calculate total
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await purchaseAPI.create(formData)
      if (response.success) {
        alert('Purchase order created successfully!')
        setShowModal(false)
        resetForm()
        loadPurchases()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating purchase')
    }
  }

  const handleUpdateDelivery = async (id, status) => {
    try {
      const response = await purchaseAPI.updateDelivery(id, { 
        deliveryStatus: status,
        deliveryDate: status === 'Delivered' ? new Date() : undefined
      })
      if (response.success) {
        alert('Delivery status updated successfully!')
        loadPurchases()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating delivery')
    }
  }

  const resetForm = () => {
    setFormData({
      supplier: { name: '', contact: '', email: '', address: '' },
      items: [],
      tax: 0,
      expectedDeliveryDate: '',
      notes: ''
    })
  }

  if (loading) return <div className="loading">Loading purchases...</div>

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Purchase Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Purchase Order
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <Truck size={18} />
          <select 
            value={deliveryFilter} 
            onChange={(e) => setDeliveryFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Ordered">Ordered</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Purchase No.</th>
              <th>Order Date</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Delivery Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{purchase.purchaseNumber}</td>
                  <td>{new Date(purchase.orderDate).toLocaleDateString()}</td>
                  <td>{purchase.supplier.name}</td>
                  <td>{purchase.items.length} items</td>
                  <td>₹{purchase.totalAmount}</td>
                  <td>
                    <span className={`badge ${
                      purchase.deliveryStatus === 'Delivered' ? 'badge-success' :
                      purchase.deliveryStatus === 'Shipped' ? 'badge-info' :
                      purchase.deliveryStatus === 'Ordered' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {purchase.deliveryStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      purchase.paymentStatus === 'Paid' ? 'badge-success' :
                      purchase.paymentStatus === 'Partial' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {purchase.paymentStatus}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-primary"
                      onClick={() => { setSelectedPurchase(purchase); setViewModal(true); }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {purchase.deliveryStatus !== 'Delivered' && (
                      <select
                        value={purchase.deliveryStatus}
                        onChange={(e) => handleUpdateDelivery(purchase._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">No purchases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Purchase Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Purchase Order</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <h3>Supplier Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Supplier Name *</label>
                    <input
                      type="text"
                      value={formData.supplier.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        supplier: { ...prev.supplier, name: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact *</label>
                    <input
                      type="text"
                      value={formData.supplier.contact}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        supplier: { ...prev.supplier, contact: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.supplier.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        supplier: { ...prev.supplier, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected Delivery</label>
                    <input
                      type="date"
                      value={formData.expectedDeliveryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    />
                  </div>
                </div>

                <h3>Items</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="form-grid" style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5' }}>
                    <div className="form-group">
                      <label>Medicine</label>
                      <select
                        value={item.medicine}
                        onChange={(e) => handleItemChange(index, 'medicine', e.target.value)}
                        required
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map(med => (
                          <option key={med._id} value={med._id}>{med.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Batch No.</label>
                      <input
                        type="text"
                        value={item.batchNumber}
                        onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={handleAddItem} style={{ marginBottom: '20px' }}>
                  <Plus size={16} /> Add Item
                </button>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Purchase Order
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

export default PurchaseManagement
