import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Clock, FileText, Users, Activity } from 'lucide-react'
import { appointmentService, patientService, doctorService } from '../services'
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
    
    // Refresh data every 30 seconds to keep it in sync with admin
    const interval = setInterval(fetchDoctorData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Get doctor ID from user data
      const doctorId = userData._id || userData.id
      
      if (!doctorId) {
        console.error('No doctor ID found in user data')
        return
      }

      // Fetch all appointments (same as admin)
      const allAppointmentsResponse = await appointmentService.getAllAppointments()
      
      if (allAppointmentsResponse.success) {
        // Filter appointments for this specific doctor
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
        
        const doctorAppointments = allAppointmentsResponse.data.filter(apt => {
          const aptDoctorId = apt.doctor?._id || apt.doctor
          return aptDoctorId === doctorId
        })
        
        // Filter today's appointments
        const todaysApts = doctorAppointments.filter(apt => {
          if (!apt.date) return false
          const aptDate = new Date(apt.date)
          return aptDate >= today && aptDate < tomorrow
        })
        
        setTodayAppointments(todaysApts)
        
        // Get all patients and filter for this doctor's patients
        const allPatientsResponse = await patientService.getAllPatients()
        
        if (allPatientsResponse.success) {
          // Count unique patients who had appointments with this doctor
          const doctorPatientIds = new Set()
          doctorAppointments.forEach(apt => {
            if (apt.patient?._id || apt.patient) {
              doctorPatientIds.add(apt.patient?._id || apt.patient)
            }
          })
          
          setStats({
            totalPatients: doctorPatientIds.size,
            todayAppointments: todaysApts.length,
            pendingReports: 0
          })
        }
      }
      
      // Fetch doctor profile
      const doctorResponse = await doctorService.getDoctor(doctorId)
      if (doctorResponse.success) {
        setDoctor(doctorResponse.data)
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error)
      
      // Fallback to local storage data if API fails
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setDoctor({
        name: userData.name,
        specialization: 'General Medicine',
        qualification: 'MD',
        experience: 5,
        email: userData.email,
        phone: '+91 9876543210',
        department: 'General Medicine',
        consultationFee: 500,
        _id: 'local-id'
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
