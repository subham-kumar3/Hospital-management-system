import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Mail, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { appointmentService } from '../services'
import { onAppointmentUpdate } from '../services/socketService'
import './DoctorAppointments.css'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, today, upcoming, completed
  const [searchTerm, setSearchTerm] = useState('')
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setDoctor(userData)
    fetchAppointments()
    
    // Setup real-time listener for appointments
    const cleanup = onAppointmentUpdate((data) => {
      console.log('🔄 Doctor Appointments: Real-time update:', data.action)
      fetchAppointments()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const fetchAppointments = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const doctorId = userData._id || userData.id

      // Fetch all appointments (same as admin)
      const response = await appointmentService.getAllAppointments()
      
      if (response.success) {
        // Filter appointments for this doctor only
        const doctorAppointments = response.data.filter(apt => {
          const aptDoctorId = apt.doctor?._id || apt.doctor
          return aptDoctorId === doctorId
        })
        setAppointments(doctorAppointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update appointment using service (same as admin)
      const response = await appointmentService.updateAppointment(id, { status: newStatus })
      
      if (response.success) {
        // Update local state
        setAppointments(appointments.map(apt => 
          apt._id === id ? { ...apt, status: newStatus } : apt
        ))
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    // Filter by search term
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by status
    let matchesFilter = true
    const aptDate = new Date(apt.appointmentTime)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (filter === 'today') {
      matchesFilter = aptDate.toDateString() === today.toDateString()
    } else if (filter === 'upcoming') {
      matchesFilter = aptDate > today
    } else if (filter === 'completed') {
      matchesFilter = apt.status === 'Completed'
    }
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <div className="loading-container">Loading appointments...</div>
  }

  return (
    <div className="doctor-appointments-page">
      <div className="page-header">
        <h1>📅 Appointments</h1>
        <p>Manage your scheduled appointments</p>
      </div>

      {/* Search and Filter */}
      <div className="appointments-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'today' ? 'active' : ''}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button 
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-list-container">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar size={64} />
            <h3>No appointments found</h3>
            <p>Try changing your filters or search criteria</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map((apt) => (
              <div key={apt._id} className={`appointment-card ${apt.status?.toLowerCase()}`}>
                <div className="card-header">
                  <div className="patient-info">
                    <User size={24} />
                    <div>
                      <h3>{apt.patientName || apt.patientId?.name}</h3>
                      <p>{apt.type || 'Consultation'}</p>
                    </div>
                  </div>
                  <div className={`status-badge ${apt.status?.toLowerCase()}`}>
                    {apt.status === 'Confirmed' && <CheckCircle size={16} />}
                    {apt.status === 'Pending' && <AlertCircle size={16} />}
                    {apt.status === 'Cancelled' && <XCircle size={16} />}
                    {apt.status === 'Completed' && <CheckCircle size={16} />}
                    <span>{apt.status}</span>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>
                      {new Date(apt.appointmentTime).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {apt.symptoms && (
                    <div className="detail-row">
                      <AlertCircle size={16} />
                      <span>{apt.symptoms}</span>
                    </div>
                  )}
                  
                  {apt.phone && (
                    <div className="detail-row">
                      <Phone size={16} />
                      <span>{apt.phone}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  {apt.status === 'Pending' && (
                    <>
                      <button 
                        className="btn-confirm"
                        onClick={() => handleStatusChange(apt._id, 'Confirmed')}
                      >
                        Confirm
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => handleStatusChange(apt._id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === 'Confirmed' && (
                    <button 
                      className="btn-complete"
                      onClick={() => handleStatusChange(apt._id, 'Completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                  {apt.status === 'Completed' && (
                    <button className="btn-view" disabled>
                      Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
