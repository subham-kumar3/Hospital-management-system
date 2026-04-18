import React, { useState, useEffect } from 'react'
import { Users, Search, User, Phone, Mail, Calendar, Activity, FileText } from 'lucide-react'
import axios from 'axios'
import './DoctorPatients.css'

const DoctorPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setDoctor(userData)
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Fetch all patients
      const response = await axios.get('http://localhost:5001/api/patients', config)
      
      if (response.data.success) {
        // In real app, filter by doctor's patients
        setPatients(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      // Fallback mock data
      setPatients([
        { 
          _id: '1', 
          name: 'John Smith', 
          age: 45, 
          gender: 'Male',
          phone: '+91 9876543210',
          email: 'john@email.com',
          bloodGroup: 'A+',
          lastVisit: new Date().toISOString()
        },
        { 
          _id: '2', 
          name: 'Sarah Johnson', 
          age: 32, 
          gender: 'Female',
          phone: '+91 9876543211',
          email: 'sarah@email.com',
          bloodGroup: 'O+',
          lastVisit: new Date(Date.now() - 86400000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading-container">Loading patients...</div>
  }

  return (
    <div className="doctor-patients-page">
      <div className="page-header">
        <h1>👥 My Patients</h1>
        <p>Manage and view all your patients</p>
      </div>

      {/* Search Bar */}
      <div className="patients-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="stats-badge">
          <Users size={20} />
          <span>{filteredPatients.length} Patients</span>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <div className="no-patients">
            <Users size={64} />
            <h3>No patients found</h3>
            <p>Start adding patients to your practice</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <div className="patient-header">
                <div className="patient-avatar">
                  <User size={32} />
                </div>
                <div className="patient-basic">
                  <h3>{patient.name}</h3>
                  <p>
                    {patient.age} years • {patient.gender}
                  </p>
                </div>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <Phone size={16} />
                  <span>{patient.phone || 'N/A'}</span>
                </div>
                
                {patient.email && (
                  <div className="detail-row">
                    <Mail size={16} />
                    <span>{patient.email}</span>
                  </div>
                )}
                
                {patient.bloodGroup && (
                  <div className="detail-row">
                    <Activity size={16} />
                    <span>Blood Group: <strong>{patient.bloodGroup}</strong></span>
                  </div>
                )}
                
                {patient.lastVisit && (
                  <div className="detail-row">
                    <Calendar size={16} />
                    <span>
                      Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="patient-actions">
                <button className="btn-view-history">
                  <FileText size={16} />
                  View History
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorPatients
