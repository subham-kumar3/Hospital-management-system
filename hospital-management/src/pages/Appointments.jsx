import React, { useState, useEffect } from 'react'
import { 
  Plus, Calendar, Clock, Users, Check, X, Edit2, Search, Filter, 
  Trash2, Phone, Mail, Activity, User, Stethoscope, MapPin, 
  ChevronDown, ChevronUp, RefreshCw, Download, Eye
} from 'lucide-react'
import { appointmentService, doctorService, patientService } from '../services'
import './Appointments.css'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    today: 0
  })

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    department: 'Cardiology',
    doctor: '',
    appointmentType: 'Check-up',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
    status: 'Pending'
  })

  // Departments and Doctors
  const departments = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
    'Dermatology', 'Surgery', 'Emergency', 'Radiology'
  ]

  const [doctorsList, setDoctorsList] = useState([])
  const [patientsList, setPatientsList] = useState([])

  // Load appointments, doctors, and patients
  useEffect(() => {
    loadAppointments()
    loadDoctors()
    loadPatients()
  }, [])

  // Update stats when appointments change
  useEffect(() => {
    updateStats()
  }, [appointments])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await appointmentService.getAllAppointments()
      
      if (response.success && Array.isArray(response.data)) {
        const mappedAppointments = response.data.map(apt => ({
          _id: apt._id,
          id: apt._id,
          patientName: apt.patient?.name || 'Unknown Patient',
          patientId: apt.patient?._id || '',
          patientPhone: apt.patient?.phone || '',
          patientEmail: apt.patient?.email || '',
          doctorName: apt.doctor?.name || 'Doctor Assigned',
          doctorId: apt.doctor?._id || '',
          department: apt.department || apt.doctor?.department || 'General',
          time: apt.time || '09:00 AM',
          type: apt.type || 'Check-up',
          status: apt.status || 'Pending',
          date: apt.date ? new Date(apt.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          notes: apt.notes || '',
          createdAt: apt.createdAt
        }))
        
        setAppointments(mappedAppointments)
      } else {
        setError('No appointments found')
        setAppointments([])
      }
    } catch (err) {
      console.error('Error loading appointments:', err)
      setError('Failed to load appointments. Make sure backend is running')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors()
      if (response.success && Array.isArray(response.data)) {
        setDoctorsList(response.data)
      }
    } catch (err) {
      console.error('Error loading doctors:', err)
    }
  }

  const loadPatients = async () => {
    try {
      const response = await patientService.getAllPatients()
      if (response.success && Array.isArray(response.data)) {
        setPatientsList(response.data)
      }
    } catch (err) {
      console.error('Error loading patients:', err)
    }
  }

  const updateStats = () => {
    const today = new Date().toISOString().split('T')[0]
    
    setStats({
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'Confirmed').length,
      pending: appointments.filter(a => a.status === 'Pending').length,
      cancelled: appointments.filter(a => a.status === 'Cancelled').length,
      today: appointments.filter(a => a.date === today).length
    })
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus
    const searchTermLower = searchTerm.toLowerCase()
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchTermLower) ||
      apt.doctorName.toLowerCase().includes(searchTermLower) ||
      apt.department.toLowerCase().includes(searchTermLower)
    
    return matchesStatus && matchesSearch
  })

  const handleCreateAppointment = async () => {
    try {
      if (!formData.patientName || !formData.doctor || !formData.date || !formData.time) {
        showToast('Please fill in all required fields', 'error')
        return
      }

      let patientId = formData.patientId
      const selectedDoctor = doctorsList.find(d => d._id === formData.doctor)
      
      if (!patientId && formData.patientName) {
        try {
          const patientResponse = await patientService.createPatient({
            name: formData.patientName,
            phone: formData.patientPhone || '',
            email: formData.patientEmail || '',
            age: 30,
            gender: 'Other',
            bloodGroup: 'O+',
            address: 'Not provided',
            status: 'Stable'
          })
          
          if (patientResponse.success) {
            patientId = patientResponse.data._id
          }
        } catch (err) {
          console.error('Error creating patient:', err)
          showToast('Failed to create patient record', 'error')
          return
        }
      }

      if (!patientId) {
        showToast('Patient is required', 'error')
        return
      }

      if (!selectedDoctor) {
        showToast('Please select a valid doctor', 'error')
        return
      }
      
      const appointmentData = {
        patient: patientId,
        doctor: selectedDoctor._id,
        department: formData.department || selectedDoctor.department,
        type: formData.appointmentType,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'Pending'
      }

      const response = await appointmentService.createAppointment(appointmentData)
      
      if (response.success) {
        await loadAppointments()
        setShowModal(false)
        resetForm()
        showToast('Appointment created successfully!', 'success')
      } else {
        showToast(response.message || 'Failed to create appointment', 'error')
      }
    } catch (err) {
      console.error('Error creating appointment:', err)
      showToast(err.response?.data?.message || 'Failed to create appointment', 'error')
    }
  }

  const handleUpdateAppointment = async () => {
    try {
      const response = await appointmentService.updateAppointment(editingAppointment._id, {
        status: formData.status,
        notes: formData.notes
      })
      
      if (response.success) {
        await loadAppointments()
        setShowModal(false)
        resetForm()
        showToast('Appointment updated successfully!', 'success')
      }
    } catch (err) {
      showToast('Failed to update appointment', 'error')
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return
    
    try {
      await appointmentService.deleteAppointment(id)
      await loadAppointments()
      showToast('Appointment deleted successfully!', 'success')
    } catch (err) {
      showToast('Failed to delete appointment', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientId: '',
      patientPhone: '',
      patientEmail: '',
      department: 'Cardiology',
      doctor: '',
      appointmentType: 'Check-up',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      notes: '',
      status: 'Pending'
    })
    setEditingAppointment(null)
  }

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail,
      department: appointment.department,
      doctor: appointment.doctorId,
      appointmentType: appointment.type,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
      status: appointment.status
    })
    setShowModal(true)
  }

  const showToast = (message, type) => {
    const toast = document.createElement('div')
    toast.className = `toast-toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Confirmed': return <Check size={16} />
      case 'Pending': return <Clock size={16} />
      case 'Cancelled': return <X size={16} />
      default: return <Activity size={16} />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return '#2ecc71'
      case 'Pending': return '#f39c12'
      case 'Cancelled': return '#e74c3c'
      default: return '#3498db'
    }
  }

  if (loading) {
    return (
      <div className="appointments-loading">
        <RefreshCw className="spin" size={48} />
        <p>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className="appointments-new-page">
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>📅 Appointment Management</h1>
          <p className="subtitle">Schedule and manage patient appointments efficiently</p>
        </div>
        <button className="btn-create" onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus size={20} />
          Book Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="stat-card-modern stat-today">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.today}</h3>
            <p>Today</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card-modern stat-cancelled">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="controls-bar">
        <div className="search-container">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />

          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Grid/List */}
      {filteredAppointments.length === 0 ? (
        <div className="no-data">
          <Activity size={64} color="#ccc" />
          <h3>No appointments found</h3>
          <p>Try adjusting your filters or create a new appointment</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="appointments-grid">
          {filteredAppointments.map((apt) => (
            <div key={apt._id} className="appointment-card-modern">
              <div className="card-header">
                <div className="patient-info">
                  <User size={20} color="#3498db" />
                  <h3>{apt.patientName}</h3>
                </div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(apt.status) + '20', color: getStatusColor(apt.status) }}
                >
                  {getStatusIcon(apt.status)}
                  {apt.status}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <Stethoscope size={16} />
                  <span>{apt.doctorName}</span>
                </div>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{apt.department}</span>
                </div>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>{new Date(apt.date).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <Clock size={16} />
                  <span>{apt.time}</span>
                </div>
                <div className="info-row">
                  <Activity size={16} />
                  <span>{apt.type}</span>
                </div>
                {apt.notes && (
                  <div className="notes-preview">
                    <strong>Notes:</strong> {apt.notes.substring(0, 50)}...
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button className="btn-action" onClick={() => openEditModal(apt)}>
                  <Edit2 size={16} />
                  Edit
                </button>
                <button className="btn-action-danger" onClick={() => handleDeleteAppointment(apt._id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="appointments-list-modern">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <div className="table-patient">
                      <User size={16} />
                      <span>{apt.patientName}</span>
                    </div>
                  </td>
                  <td>{apt.doctorName}</td>
                  <td><span className="dept-badge">{apt.department}</span></td>
                  <td>{new Date(apt.date).toLocaleDateString()}</td>
                  <td>{apt.time}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span 
                      className="status-badge-small"
                      style={{ backgroundColor: getStatusColor(apt.status) + '20', color: getStatusColor(apt.status) }}
                    >
                      {getStatusIcon(apt.status)}
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => openEditModal(apt)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteAppointment(apt._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => {
                      const selectedPatient = patientsList.find(p => p.name === e.target.value)
                      if (selectedPatient) {
                        setFormData({
                          ...formData,
                          patientName: selectedPatient.name,
                          patientId: selectedPatient._id,
                          patientPhone: selectedPatient.phone || '',
                          patientEmail: selectedPatient.email || ''
                        })
                      } else {
                        setFormData({...formData, patientName: e.target.value, patientId: ''})
                      }
                    }}
                    placeholder="Enter patient name or select from list"
                    required
                    list="patients-list"
                  />
                  <datalist id="patients-list">
                    {patientsList.map(patient => (
                      <option key={patient._id} value={patient.name}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                    placeholder="patient@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => {
                      const selectedDoc = doctorsList.find(d => d._id === e.target.value)
                      setFormData({
                        ...formData, 
                        doctor: e.target.value,
                        department: selectedDoc ? selectedDoc.department : formData.department
                      })
                    }}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctorsList.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} - {doc.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Appointment Type *</label>
                  <select
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({...formData, appointmentType: e.target.value})}
                    required
                  >
                    <option value="Check-up">Check-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Vaccination">Vaccination</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}>
                {editingAppointment ? 'Update' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
