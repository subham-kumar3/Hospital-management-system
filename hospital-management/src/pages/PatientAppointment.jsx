import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, Phone, Mail, Stethoscope, Check, LogOut } from 'lucide-react'
import api from '../services/api'
import './PatientAppointment.css'

const PatientAppointment = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  })

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token')
    
    if (!token || userData.role !== 'Patient') {
      navigate('/patient-login')
    } else {
      setUser(userData)
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [doctorsRes, deptsRes, apptsRes] = await Promise.all([
        api.get('/doctors', config).catch(() => ({ data: { success: false, data: [] } })),
        api.get('/departments', config).catch(() => ({ data: { success: false, data: [] } })),
        api.get('/appointments', config).catch(() => ({ data: { success: false, data: [] } }))
      ])

      setDoctors(doctorsRes.data.success ? doctorsRes.data.data : [])
      setDepartments(deptsRes.data.success ? deptsRes.data.data : [])
      
      // Filter appointments for this patient
      const patientAppts = apptsRes.data.success 
        ? apptsRes.data.data.filter(apt => apt.patientId === user?._id || apt.patientName === user?.name)
        : []
      setAppointments(patientAppts)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const selectedDoctor = doctors.find(d => d._id === formData.doctor)
      
      const appointmentData = {
        patientId: user._id,
        patientName: user.name,
        patientPhone: user.phone || formData.phone,
        patientEmail: user.email,
        doctorId: formData.doctor,
        doctorName: selectedDoctor?.name,
        department: formData.department,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: 'Pending'
      }

      await api.post('/appointments', appointmentData, config)
      
      alert('Appointment booked successfully!')
      setShowBookingForm(false)
      setFormData({ department: '', doctor: '', date: '', time: '', reason: '' })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book appointment')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/patient-login')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="patient-appointment-page">
      <header className="patient-header">
        <div className="header-left">
          <h1>🏥 My Appointments</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </header>

      <div className="patient-content">
        {!showBookingForm ? (
          <>
            <div className="action-bar">
              <button onClick={() => setShowBookingForm(true)} className="book-btn">
                <Calendar size={20} />
                Book New Appointment
              </button>
            </div>

            <div className="appointments-section">
              <h2>Your Appointments ({appointments.length})</h2>
              
              {appointments.length === 0 ? (
                <div className="no-appointments">
                  <Calendar size={64} />
                  <h3>No appointments yet</h3>
                  <p>Book your first appointment now!</p>
                  <button onClick={() => setShowBookingForm(true)} className="book-btn">
                    Book Appointment
                  </button>
                </div>
              ) : (
                <div className="appointments-list">
                  {appointments.map((apt) => (
                    <div key={apt._id} className={`appointment-card ${apt.status?.toLowerCase()}`}>
                      <div className="apt-header">
                        <div className="apt-doctor">
                          <Stethoscope size={24} />
                          <div>
                            <h3>{apt.doctorName || apt.doctor?.name}</h3>
                            <p>{apt.department}</p>
                          </div>
                        </div>
                        <div className={`status-badge ${apt.status?.toLowerCase()}`}>
                          {apt.status}
                        </div>
                      </div>
                      
                      <div className="apt-details">
                        <div className="detail-item">
                          <Calendar size={18} />
                          <span>{new Date(apt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={18} />
                          <span>{apt.time}</span>
                        </div>
                        {apt.reason && (
                          <div className="detail-item">
                            <User size={18} />
                            <span>{apt.reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="booking-form-container">
            <div className="form-header">
              <h2>Book Appointment</h2>
              <button onClick={() => setShowBookingForm(false)} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Doctor</label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors
                    .filter(d => !formData.department || d.department === formData.department)
                    .map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Describe your symptoms or reason for visit"
                  rows="3"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowBookingForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Check size={20} />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientAppointment
