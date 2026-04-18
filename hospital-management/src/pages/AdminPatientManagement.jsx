import React, { useState, useEffect } from 'react'
import { Search, Edit, Trash2, UserPlus } from 'lucide-react'
import { adminService } from '../services'
import './AdminPatientManagement.css'

const AdminPatientManagement = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    address: ''
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllPatients({ search })
      setPatients(response.data || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPatient) {
        await adminService.updatePatient(editingPatient._id, formData)
        alert('Patient updated successfully')
      } else {
        // For creating patients, use patient service or admin endpoint
        alert('Use Patient Registration page to add new patients')
      }
      setShowModal(false)
      setEditingPatient(null)
      fetchPatients()
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      bloodGroup: patient.bloodGroup,
      address: patient.address
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this patient?')) return
    try {
      await adminService.deletePatient(id)
      alert('Patient deleted successfully')
      fetchPatients()
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed')
    }
  }

  const getBloodGroupBadge = (group) => {
    const colors = {
      'A+': '#10b981', 'A-': '#3b82f6',
      'B+': '#8b5cf6', 'B-': '#ec4899',
      'O+': '#f59e0b', 'O-': '#ef4444',
      'AB+': '#06b6d4', 'AB-': '#6366f1'
    }
    return (
      <span className="blood-badge" style={{ backgroundColor: colors[group] || '#6b7280' }}>
        {group}
      </span>
    )
  }

  return (
    <div className="admin-patient-management">
      <div className="page-header">
        <h1>Patient Management</h1>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchPatients()}
          />
          <button onClick={fetchPatients}>Search</button>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="loading">Loading patients...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan="8" className="no-data">No patients found</td></tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.patientId}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{getBloodGroupBadge(patient.bloodGroup)}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email || '-'}</td>
                  <td className="actions">
                    <button className="btn-icon" onClick={() => handleEdit(patient)} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(patient._id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPatient ? 'Edit Patient' : 'Add Patient'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input type="number" required value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} rows="2"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingPatient ? 'Update' : 'Create'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPatientManagement
