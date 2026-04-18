import React, { useState, useEffect } from 'react'
import { Calendar, Search } from 'lucide-react'
import { adminApi } from '../services/adminApi'

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await adminApi.getAppointments()
      if (response.data.success) setAppointments(response.data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: '2rem' }}><h1>Appointment Management</h1></div>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>Patient</th>
              <th style={{ padding: '1rem', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>Doctor</th>
              <th style={{ padding: '1rem', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>Time</th>
              <th style={{ padding: '1rem', textAlign: 'left', background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt._id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{apt.patient?.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>Dr. {apt.doctor?.name}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{new Date(apt.date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{apt.time}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{apt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminAppointments
