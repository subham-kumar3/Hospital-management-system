import React, { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Calendar } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import './PatientBilling.css'

const PatientBilling = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await patientApi.getBills()
      if (response.data.success) {
        setBills(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading bills...</div>

  return (
    <div className="patient-billing">
      <div className="page-header">
        <h1>Billing & Payments</h1>
      </div>

      {bills.length === 0 ? (
        <div className="empty-state">
          <CreditCard size={64} />
          <h3>No bills found</h3>
          <p>Your billing history will appear here</p>
        </div>
      ) : (
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>₹{bill.totalAmount}</td>
                  <td>₹{bill.paidAmount}</td>
                  <td>₹{bill.balance}</td>
                  <td>
                    <span className={`status-badge ${bill.paymentStatus.toLowerCase()}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PatientBilling
