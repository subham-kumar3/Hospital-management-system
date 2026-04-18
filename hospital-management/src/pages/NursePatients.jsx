import React, { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { getAssignedPatients } from '../services/nurseApi'
import './NursePatients.css'

const NursePatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWard, setFilterWard] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [filterWard, filterStatus])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterWard) params.ward = filterWard
      if (filterStatus) params.status = filterStatus
      if (searchTerm) params.search = searchTerm
      
      const response = await getAssignedPatients(params)
      if (response.success) {
        setPatients(response.data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPatients()
  }

  if (loading) {
    return <div className="loading">Loading patients...</div>
  }

  return (
    <div className="nurse-patients">
      <div className="page-header">
        <h1>My Patients</h1>
        <p>View and manage your assigned patients</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select value={filterWard} onChange={(e) => setFilterWard(e.target.value)}>
            <option value="">All Wards</option>
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Emergency">Emergency</option>
            <option value="Private Room">Private Room</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Admitted">Admitted</option>
            <option value="Stable">Stable</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="patients-grid">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <div className="patient-header">
                <h3>{patient.name}</h3>
                <span className={`status-badge ${patient.status.toLowerCase()}`}>
                  {patient.status}
                </span>
              </div>
              <div className="patient-details">
                <p><strong>Age:</strong> {patient.age} years</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                <p><strong>Room:</strong> {patient.roomNumber || 'N/A'}</p>
                <p><strong>Bed:</strong> {patient.bedNumber || 'N/A'}</p>
                <p><strong>Ward:</strong> {patient.ward || 'N/A'}</p>
                <p><strong>Doctor:</strong> {patient.assignedDoctor?.name || 'Not Assigned'}</p>
                <p><strong>Phone:</strong> {patient.phone}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No patients found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NursePatients
