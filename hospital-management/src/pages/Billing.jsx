import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign } from 'lucide-react'
import { billService, patientService } from '../services'

const Billing = () => {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <DollarSign size={32} /> Billing
      </h1>

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Bill Number</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Paid</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Balance</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{bill.billNumber}</td>
                  <td style={{ padding: '12px' }}>{bill.patient?.name}</td>
                  <td style={{ padding: '12px' }}>₹{bill.totalAmount}</td>
                  <td style={{ padding: '12px' }}>₹{bill.paidAmount}</td>
                  <td style={{ padding: '12px' }}>₹{bill.balance}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', background: bill.paymentStatus === 'Paid' ? '#d4edda' : bill.paymentStatus === 'Partial' ? '#fff3cd' : '#f8d7da', color: bill.paymentStatus === 'Paid' ? '#155724' : bill.paymentStatus === 'Partial' ? '#856404' : '#721c24' }}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => navigate(`/invoice/${bill._id}`)} style={{ padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Billing
