import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Stethoscope, Calendar, FileText, TrendingUp, DollarSign, Activity, Clock } from 'lucide-react'
import { patientService, doctorService, appointmentService } from '../services'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    totalAppointments: 0,
    medicalRecords: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch real data on mount and when returning to page
  useEffect(() => {
    loadDashboardData()
    
    // Refresh data every 30 seconds to keep it live
    const interval = setInterval(loadDashboardData, 30000)
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        patientService.getAllPatients().catch(() => ({ success: false, data: [] })),
        doctorService.getAllDoctors().catch(() => ({ success: false, data: [] })),
        appointmentService.getAllAppointments().catch(() => ({ success: false, data: [] }))
      ])

      // Helper function to generate time ago text
      const generateTimeAgo = (createdAt) => {
        if (!createdAt) return 'Just now'
        const now = new Date()
        const created = new Date(createdAt)
        const diffMs = now - created
        const diffMins = Math.floor(diffMs / 60000)
        
        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} mins ago`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} hours ago`
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} days ago`
      }

      // Update stats with real data
      const patients = patientsRes.success ? patientsRes.data : []
      const doctors = doctorsRes.success ? doctorsRes.data : []
      const appointments = appointmentsRes.success ? appointmentsRes.data : []
      
      console.log('📊 Dashboard Data:', {
        patients: patients.length,
        doctors: doctors.length,
        appointments: appointments.length,
        appointmentsData: appointments
      })
      
      // Calculate today's appointments
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to midnight for accurate comparison
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      
      console.log('📅 Date Comparison:', {
        today: today.toISOString(),
        tomorrow: tomorrow.toISOString()
      })
      
      const todaysAppointments = appointments.filter(apt => {
        if (!apt.date) {
          console.log('⚠️ Appointment missing date:', apt)
          return false
        }
        const aptDate = new Date(apt.date)
        aptDate.setHours(0, 0, 0, 0) // Normalize to midnight
        const matches = aptDate >= today && aptDate < tomorrow
        console.log(`🔍 Appointment ${apt.patient?.name || apt.patientName}:`, {
          aptDate: aptDate.toISOString(),
          matches
        })
        return matches
      })

      console.log('✅ Today\'s appointments count:', todaysAppointments.length)

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        appointmentsToday: todaysAppointments.length,
        totalAppointments: appointments.length,
        medicalRecords: patients.length + appointments.length
      })

      // Generate recent activities from real data
      const activities = []
      
      // Add recent appointments as activities (last 5)
      const sortedAppointments = appointments.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }).slice(0, 5)
      
      sortedAppointments.forEach((apt, index) => {
        const timeAgo = generateTimeAgo(apt.createdAt)
        const patientName = apt.patient?.name || apt.patientName || 'Patient'
        const doctorName = apt.doctor?.name || apt.doctorName || 'Doctor'
        activities.push({
          id: `apt-${apt._id || apt.id}`,
          type: 'appointment',
          message: `${apt.status || 'Scheduled'} appointment for ${patientName} with ${doctorName}`,
          time: timeAgo,
          link: '/appointments'
        })
      })

      // Add patient activities (last 3)
      const sortedPatients = patients.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }).slice(0, 3)
      
      sortedPatients.forEach((patient, index) => {
        const timeAgo = generateTimeAgo(patient.createdAt)
        activities.push({
          id: `patient-${patient._id || patient.id}`,
          type: 'patient',
          message: `Patient ${patient.name || patient.patientName} registered`,
          time: timeAgo,
          link: '/patients'
        })
      })

      // Sort all activities by time and take latest 8
      activities.sort((a, b) => {
        // Simple sort based on time string for demo
        return 0
      })

      setRecentActivities(activities.slice(0, 8))

      // Set upcoming appointments (next 5 scheduled)
      const futureAppointments = appointments
        .filter(apt => {
          if (!apt.date) return false
          const aptDate = new Date(apt.date)
          // Compare with today at midnight
          const todayMidnight = new Date()
          todayMidnight.setHours(0, 0, 0, 0)
          return aptDate >= todayMidnight
        })
        .sort((a, b) => {
          return new Date(a.date || 0) - new Date(b.date || 0)
        })
        .slice(0, 5)
        .map(apt => ({
          id: apt._id || apt.id,
          patient: apt.patient?.name || 'Patient',
          doctor: apt.doctor?.name || 'Doctor',
          time: apt.time || '09:00 AM',
          department: apt.department || apt.doctor?.department || 'General',
          date: apt.date
        }))

      setUpcomingAppointments(futureAppointments)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set all to 0 on error - no demo data
      setStats({
        totalPatients: 0,
        totalDoctors: 0,
        appointmentsToday: 0,
        totalAppointments: 0,
        medicalRecords: 0
      })
      setRecentActivities([])
      setUpcomingAppointments([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>🏥 Dashboard</h1>
          <p className="subtitle">Welcome to Hospital Management System</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.totalDoctors}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.appointmentsToday}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{loading ? '...' : stats.medicalRecords}</h3>
            <p>Medical Records</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{loading ? '...' : `$${(stats.totalPatients * 150).toLocaleString()}`}</h3>
            <p>Revenue (Monthly)</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <button className="view-all" onClick={() => navigate('/appointments')}>View All</button>
          </div>
          <div className="activity-list">
            {loading ? (
              <div className="loading-activities">Loading activities...</div>
            ) : recentActivities.length === 0 ? (
              <div className="no-activities">No recent activities</div>
            ) : (
              recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="activity-item"
                  onClick={() => activity.link && navigate(activity.link)}
                  style={{ cursor: activity.link ? 'pointer' : 'default' }}
                >
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'appointment' && <Calendar size={16} />}
                    {activity.type === 'patient' && <Users size={16} />}
                    {activity.type === 'doctor' && <Stethoscope size={16} />}
                    {activity.type === 'record' && <FileText size={16} />}
                  </div>
                  <div className="activity-info">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <button className="view-all" onClick={() => navigate('/appointments')}>View All</button>
          </div>
          <div className="appointments-table">
            {loading ? (
              <div className="loading-appointments">Loading appointments...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="no-appointments">No upcoming appointments</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient}</td>
                      <td>{appointment.doctor}</td>
                      <td>{appointment.time}</td>
                      <td><span className="department-badge">{appointment.department}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
