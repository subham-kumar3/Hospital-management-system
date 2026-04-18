import React, { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { adminApi } from '../services/adminApi'

const AdminReports = () => {
  const [reportType, setReportType] = useState('patients')
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [reportType])

  const fetchReport = async () => {
    try {
      const response = await adminApi.getReports(reportType)
      if (response.data.success) setReportData(response.data.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: '2rem' }}><h1>Reports & Analytics</h1></div>
      <div style={{ marginBottom: '2rem' }}>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ padding: '0.75rem', borderRadius: '0.5rem' }}>
          <option value="patients">Patient Report</option>
          <option value="appointments">Appointment Report</option>
          <option value="doctors">Doctor Report</option>
        </select>
      </div>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem' }}>
        <pre>{JSON.stringify(reportData, null, 2)}</pre>
      </div>
    </div>
  )
}

export default AdminReports
