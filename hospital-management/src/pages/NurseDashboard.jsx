import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Activity, Pill, AlertCircle, BedDouble, ClipboardList } from 'lucide-react'
import { getNurseDashboard } from '../services/nurseApi'
import { onAppointmentUpdate, onPatientUpdate } from '../services/socketService'
import './NurseDashboard.css'

const NurseDashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    // Setup real-time listeners
    const cleanupAppointment = onAppointmentUpdate((data) => {
      console.log('🔄 Nurse: Real-time appointment update:', data.action)
      fetchDashboardData()
    })
    
    const cleanupPatient = onPatientUpdate((data) => {
      console.log('🔄 Nurse: Real-time patient update:', data.action)
      fetchDashboardData()
    })
    
    return () => {
      if (cleanupAppointment) cleanupAppointment()
      if (cleanupPatient) cleanupPatient()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await getNurseDashboard()
      if (response.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h1>Nurse Dashboard</h1>
        <p>Welcome to your nursing workspace</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.totalPatients || 0}</h3>
            <p>Assigned Patients</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <BedDouble size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.patientsInWard || 0}</h3>
            <p>Patients in Ward</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <AlertCircle size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.criticalPatients || 0}</h3>
            <p>Critical Patients</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <ClipboardList size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.pendingTasks || 0}</h3>
            <p>Tasks Pending</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.vitalsRecordedToday || 0}</h3>
            <p>Vitals Recorded Today</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <AlertCircle size={32} />
          </div>
          <div className="stat-info">
            <h3>{dashboardData?.emergencyNotifications || 0}</h3>
            <p>Emergency Alerts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/nurse-vitals')}>
            <Activity size={24} />
            <span>Record Vitals</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/nurse-medications')}>
            <Pill size={24} />
            <span>View Medications</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/nurse-patients')}>
            <Users size={24} />
            <span>View Patients</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/nurse-notes')}>
            <span style={{ fontSize: '24px' }}>📝</span>
            <span>Add Notes</span>
          </button>
        </div>
      </div>

      {/* Today's Patients */}
      <div className="patients-section">
        <h2>Today's Assigned Patients</h2>
        {dashboardData?.patients && dashboardData.patients.length > 0 ? (
          <div className="patients-table">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age/Gender</th>
                  <th>Room/Bed</th>
                  <th>Ward</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.patients.slice(0, 10).map((patient) => (
                  <tr 
                    key={patient._id} 
                    className="patient-row"
                    onClick={() => navigate('/nurse-patients')}
                  >
                    <td>{patient.name}</td>
                    <td>{patient.age}/{patient.gender}</td>
                    <td>{patient.roomNumber || 'N/A'} / {patient.bedNumber || 'N/A'}</td>
                    <td>{patient.ward || 'N/A'}</td>
                    <td>{patient.assignedDoctor?.name || 'Not Assigned'}</td>
                    <td>
                      <span className={`status-badge ${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No patients assigned yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NurseDashboard
