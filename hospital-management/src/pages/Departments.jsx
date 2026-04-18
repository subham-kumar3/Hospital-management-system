import React, { useState, useEffect } from 'react'
import { Building2, Users, Phone, Mail } from 'lucide-react'
import './Departments.css'
import api from '../services/api'

const Departments = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  // Fallback data for when backend is not available
  const fallbackData = [
    { _id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system treatment', totalDoctors: 8, totalPatients: 245, equipment: 'Advanced', floor: '3rd Floor', phone: '+1 234-567-8001', email: 'cardiology@hospital.com' },
    { _id: '2', name: 'Neurology', description: 'Brain and nervous system disorders', totalDoctors: 6, totalPatients: 189, equipment: 'Advanced', floor: '4th Floor', phone: '+1 234-567-8002', email: 'neurology@hospital.com' },
    { _id: '3', name: 'Orthopedics', description: 'Bones, joints, and muscle treatment', totalDoctors: 10, totalPatients: 312, equipment: 'Advanced', floor: '2nd Floor', phone: '+1 234-567-8003', email: 'orthopedics@hospital.com' },
    { _id: '4', name: 'Pediatrics', description: 'Child healthcare and treatment', totalDoctors: 12, totalPatients: 428, equipment: 'Advanced', floor: '1st Floor', phone: '+1 234-567-8004', email: 'pediatrics@hospital.com' },
    { _id: '5', name: 'Dermatology', description: 'Skin, hair, and nail treatment', totalDoctors: 5, totalPatients: 156, equipment: 'Modern', floor: '2nd Floor', phone: '+1 234-567-8005', email: 'dermatology@hospital.com' },
    { _id: '6', name: 'General Surgery', description: 'Surgical procedures and operations', totalDoctors: 9, totalPatients: 278, equipment: 'Advanced', floor: '5th Floor', phone: '+1 234-567-8006', email: 'surgery@hospital.com' },
    { _id: '7', name: 'Emergency', description: '24/7 emergency medical services', totalDoctors: 15, totalPatients: 520, equipment: 'Advanced', floor: 'Ground Floor', phone: '+1 234-567-8007', email: 'emergency@hospital.com' },
    { _id: '8', name: 'Radiology', description: 'Medical imaging and diagnostics', totalDoctors: 4, totalPatients: 198, equipment: 'Advanced', floor: '1st Floor', phone: '+1 234-567-8008', email: 'radiology@hospital.com' },
  ]

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/departments')
      if (response.data.success) {
        setDepartments(response.data.data)
        setUsingFallback(false)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching departments:', err)
      // Use fallback data if API fails
      setDepartments(fallbackData)
      setUsingFallback(true)
      setError('Backend server is not connected. Showing demo data. Please start MongoDB and backend server.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="departments-page">
        <div className="page-header-modern">
          <div>
            <h1>🏥 Departments</h1>
            <p className="subtitle">Loading departments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="departments-page">
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>🏥 Departments</h1>
          <p className="subtitle">Hospital departments and specialized units</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{departments.length}</h3>
            <p>Total Departments</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{departments.reduce((sum, dept) => sum + (dept.totalDoctors || 0), 0)}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{departments.reduce((sum, dept) => sum + (dept.totalPatients || 0), 0)}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card-modern stat-cancelled">
          <div className="stat-icon">🔬</div>
          <div className="stat-info">
            <h3>{departments.filter(d => d.equipment === 'Advanced').length}</h3>
            <p>Advanced Equipment</p>
          </div>
        </div>
      </div>

      {usingFallback && (
        <div className="fallback-notice">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <h3>Demo Mode - Backend Not Connected</h3>
            <p>Showing sample data. To see live data from database, please start MongoDB and backend server. <a href="#" style={{color: 'white', textDecoration: 'underline'}} onClick={(e) => { e.preventDefault(); window.open('file://' + __dirname + '/../MONGODB_FIX.md'); }}>View Setup Guide</a></p>
          </div>
        </div>
      )}

      {error && !usingFallback && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept._id} className="department-card">
            <div className="dept-icon">
              <Building2 size={32} />
            </div>
            
            <div className="dept-info">
              <h3>{dept.name}</h3>
              <p className="dept-description">{dept.description}</p>
              
              <div className="dept-stats">
                <div className="stat">
                  <Users size={18} />
                  <div>
                    <strong>{dept.totalDoctors || 0}</strong>
                    <span>Doctors</span>
                  </div>
                </div>
                <div className="stat">
                  <Users size={18} />
                  <div>
                    <strong>{dept.totalPatients || 0}</strong>
                    <span>Patients</span>
                  </div>
                </div>
              </div>

              <div className="dept-details">
                <div className="detail-item">
                  <Phone size={16} />
                  <span>Floor: {dept.floor}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>Equipment: {dept.equipment}</span>
                </div>
              </div>

              <button className="btn-view-dept" onClick={() => alert(`View details for ${dept.name}`)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Departments
