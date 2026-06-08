import React, { useState, useEffect } from 'react'
import { Search, FileText, User, Calendar, TestTube } from 'lucide-react'
import { labReportService } from '../services'
import { onDashboardUpdate } from '../services/socketService'
import './DoctorLabReports.css'

const DoctorLabReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    loadReports()
    
    // Setup real-time listener
    const cleanup = onDashboardUpdate((data) => {
      console.log('🔄 Doctor Lab Reports: Real-time update:', data.data.type)
      loadReports()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const response = await labReportService.getLabReports()
      if (response.success) {
        setReports(response.data)
      }
    } catch (error) {
      console.error('Error loading lab reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType ? report.testType === filterType : true
    
    return matchesSearch && matchesType
  })

  const testTypes = [...new Set(reports.map(r => r.testType))]

  if (loading) {
    return <div className="loading">Loading lab reports...</div>
  }

  return (
    <div className="doctor-lab-reports">
      <div className="page-header">
        <div>
          <h1>Lab Reports</h1>
          <p>View patient laboratory reports</p>
        </div>
      </div>

      <div className="filters">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Test Types</option>
          {testTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="reports-list">
        {filteredReports.length === 0 ? (
          <div className="no-data">
            <TestTube size={48} />
            <h3>No lab reports found</h3>
            <p>Lab reports will appear here when available</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <div className="patient-info">
                  <User size={20} />
                  <div>
                    <h3>{report.patient?.name || 'Unknown Patient'}</h3>
                    <p className="test-type">{report.testType}</p>
                  </div>
                </div>
                <span className={`status-badge ${report.status?.toLowerCase()}`}>
                  {report.status}
                </span>
              </div>
              
              <div className="report-details">
                <p><strong>Test Name:</strong> {report.testName}</p>
                <p><strong>Report ID:</strong> {report.reportId}</p>
                {report.testResults?.result && (
                  <p><strong>Result:</strong> {report.testResults.result}</p>
                )}
                {report.testResults?.values && report.testResults.values.length > 0 && (
                  <div className="test-values">
                    <h4>Test Values:</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                          <th>Normal Range</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.testResults.values.map((value, idx) => (
                          <tr key={idx}>
                            <td>{value.parameter}</td>
                            <td>{value.value}</td>
                            <td>{value.normalRange}</td>
                            <td>{value.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {report.testResults?.notes && (
                  <p><strong>Notes:</strong> {report.testResults.notes}</p>
                )}
              </div>

              <div className="report-footer">
                <div className="meta-info">
                  <Calendar size={16} />
                  <span>Reported: {new Date(report.interpretedAt || report.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="interpreted-by">
                  By: {report.interpretedBy?.name || 'Lab Technician'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorLabReports
