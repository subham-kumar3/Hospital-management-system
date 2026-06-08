import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ClipboardList, DollarSign, Activity, Clock, User } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import { onAppointmentUpdate } from '../services/socketService'
import './PatientDashboard.css'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    // Setup real-time listeners
    const cleanup = onAppointmentUpdate((data) => {
      console.log('🔄 Patient: Real-time appointment update:', data.action)
      fetchDashboardData()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await patientApi.getDashboard()
      if (response.data.success) {
        setDashboardData(response.data.data)
      } else {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setDashboardData({
          patient: { name: userData.name, email: userData.email },
          stats: {
            upcomingAppointments: 0,
            activePrescriptions: 0,
            pendingBills: 0,
            totalVisits: 0
          },
          upcomingAppointments: [],
          recentPrescriptions: []
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setDashboardData({
        patient: { name: userData.name, email: userData.email },
        stats: {
          upcomingAppointments: 0,
          activePrescriptions: 0,
          pendingBills: 0,
          totalVisits: 0
        },
        upcomingAppointments: [],
        recentPrescriptions: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (!dashboardData) {
    return <div className="error">Failed to load dashboard. Please try refreshing.</div>
  }

  const { stats, upcomingAppointments, recentPrescriptions, patient } = dashboardData

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {patient?.name || 'Patient'}!</h1>
        <p>Here's an overview of your health information</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card appointments">
          <div className="stat-icon">
            <Calendar size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card prescriptions">
          <div className="stat-icon">
            <ClipboardList size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.activePrescriptions}</h3>
            <p>Active Prescriptions</p>
          </div>
        </div>

        <div className="stat-card bills">
          <div className="stat-icon">
            <DollarSign size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBills}</h3>
            <p>Pending Bills</p>
          </div>
        </div>

        <div className="stat-card visits">
          <div className="stat-icon">
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalVisits}</h3>
            <p>Total Visits</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/patient/appointments')}>
            <Calendar size={24} />
            <span>Book Appointment</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/patient/medical-records')}>
            <Activity size={24} />
            <span>View Reports</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/patient/support')}>
            <User size={24} />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <button className="view-all-btn" onClick={() => navigate('/patient/appointments')}>
            View All
          </button>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No upcoming appointments</p>
            <button className="book-btn" onClick={() => navigate('/patient/appointments')}>
              Book Now
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {upcomingAppointments.map((apt) => (
              <div key={apt._id} className="appointment-card">
                <div className="apt-header">
                  <div className="apt-doctor">
                    <User size={20} />
                    <div>
                      <h4>Dr. {apt.doctor?.name}</h4>
                      <p>{apt.doctor?.specialization} - {apt.doctor?.department}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="apt-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{new Date(apt.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{apt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Prescriptions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Prescriptions</h2>
          <button className="view-all-btn" onClick={() => navigate('/patient/prescriptions')}>
            View All
          </button>
        </div>

        {recentPrescriptions.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={48} />
            <p>No prescriptions yet</p>
          </div>
        ) : (
          <div className="prescriptions-list">
            {recentPrescriptions.map((prescription) => (
              <div key={prescription._id} className="prescription-card">
                <div className="rx-header">
                  <div className="rx-doctor">
                    <User size={20} />
                    <div>
                      <h4>Dr. {prescription.doctor?.name}</h4>
                      <p>{prescription.doctor?.specialization}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${prescription.status.toLowerCase()}`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="rx-details">
                  <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                  <p><strong>Medicines:</strong> {prescription.medicines?.length || 0} prescribed</p>
                  <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDashboard
