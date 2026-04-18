import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react'
import './Patients.css'
import { patientService } from '../services'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const response = await patientService.getAllPatients()
      setPatients(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load patients. Please try again.')
      console.error('Error loading patients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedPatient?._id) {
        await patientService.updatePatient(selectedPatient._id, formData)
        alert('Patient updated successfully!')
      } else {
        await patientService.createPatient(formData)
        alert('Patient added successfully!')
      }
      setShowModal(false)
      loadPatients()
      resetForm()
    } catch (err) {
      alert('Error saving patient: ' + err.message)
      console.error('Error saving patient:', err)
    }
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return
    }
    try {
      await patientService.deletePatient(patientId)
      alert('Patient deleted successfully!')
      loadPatients()
    } catch (err) {
      alert('Error deleting patient: ' + err.message)
      console.error('Error deleting patient:', err)
    }
  }

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      bloodGroup: '',
      phone: '',
      email: '',
      address: ''
    })
    setSelectedPatient(null)
  }

  const filteredPatients = patients.filter(patient =>
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="patients-page">
      {loading && <div className="loading">Loading patients...</div>}
      {error && <div className="error-message">{error}</div>}
            
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>👥 Patient Management</h1>
          <p className="subtitle">Manage patient records and information</p>
        </div>
        <button className="btn-create" onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus size={20} />
          Add New Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{patients.length}</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">🩸</div>
          <div className="stat-info">
            <h3>{[...new Set(patients.map(p => p.bloodGroup))].length}</h3>
            <p>Blood Groups</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>{patients.filter(p => p.phone).length}</h3>
            <p>With Phone</p>
          </div>
        </div>
        <div className="stat-card-modern stat-cancelled">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{patients.filter(p => p.email).length}</h3>
            <p>With Email</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="Search by patient name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="patients-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age/Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Admitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id || patient.id}>
                <td>#{(patient._id || patient.id).toString().slice(-6)}</td>
                <td><strong>{patient.name}</strong></td>
                <td>{patient.age} / {patient.gender}</td>
                <td><span className="blood-group">{patient.bloodGroup}</span></td>
                <td>{patient.phone}</td>
                <td>{patient.email}</td>
                <td>{patient.address}</td>
                <td>{new Date(patient.admittedDate || patient.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="View" onClick={() => handleView(patient)}>
                      <Eye size={18} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => handleEdit(patient)}>
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon btn-delete" title="Delete" onClick={() => handleDelete(patient._id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPatient && selectedPatient._id ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Address *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3" 
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedPatient && selectedPatient._id ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Patient Details - {selectedPatient.name}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <span className="detail-label">Patient ID:</span>
                <span className="detail-value">#{selectedPatient._id ? selectedPatient._id.slice(-6) : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedPatient.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Age/Gender:</span>
                <span className="detail-value">{selectedPatient.age} / {selectedPatient.gender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Blood Group:</span>
                <span className="detail-value blood-group">{selectedPatient.bloodGroup}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedPatient.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedPatient.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{selectedPatient.address}</span>
              </div>
              {selectedPatient.admittedDate && (
                <div className="detail-row">
                  <span className="detail-label">Admitted Date:</span>
                  <span className="detail-value">{selectedPatient.admittedDate}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button type="button" className="btn-primary" onClick={() => { setShowViewModal(false); handleEdit(selectedPatient); }}>
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
