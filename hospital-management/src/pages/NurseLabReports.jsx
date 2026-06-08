import React, { useState, useEffect } from 'react'
import { FileText, Eye, Filter } from 'lucide-react'
import { getNurseLabReports, getAssignedPatients } from '../services/nurseApi'
import './NurseLabReports.css'

const NurseLabReports = () => {
  const [reports, setReports] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPatient, setFilterPatient] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchReports()
    fetchPatients()
  }, [filterPatient, filterStatus, currentPage])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage, limit: 20 }
      if (filterPatient) params.patientId = filterPatient
      if (filterStatus) params.status = filterStatus

      const response = await getNurseLabReports(params)
      if (response.success) {
        setReports(response.data)
        setTotalPages(response.pages)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await getAssignedPatients()
      if (response.success) setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'completed'
      case 'Pending': return 'pending'
      case 'In Progress': return 'in-progress'
      default: return 'pending'
    }
  }

  if (loading && !reports.length) {
    return <div className="loading">Loading lab reports...</div>
  }

  return (
    <div className="nurse-lab-reports">
      <div className="page-header">
        <h1>Lab Reports</h1>
        <p>View lab reports for your assigned patients</p>
      </div>

      <div className="reports-controls">
        <div className="filter-group">
          <Filter size={20} />
          <select value={filterPatient} onChange={(e) => { setFilterPatient(e.target.value); setCurrentPage(1); }}>
            <option value="">All Patients</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} - Room {p.roomNumber || 'N/A'}</option>
            ))}
          </select>

          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="reports-list">
        {reports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test Name</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>
                    <div className="patient-name">{report.patient?.name}</div>
                    <small>Room {report.patient?.roomNumber || 'N/A'}</small>
                  </td>
                  <td>{report.test?.testName || report.testName || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn-view" onClick={() => handleViewReport(report)}>
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <FileText size={48} />
            <p>No lab reports found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      )}

      {showModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lab Report Details</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>x</button>
            </div>
            <div className="modal-body">
              <p>Report details will be displayed here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseLabReports
