import React, { useState, useEffect } from 'react'
import { FileText, Search, Calendar, User, Download } from 'lucide-react'
import './DoctorReports.css'

const DoctorReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      // Mock reports data (you can connect to backend later)
      setReports([
        { 
          _id: '1', 
          patientName: 'John Smith', 
          type: 'Blood Test Report', 
          date: new Date().toISOString(),
          status: 'Completed'
        },
        { 
          _id: '2', 
          patientName: 'Sarah Johnson', 
          type: 'X-Ray Report', 
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'Pending'
        }
      ])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report =>
    report.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading-container">Loading reports...</div>
  }

  return (
    <div className="doctor-reports-page">
      <div className="page-header">
        <h1>📄 Medical Reports</h1>
        <p>View and manage patient reports</p>
      </div>

      <div className="reports-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <FileText size={64} />
            <h3>No reports found</h3>
            <p>Reports will appear here as you create them</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-icon">
                <FileText size={32} />
              </div>
              <div className="report-details">
                <h3>{report.type}</h3>
                <div className="report-info">
                  <span><User size={14} /> {report.patientName}</span>
                  <span><Calendar size={14} /> {new Date(report.date).toLocaleDateString()}</span>
                </div>
                <div className={`status-badge ${report.status.toLowerCase()}`}>
                  {report.status}
                </div>
              </div>
              <button className="btn-download">
                <Download size={16} />
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorReports
