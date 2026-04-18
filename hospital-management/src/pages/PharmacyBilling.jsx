import React, { useState, useEffect } from 'react'
import { Search, Plus, Eye, DollarSign } from 'lucide-react'
import { billAPI } from '../services/pharmacyApi'
import './Appointments.css'

const PharmacyBilling = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedBill, setSelectedBill] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({ amount: '', method: 'Cash' })

  useEffect(() => {
    loadBills()
  }, [statusFilter])

  const loadBills = async () => {
    try {
      setLoading(true)
      const response = await billAPI.getAll({ status: statusFilter })
      if (response.success) {
        setBills(response.data)
      }
    } catch (error) {
      console.error('Error loading bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewBill = async (id) => {
    try {
      const response = await billAPI.getById(id)
      if (response.success) {
        setSelectedBill(response.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error loading bill:', error)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    try {
      const response = await billAPI.updatePayment(selectedBill._id, {
        paidAmount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.method
      })
      if (response.success) {
        alert('Payment recorded successfully!')
        setPaymentModal(false)
        setPaymentData({ amount: '', method: 'Cash' })
        loadBills()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error recording payment')
    }
  }

  const openPaymentModal = (bill) => {
    setSelectedBill(bill)
    setPaymentData({ 
      amount: (bill.totalAmount - (bill.paidAmount || 0)).toFixed(2), 
      method: 'Cash' 
    })
    setPaymentModal(true)
  }

  const handlePrint = (bill) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${bill.billNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 Hospital Pharmacy</h1>
            <h2>Invoice</h2>
            <p>Bill No: ${bill.billNumber}</p>
          </div>
          <div class="info">
            <p><strong>Patient:</strong> ${bill.patient?.name}</p>
            <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${bill.paymentStatus}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items?.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unitPrice}</td>
                  <td>₹${item.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: ₹${bill.subtotal}</p>
            <p>Tax: ₹${bill.tax}</p>
            <p>Discount: ₹${bill.discount}</p>
            <p>Total: ₹${bill.totalAmount}</p>
            <p>Paid: ₹${bill.paidAmount}</p>
            <p>Balance: ₹${bill.balance}</p>
          </div>
          <div class="footer">
            <p>Thank you! Get well soon.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) return <div className="loading">Loading bills...</div>

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Pharmacy Billing</h1>
        <p>Manage pharmacy bills and payments</p>
      </div>

      <div className="filters-bar">
        <form onSubmit={(e) => e.preventDefault()} className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by patient or bill number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="filter-group">
          <DollarSign size={18} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill No.</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>{bill.patient?.name || 'N/A'}</td>
                  <td>₹{bill.totalAmount}</td>
                  <td>₹{bill.paidAmount || 0}</td>
                  <td>₹{bill.balance || bill.totalAmount}</td>
                  <td>
                    <span className={`badge ${
                      bill.paymentStatus === 'Paid' ? 'badge-success' :
                      bill.paymentStatus === 'Partial' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-primary"
                      onClick={() => handleViewBill(bill._id)}
                      title="View Bill"
                    >
                      <Eye size={16} />
                    </button>
                    {bill.paymentStatus !== 'Paid' && (
                      <button 
                        className="btn-icon btn-success"
                        onClick={() => openPaymentModal(bill)}
                        title="Record Payment"
                      >
                        <DollarSign size={16} />
                      </button>
                    )}
                    <button 
                      className="btn-icon"
                      onClick={() => handlePrint(bill)}
                      title="Print Invoice"
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">No bills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Bill Modal */}
      {showModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bill Details - {selectedBill.billNumber}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Patient</label>
                  <p>{selectedBill.patient?.name}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{new Date(selectedBill.createdAt).toLocaleString()}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Status</label>
                  <p><span className="badge">{selectedBill.paymentStatus}</span></p>
                </div>
                <div className="detail-item">
                  <label>Payment Method</label>
                  <p>{selectedBill.paymentMethod || 'N/A'}</p>
                </div>
              </div>

              <h3>Items</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.unitPrice}</td>
                      <td>₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bill-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{selectedBill.tax}</span>
                </div>
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>₹{selectedBill.discount}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{selectedBill.totalAmount}</span>
                </div>
                <div className="summary-row">
                  <span>Paid:</span>
                  <span>₹{selectedBill.paidAmount || 0}</span>
                </div>
                <div className="summary-row balance">
                  <span>Balance:</span>
                  <span>₹{selectedBill.balance || selectedBill.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && selectedBill && (
        <div className="modal-overlay" onClick={() => setPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Payment</h2>
              <button className="btn-close" onClick={() => setPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="info-box">
                <p><strong>Balance Amount:</strong> ₹{selectedBill.balance || selectedBill.totalAmount}</p>
              </div>
              <form onSubmit={handlePayment}>
                <div className="form-group">
                  <label>Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Record Payment
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

export default PharmacyBilling
