import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, MapPin, Search, Filter } from 'lucide-react'
import { doctorService, departmentService } from '../services'
import './DoctorSchedule.css'

const DoctorSchedule = () => {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [doctorsRes, departmentsRes] = await Promise.all([
        doctorService.getAllDoctors(),
        departmentService.getAllDepartments()
      ])
      
      if (doctorsRes.success) {
        setDoctors(doctorsRes.data)
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = selectedDepartment === 'all' || 
      doctor.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const getDaySchedule = (doctor) => {
    const schedule = doctor.schedule || {}
    return Object.entries(schedule).map(([day, hours]) => ({
      day,
      ...hours,
      isAvailable: hours.available !== false
    }))
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    return time
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading schedules...</p>
      </div>
    )
  }

  return (
    <div className="doctor-schedule-page">
      <div className="schedule-header">
        <div>
          <h1>
            <Calendar size={28} />
            Doctor Schedules
          </h1>
          <p className="subtitle">View and manage doctor availability</p>
        </div>
      </div>

      <div className="schedule-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={18} />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="schedule-stats">
        <div className="stat-card">
          <h3>{doctors.length}</h3>
          <p>Total Doctors</p>
        </div>
        <div className="stat-card">
          <h3>{filteredDoctors.length}</h3>
          <p>Showing</p>
        </div>
        <div className="stat-card">
          <h3>{departments.length}</h3>
          <p>Departments</p>
        </div>
      </div>

      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div
              key={doctor._id}
              className={`doctor-card ${selectedDoctor?._id === doctor._id ? 'selected' : ''}`}
              onClick={() => setSelectedDoctor(selectedDoctor?._id === doctor._id ? null : doctor)}
            >
              <div className="doctor-header">
                <div className="doctor-avatar">
                  <User size={32} />
                </div>
                <div className="doctor-info">
                  <h3>Dr. {doctor.name}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <span className="department-badge">{doctor.department}</span>
                </div>
              </div>

              <div className="doctor-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>Room {doctor.room || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>
                    {doctor.experience ? `${doctor.experience} years exp.` : 'N/A'}
                  </span>
                </div>
              </div>

              {selectedDoctor?._id === doctor._id && (
                <div className="schedule-details">
                  <h4>Weekly Schedule</h4>
                  <div className="schedule-grid">
                    {getDaySchedule(doctor).map((daySchedule, index) => (
                      <div
                        key={index}
                        className={`day-card ${daySchedule.isAvailable ? 'available' : 'unavailable'}`}
                      >
                        <div className="day-header">
                          <h5>{daySchedule.day}</h5>
                          <span className={`status-badge ${daySchedule.isAvailable ? 'available' : 'unavailable'}`}>
                            {daySchedule.isAvailable ? 'Available' : 'Off'}
                          </span>
                        </div>
                        {daySchedule.isAvailable && daySchedule.startTime && daySchedule.endTime && (
                          <div className="day-hours">
                            <Clock size={14} />
                            <span>
                              {formatTime(daySchedule.startTime)} - {formatTime(daySchedule.endTime)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-footer">
                <button className="btn-view-schedule">
                  {selectedDoctor?._id === doctor._id ? 'Hide Schedule' : 'View Schedule'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No doctors found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorSchedule
