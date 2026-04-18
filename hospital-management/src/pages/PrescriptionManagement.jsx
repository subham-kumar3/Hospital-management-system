import React, { useState, useEffect } from 'react'
import { Search, Eye, CheckCircle, Filter } from 'lucide-react'
import { prescriptionAPI } from '../services/pharmacyApi'
import './Appointments.css'

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dispenseModal, setDispenseModal] = useState(false)
  const [pharmacyNotes, setPharmacyNotes] = useState('')

  useEffect(() => {
    loadPrescriptions()
  }, [statusFilter])

  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionAPI.getAll({ status: statusFilter })
      if (response.success) {
        setPrescriptions(response.data)
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadPrescriptions()
  }

  const handleViewDetails = async (id) => {
    try {
      const response = await prescriptionAPI.getById(id)
      if (response.success) {
        setSelectedPrescription(response.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error loading prescription:', error)
    }
  }

  const handleDispense = async (id) => {
    try {
      const response = await prescriptionAPI.dispense(id, { pharmacyNotes })
      if (response.success) {
        alert('Prescription dispensed successfully!')
        setDispenseModal(false)
        setPharmacyNotes('')
        loadPrescriptions()
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error dispensing prescription')
    }
  }

  const openDispenseModal = (id) => {
    setSelectedPrescription({ _id: id })
    setDispenseModal(true)
  }

  const filteredPrescriptions = prescriptions.filter(rx => 
    search === '' || 
    rx.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
    rx.patient?.contact?.includes(search)
  )

  if (loading) return <div className="loading">Loading prescriptions...</div>

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Prescription Management</h1>
        <p>Manage and dispense patient prescriptions</p>
      </div>

      <div className="filters-bar">
        <form onSubmit={handleSearch} className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by patient name or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Dispensed">Dispensed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Medicines</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((rx) => (
                <tr key={rx._id}>
                  <td>{new Date(rx.createdAt).toLocaleDateString()}</td>
                  <td>{rx.patient?.name || 'N/A'}</td>
                  <td>{rx.doctor?.name || 'N/A'}</td>
                  <td>{rx.diagnosis}</td>
                  <td>{rx.medicines?.length || 0} items</td>
                  <td>
                    <span className={`badge ${
                      rx.status === 'Dispensed' ? 'badge-success' :
                      rx.status === 'Active' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-primary"
                      onClick={() => handleViewDetails(rx._id)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {rx.status === 'Active' && (
                      <button 
                        className="btn-icon btn-success"
                        onClick={() => openDispenseModal(rx._id)}
                        title="Dispense"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No prescriptions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {showModal && selectedPrescription && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Prescription Details</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Patient Name</label>
                  <p>{selectedPrescription.patient?.name}</p>
                </div>
                <div className="detail-item">
                  <label>Doctor</label>
                  <p>{selectedPrescription.doctor?.name}</p>
                </div>
                <div className="detail-item">
                  <label>Diagnosis</label>
                  <p>{selectedPrescription.diagnosis}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{new Date(selectedPrescription.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <h3>Medicines</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrescription.medicines?.map((med, idx) => (
                    <tr key={idx}>
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.frequency}</td>
                      <td>{med.duration}</td>
                      <td>{med.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedPrescription.notes && (
                <div className="detail-item">
                  <label>Doctor's Notes</label>
                  <p>{selectedPrescription.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseModal && (
        <div className="modal-overlay" onClick={() => setDispenseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dispense Prescription</h2>
              <button className="btn-close" onClick={() => setDispenseModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Pharmacy Notes (Optional)</label>
                <textarea
                  value={pharmacyNotes}
                  onChange={(e) => setPharmacyNotes(e.target.value)}
                  placeholder="Add any notes about dispensing..."
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setDispenseModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDispense(selectedPrescription._id)}
                >
                  Confirm Dispense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrescriptionManagement
