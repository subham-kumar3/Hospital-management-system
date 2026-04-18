import React, { useState, useEffect } from 'react'
import { Plus, FileText, User, Calendar, Clock, Edit2, Trash2, Download, Search, X } from 'lucide-react'
import { prescriptionService, doctorService, patientService } from '../services'
import './Prescriptions.css'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [doctorsList, setDoctorsList] = useState([])
  const [patientsList, setPatientsList] = useState([])
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    appointment: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }],
    notes: '',
    followUpDate: '',
    status: 'Active'
  })

  useEffect(() => {
    loadPrescriptions()
    loadDoctors()
    loadPatients()
  }, [])

  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionService.getAllPrescriptions()
      if (response.success) {
        setPrescriptions(response.data)
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors()
      if (response.success) {
        setDoctorsList(response.data)
      }
    } catch (error) {
      console.error('Error loading doctors:', error)
    }
  }

  const loadPatients = async () => {
    try {
      const response = await patientService.getAllPatients()
      if (response.success) {
        setPatientsList(response.data)
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingPrescription) {
        const response = await prescriptionService.updatePrescription(editingPrescription._id, formData)
        if (response.success) {
          await loadPrescriptions()
          setShowModal(false)
          resetForm()
          alert('Prescription updated successfully!')
        }
      } else {
        const response = await prescriptionService.createPrescription(formData)
        if (response.success) {
          await loadPrescriptions()
          setShowModal(false)
          resetForm()
          alert('Prescription created successfully!')
        }
      }
    } catch (error) {
      alert('Failed to save prescription: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      patient: '',
      doctor: '',
      appointment: '',
      diagnosis: '',
      medicines: [{ name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }],
      notes: '',
      followUpDate: '',
      status: 'Active'
    })
    setEditingPrescription(null)
  }

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }]
    })
  }

  const removeMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index)
    setFormData({ ...formData, medicines: updatedMedicines })
  }

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = formData.medicines.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value }
      }
      return med
    })
    setFormData({ ...formData, medicines: updatedMedicines })
  }

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="loading">Loading prescriptions...</div>

  return (
    <div className="prescriptions-page">
      <div className="page-header">
        <div>
          <h1>💊 Prescriptions Management</h1>
          <p>Manage patient prescriptions and medications</p>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>
          <Plus size={20} />
          Add Prescription
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by patient, doctor, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="prescriptions-grid">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription._id} className="prescription-card">
            <div className="card-header">
              <div className="patient-info">
                <User size={20} />
                <h3>{prescription.patient?.name}</h3>
              </div>
              <span className={`status-badge ${prescription.status.toLowerCase()}`}>
                {prescription.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-row">
                <FileText size={16} />
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </div>
              <div className="info-row">
                <User size={16} />
                <strong>Doctor:</strong> {prescription.doctor?.name}
              </div>
              <div className="info-row">
                <Calendar size={16} />
                <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
              </div>
              
              <div className="medicines-list">
                <h4>Medicines:</h4>
                {prescription.medicines.map((med, idx) => (
                  <div key={idx} className="medicine-item">
                    <strong>{med.name}</strong> - {med.dosage}, {med.frequency}
                    <br />
                    <small>Duration: {med.duration}</small>
                    {med.instructions && <div><small>Instructions: {med.instructions}</small></div>}
                  </div>
                ))}
              </div>

              {prescription.notes && (
                <div className="notes">
                  <strong>Notes:</strong> {prescription.notes}
                </div>
              )}
            </div>

            <div className="card-actions">
              <button className="btn-action" onClick={() => alert('Download PDF feature coming soon!')}>
                <Download size={16} />
                Download
              </button>
              <button className="btn-action-edit" onClick={() => {
                setEditingPrescription(prescription)
                setFormData({
                  patient: prescription.patient?._id,
                  doctor: prescription.doctor?._id,
                  diagnosis: prescription.diagnosis,
                  medicines: prescription.medicines,
                  notes: prescription.notes,
                  followUpDate: prescription.followUpDate ? new Date(prescription.followUpDate).toISOString().split('T')[0] : '',
                  status: prescription.status
                })
                setShowModal(true)
              }}>
                <Edit2 size={16} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="prescription-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient *</label>
                  <select
                    value={formData.patient}
                    onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patientsList.map(patient => (
                      <option key={patient._id} value={patient._id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctorsList.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.department}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  placeholder="Enter diagnosis"
                  required
                />
              </div>

              <div className="medicines-form">
                <div className="section-header">
                  <h3>Medicines</h3>
                  <button type="button" className="btn-add" onClick={addMedicine}>
                    <Plus size={16} /> Add Medicine
                  </button>
                </div>
                
                {formData.medicines.map((medicine, index) => (
                  <div key={index} className="medicine-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Medicine Name *</label>
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                          placeholder="e.g., Paracetamol"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Dosage *</label>
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Frequency *</label>
                        <select
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                          required
                        >
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Duration *</label>
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Instructions</label>
                      <input
                        type="text"
                        value={medicine.instructions}
                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                        placeholder="e.g., Take after meals"
                      />
                    </div>

                    {formData.medicines.length > 1 && (
                      <button type="button" className="btn-remove" onClick={() => removeMedicine(index)}>
                        <X size={16} /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPrescription ? 'Update' : 'Create'} Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Prescriptions
