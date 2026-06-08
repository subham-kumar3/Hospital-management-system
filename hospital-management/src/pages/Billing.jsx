import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Plus, Search, Filter, Eye, CreditCard, Trash2, X } from 'lucide-react'
import { billService, patientService } from '../services'
import './Billing.css'

const Billing = () => {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  
  // Create Bill Form State
  const [billForm, setBillForm] = useState({
    patient: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    tax: 0,
    discount: 0,
    paidAmount: 0,
    paymentMethod: 'Cash',
    notes: ''
  })
  
  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'Cash'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [billRes, patientRes] = await Promise.all([
        billService.getAllBills(),
        patientService.getAllPatients()
      ])
      if (billRes.success) setBills(billRes.data)
      if (patientRes.success) setPatients(patientRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
      bill.paymentStatus?.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  const totalAmount = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0)
  const paidAmount = bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0)
  const pendingAmount = bills.reduce((sum, bill) => sum + (bill.balance || 0), 0)

  // Calculate bill totals
  const calculateItemTotal = (item) => {
    return (item.quantity || 0) * (item.unitPrice || 0)
  }

  const calculateBillTotals = () => {
    const subtotal = billForm.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
    const tax = billForm.tax || 0
    const discount = billForm.discount || 0
    const totalAmount = subtotal + tax - discount
    const balance = totalAmount - (billForm.paidAmount || 0)
    return { subtotal, tax, discount, totalAmount, balance }
  }

  // Add new item row
  const addItemRow = () => {
    setBillForm({
      ...billForm,
      items: [...billForm.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    })
  }

  // Remove item row
  const removeItemRow = (index) => {
    const newItems = billForm.items.filter((_, i) => i !== index)
    setBillForm({ ...billForm, items: newItems })
  }

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...billForm.items]
    newItems[index] = { ...newItems[index], [field]: value }
    newItems[index].total = calculateItemTotal(newItems[index])
    setBillForm({ ...billForm, items: newItems })
  }

  // Create Bill
  const handleCreateBill = async (e) => {
    e.preventDefault()
    try {
      const { subtotal, totalAmount } = calculateBillTotals()
      
      const billData = {
        patient: billForm.patient,
        items: billForm.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: calculateItemTotal(item)
        })),
        tax: billForm.tax,
        discount: billForm.discount,
        paidAmount: billForm.paidAmount,
        paymentMethod: billForm.paymentMethod,
        notes: billForm.notes
      }

      const response = await billService.createBill(billData)
      if (response.success) {
        alert('Bill created successfully!')
        setShowCreateModal(false)
        setBillForm({
          patient: '',
          items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
          tax: 0,
          discount: 0,
          paidAmount: 0,
          paymentMethod: 'Cash',
          notes: ''
        })
        fetchData()
      }
    } catch (error) {
      alert('Error creating bill: ' + (error.response?.data?.message || error.message))
    }
  }

  // Open Payment Modal
  const openPaymentModal = (bill) => {
    setSelectedBill(bill)
    setPaymentForm({
      amount: bill.balance || 0,
      paymentMethod: 'Cash'
    })
    setShowPaymentModal(true)
  }

  // Make Payment
  const handleMakePayment = async (e) => {
    e.preventDefault()
    try {
      const response = await billService.makePayment(selectedBill._id, paymentForm)
      if (response.success) {
        alert('Payment successful!')
        setShowPaymentModal(false)
        fetchData()
      }
    } catch (error) {
      alert('Error making payment: ' + (error.response?.data?.message || error.message))
    }
  }

  // Delete Bill
  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billService.deleteBill(billId)
        alert('Bill deleted successfully!')
        fetchData()
      } catch (error) {
        alert('Error deleting bill')
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bills...</p>
      </div>
    )
  }

  const totals = calculateBillTotals()

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div>
          <h1>
            <DollarSign size={28} />
            Billing Management
          </h1>
          <p className="subtitle">Manage patient bills and payments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>New Bill</span>
        </button>
      </div>

      <div className="billing-stats">
        <div className="stat-card blue">
          <h3>₹{totalAmount.toLocaleString()}</h3>
          <p>Total Amount</p>
        </div>
        <div className="stat-card green">
          <h3>₹{paidAmount.toLocaleString()}</h3>
          <p>Paid Amount</p>
        </div>
        <div className="stat-card orange">
          <h3>₹{pendingAmount.toLocaleString()}</h3>
          <p>Pending Amount</p>
        </div>
        <div className="stat-card purple">
          <h3>{bills.length}</h3>
          <p>Total Bills</p>
        </div>
      </div>

      <div className="billing-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by bill number or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={18} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      <div className="billing-table-container">
        {filteredBills.length > 0 ? (
          <table className="billing-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Patient</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(bill => (
                <tr key={bill._id}>
                  <td className="bill-number">{bill.billNumber}</td>
                  <td className="patient-name">{bill.patient?.name || 'Unknown'}</td>
                  <td className="amount">₹{bill.totalAmount?.toLocaleString()}</td>
                  <td className="amount paid">₹{bill.paidAmount?.toLocaleString()}</td>
                  <td className="amount balance">₹{bill.balance?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${bill.paymentStatus?.toLowerCase()}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>{bill.paymentMethod || '-'}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => navigate(`/invoice/${bill._id}`)}
                        className="btn-action btn-view"
                        title="View Invoice"
                      >
                        <Eye size={18} />
                      </button>
                      {bill.paymentStatus !== 'Paid' && (
                        <button 
                          onClick={() => openPaymentModal(bill)}
                          className="btn-action btn-payment"
                          title="Make Payment"
                        >
                          <CreditCard size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteBill(bill._id)}
                        className="btn-action btn-delete"
                        title="Delete Bill"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <DollarSign size={64} />
            <h3>No bills found</h3>
            <p>{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'No bills have been created yet'}</p>
          </div>
        )}
      </div>

      {/* Create Bill Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content billing-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Bill</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateBill} className="billing-form">
              <div className="form-group">
                <label>Select Patient *</label>
                <select
                  value={billForm.patient}
                  onChange={(e) => setBillForm({ ...billForm, patient: e.target.value })}
                  required
                >
                  <option value="">Choose a patient...</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bill-items-section">
                <label>Bill Items *</label>
                {billForm.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                    <div className="item-total">₹{calculateItemTotal(item).toFixed(2)}</div>
                    {billForm.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeItemRow(index)}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addItemRow}>
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div className="bill-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (₹):</span>
                  <input
                    type="number"
                    value={billForm.tax}
                    onChange={(e) => setBillForm({ ...billForm, tax: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="total-row">
                  <span>Discount (₹):</span>
                  <input
                    type="number"
                    value={billForm.discount}
                    onChange={(e) => setBillForm({ ...billForm, discount: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="total-row grand-total">
                  <span>Total Amount:</span>
                  <span>₹{totals.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-section">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={billForm.paymentMethod}
                    onChange={(e) => setBillForm({ ...billForm, paymentMethod: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Initial Payment (₹)</label>
                  <input
                    type="number"
                    value={billForm.paidAmount}
                    onChange={(e) => setBillForm({ ...billForm, paidAmount: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={billForm.notes}
                    onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })}
                    rows="3"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Make Payment</h2>
              <button className="btn-close" onClick={() => setShowPaymentModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="payment-info">
              <p><strong>Bill Number:</strong> {selectedBill.billNumber}</p>
              <p><strong>Patient:</strong> {selectedBill.patient?.name}</p>
              <p><strong>Total Amount:</strong> ₹{selectedBill.totalAmount}</p>
              <p><strong>Paid Amount:</strong> ₹{selectedBill.paidAmount}</p>
              <p className="balance-due"><strong>Balance Due:</strong> ₹{selectedBill.balance}</p>
            </div>

            <form onSubmit={handleMakePayment} className="payment-form">
              <div className="form-group">
                <label>Payment Amount (₹) *</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                  min="0.01"
                  max={selectedBill.balance}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billing
