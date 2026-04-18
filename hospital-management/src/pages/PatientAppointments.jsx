import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Plus, X, Check } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import axios from 'axios'
import './PatientAppointments.css'

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showBookingForm, setShowBookingForm] = useState(false)
  
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [appointmentsRes, doctorsRes, deptsRes] = await Promise.all([
        patientApi.getAppointments(),
        axios.get('http://localhost:5001/api/doctors'),
        axios.get('http://localhost:5001/api/departments')
      ])

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data)
      }
      if (doctorsRes.data.success) {
        setDoctors(doctorsRes.data.data)
      }
      if (deptsRes.data.success) {
        setDepartments(deptsRes.data.data)
      }
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
      await patientApi.bookAppointment(formData)
      alert('Appointment booked successfully!')
      setShowBookingForm(false)
      setFormData({ department: '', doctor: '', date: '', time: '', type: 'Consultation', notes: '' })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book appointment')
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    
    try {
      await patientApi.cancelAppointment(id)
      alert('Appointment cancelled successfully')
      fetchData()
    } catch (error) {
      alert('Failed to cancel appointment')
    }
  }

  const handleReschedule = async (id) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):')
    const newTime = prompt('Enter new time (HH:MM):')
    
    if (!newDate || !newTime) return
    
    try {
      await patientApi.rescheduleAppointment(id, { date: newDate, time: newTime })
      alert('Appointment rescheduled successfully')
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reschedule appointment')
    }
  }

  const filterAppointments = () => {
    const now = new Date()
    
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(apt => new Date(apt.date) >= now && apt.status !== 'Cancelled')
      case 'past':
        return appointments.filter(apt => new Date(apt.date) < now || apt.status === 'Completed')
      case 'cancelled':
        return appointments.filter(apt => apt.status === 'Cancelled')
      default:
        return appointments
    }
  }

  if (loading) {
    return <div className="loading">Loading appointments...</div>
  }

  const filteredAppointments = filterAppointments()

  return (
    <div className="patient-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <button className="book-btn" onClick={() => setShowBookingForm(true)}>
          <Plus size={20} />
          Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
        <button 
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List */}
      <div className="appointments-container">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No appointments found</h3>
            <p>{activeTab === 'upcoming' ? 'Book your first appointment now!' : 'No appointments in this category'}</p>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((apt) => (
              <div key={apt._id} className={`appointment-card ${apt.status.toLowerCase()}`}>
                <div className="apt-header">
                  <div className="apt-doctor">
                    <User size={24} />
                    <div>
                      <h3>Dr. {apt.doctor?.name || 'Unknown'}</h3>
                      <p>{apt.doctor?.specialization} - {apt.doctor?.department}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>
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
                  <div className="detail-item">
                    <strong>Type:</strong> {apt.type}
                  </div>
                </div>

                {apt.notes && (
                  <div className="apt-notes">
                    <strong>Notes:</strong> {apt.notes}
                  </div>
                )}

                {activeTab === 'upcoming' && (
                  <div className="apt-actions">
                    <button className="action-btn reschedule" onClick={() => handleReschedule(apt._id)}>
                      Reschedule
                    </button>
                    <button className="action-btn cancel" onClick={() => handleCancel(apt._id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button className="close-btn" onClick={() => setShowBookingForm(false)}>
                <X size={24} />
              </button>
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
                <label>Appointment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Describe your symptoms or reason for visit"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Check size={20} />
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientAppointments
