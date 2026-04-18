import React, { useState, useEffect } from 'react'
import { getAssignedPatients } from '../services/nurseApi'
import './NurseWardManagement.css'

const NurseWardManagement = () => {
  const [patients, setPatients] = useState([])
  const [filterWard, setFilterWard] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [filterWard])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const params = filterWard ? { ward: filterWard } : {}
      const response = await getAssignedPatients(params)
      if (response.success) setPatients(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const wardStats = {
    'General Ward': patients.filter(p => p.ward === 'General Ward').length,
    'ICU': patients.filter(p => p.ward === 'ICU').length,
    'Emergency': patients.filter(p => p.ward === 'Emergency').length,
    'Private Room': patients.filter(p => p.ward === 'Private Room').length
  }

  if (loading) return <div className="loading">Loading ward data...</div>

  return (
    <div className="nurse-ward">
      <div className="page-header">
        <h1>Ward & Bed Management</h1>
        <p>Monitor ward occupancy and bed allocation</p>
      </div>

      <div className="ward-stats">
        {Object.entries(wardStats).map(([ward, count]) => (
          <div key={ward} className="ward-card" onClick={() => setFilterWard(filterWard === ward ? '' : ward)}>
            <h3>{ward}</h3>
            <p className="ward-count">{count} Patients</p>
            <span className={`ward-badge ${filterWard === ward ? 'active' : ''}`}>
              {filterWard === ward ? 'Showing' : 'View'}
            </span>
          </div>
        ))}
      </div>

      <div className="bed-allocation">
        <h2>{filterWard || 'All Wards'} - Bed Allocation</h2>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Ward</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Status</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.ward || 'N/A'}</td>
                <td>{patient.roomNumber || 'N/A'}</td>
                <td>{patient.bedNumber || 'N/A'}</td>
                <td><span className={`status-badge ${patient.status?.toLowerCase()}`}>{patient.status}</span></td>
                <td>{patient.assignedDoctor?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && <div className="empty-state">No patients in {filterWard || 'selected ward'}</div>}
      </div>
    </div>
  )
}

export default NurseWardManagement
