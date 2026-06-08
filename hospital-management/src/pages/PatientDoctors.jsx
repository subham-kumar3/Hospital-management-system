import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, Search, MapPin, Clock, DollarSign } from 'lucide-react'
import api from '../services/api'
import './PatientDoctors.css'

const PatientDoctors = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [doctorsRes, deptsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments')
      ])

      if (doctorsRes.data.success) setDoctors(doctorsRes.data.data)
      if (deptsRes.data.success) setDepartments(deptsRes.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = !filterDept || doctor.department === filterDept
    return matchesSearch && matchesDept
  })

  const handleBookAppointment = (doctor) => {
    navigate('/patient/appointments', { state: { selectedDoctor: doctor } })
  }

  if (loading) {
    return <div className="loading">Loading doctors...</div>
  }

  return (
    <div className="patient-doctors">
      <div className="page-header">
        <h1>Our Doctors</h1>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <div className="doctor-header">
              <div className="doctor-icon">
                <Stethoscope size={40} />
              </div>
              <div className="doctor-info">
                <h3>Dr. {doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <p className="department">{doctor.department}</p>
              </div>
            </div>

            <div className="doctor-details">
              <div className="detail-item">
                <Clock size={16} />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="detail-item">
                <DollarSign size={16} />
                <span>₹{doctor.consultationFee || 500} consultation</span>
              </div>
              <div className="detail-item">
                <span className={`status-badge ${doctor.status.toLowerCase().replace(' ', '-')}`}>
                  {doctor.status}
                </span>
              </div>
            </div>

            {doctor.availability && doctor.availability.length > 0 && (
              <div className="availability">
                <h4>Available:</h4>
                <div className="days">
                  {doctor.availability.slice(0, 3).map((slot, idx) => (
                    <span key={idx} className="day-badge">{slot.day}</span>
                  ))}
                  {doctor.availability.length > 3 && (
                    <span className="more">+{doctor.availability.length - 3} more</span>
                  )}
                </div>
              </div>
            )}

            <button 
              className="book-btn"
              onClick={() => handleBookAppointment(doctor)}
              disabled={doctor.status === 'Inactive'}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="empty-state">
          <Stethoscope size={64} />
          <h3>No doctors found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default PatientDoctors
