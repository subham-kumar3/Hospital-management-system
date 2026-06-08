import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Clock, FileText, Users, Activity } from 'lucide-react'
import { appointmentService, patientService, doctorService, doctorPortalService } from '../services'
import { onAppointmentUpdate, onPatientUpdate } from '../services/socketService'
import './DoctorDashboard.css'

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingReports: 0
  })

  useEffect(() => {
    fetchDoctorData()
    
    // Setup real-time listeners
    const cleanupAppointment = onAppointmentUpdate((data) => {
      console.log('🔄 Doctor: Real-time appointment update:', data.action)
      fetchDoctorData()
    })
    
    const cleanupPatient = onPatientUpdate((data) => {
      console.log('🔄 Doctor: Real-time patient update:', data.action)
      fetchDoctorData()
    })
    
    return () => {
      if (cleanupAppointment) cleanupAppointment()
      if (cleanupPatient) cleanupPatient()
    }
  }, [])

  const fetchDoctorData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')

      const [portalRes, allAppointmentsResponse, allPatientsResponse, allDoctorsResponse] = await Promise.all([
        doctorPortalService.getDashboard().catch(() => ({ success: false, data: {} })),
        appointmentService.getAllAppointments().catch(() => ({ success: false, data: [] })),
        patientService.getAllPatients().catch(() => ({ success: false, data: [] })),
        doctorService.getAllDoctors().catch(() => ({ success: false, data: [] }))
      ])

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

      if (portalRes.success) {
        setTodayAppointments(portalRes.data.appointments || [])
        setStats({
          totalPatients: portalRes.data.totalPatients || 0,
          todayAppointments: portalRes.data.todayAppointments || 0,
          pendingReports: portalRes.data.pendingLabTests || 0
        })
      } else if (allAppointmentsResponse.success) {
        const todaysApts = allAppointmentsResponse.data.filter(apt => {
          if (!apt.date) return false
          const aptDate = new Date(apt.date)
          return aptDate >= today && aptDate < tomorrow
        })

        setTodayAppointments(todaysApts)
        setStats({
          totalPatients: allPatientsResponse.success ? allPatientsResponse.data.length : 0,
          todayAppointments: todaysApts.length,
          pendingReports: allAppointmentsResponse.data.filter(apt =>
            apt.status === 'Pending' || apt.status === 'Confirmed'
          ).length
        })
      }

      // Match doctor profile by email from doctors list
      let doctorProfile = null
      if (allDoctorsResponse.success) {
        doctorProfile = allDoctorsResponse.data.find(
          d => d.email?.toLowerCase() === userData.email?.toLowerCase()
        )
      }

      setDoctor(doctorProfile || {
        name: userData.name,
        specialization: userData.specialization || 'General Medicine',
        qualification: 'MD',
        experience: 5,
        email: userData.email,
        phone: userData.phone || '',
        department: userData.department || 'General Medicine',
        consultationFee: 500
      })
    } catch (error) {
      console.error('Error fetching doctor data:', error)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setDoctor({
        name: userData.name,
        specialization: 'General Medicine',
        qualification: 'MD',
        experience: 5,
        email: userData.email,
        phone: '',
        department: 'General Medicine',
        consultationFee: 500
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="doctor-dashboard-content">
      <div className="page-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome back, Dr. {doctor?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon patients">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon appointments">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reports">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingReports}</h3>
            <p>Pending Reports</p>
          </div>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <div className="profile-section">
        <h2>Your Profile</h2>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <div>
              <h3>Dr. {doctor?.name || 'Loading...'}</h3>
              <p>{doctor?.specialization || doctor?.department || 'General Physician'}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-row">
              <Mail size={16} />
              <span>{doctor?.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <Phone size={16} />
              <span>{doctor?.phone || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <Activity size={16} />
              <span>{doctor?.experience ? `${doctor.experience} years` : 'N/A'} experience</span>
            </div>
            <div className="detail-row">
              <FileText size={16} />
              <span>{doctor?.qualification || 'MBBS'}</span>
            </div>
            {doctor?.consultationFee && (
              <div className="detail-row">
                <Users size={16} />
                <span>₹{doctor.consultationFee} consultation fee</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="appointments-section">
        <h2>Today's Appointments ({stats.todayAppointments})</h2>
        {todayAppointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar size={48} />
            <h3>No appointments scheduled for today</h3>
            <p>Enjoy your free time or check your schedule for upcoming days</p>
          </div>
        ) : (
          <div className="appointments-list">
            {todayAppointments.map((apt) => (
              <div key={apt._id || apt.id} className="appointment-card">
                <div className="apt-time">
                  <Clock size={20} />
                  <span>{apt.time || '09:00 AM'}</span>
                </div>
                <div className="apt-details">
                  <h4>{apt.patient?.name || apt.patientName || 'Patient'}</h4>
                  <p>{apt.type || 'Consultation'}</p>
                  <small>{apt.notes || apt.symptoms || 'Regular checkup'}</small>
                </div>
                <div className={`apt-status ${(apt.status || 'pending').toLowerCase()}`}>
                  {apt.status || 'Scheduled'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard
