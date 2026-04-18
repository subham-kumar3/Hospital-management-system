import React, { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { adminApi } from '../services/adminApi'

const AdminFinancial = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await adminApi.getFinancial()
      if (response.data.success) setData(response.data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: '2rem' }}><h1>Financial Management</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{data?.stats?.totalRevenue || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
          <h3>Total Paid</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{data?.stats?.totalPaid || 0}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{data?.stats?.totalPending || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminFinancial
