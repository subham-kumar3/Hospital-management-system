import React, { useState, useEffect } from 'react'
import { Plus, Search, FileText, User, Clock } from 'lucide-react'
import { prescriptionService } from '../services'
import { onDashboardUpdate } from '../services/socketService'
import './DoctorPrescriptions.css'

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }],
    notes: '',
    followUpDate: ''
  })

  useEffect(() => {
    loadPrescriptions()
    
    // Setup real-time listener
    const cleanup = onDashboardUpdate((data) => {
      console.log('🔄 Doctor Prescriptions: Real-time update:', data.data.type)
      loadPrescriptions()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const doctorId = userData.doctorProfile || userData._id
      
      const response = await prescriptionService.getPrescriptionsByDoctor(doctorId)
      if (response.success) {
        setPrescriptions(response.data)
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines]
    newMedicines[index] = { ...newMedicines[index], [field]: value }
    setFormData(prev => ({ ...prev, medicines: newMedicines }))
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }]
    }))
  }

  const removeMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, medicines: newMedicines }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const prescriptionData = {
        ...formData,
        doctor: userData.doctorProfile || userData._id
      }

      const response = await prescriptionService.createPrescription(prescriptionData)
      if (response.success) {
        alert('Prescription created successfully!')
        setShowForm(false)
        setFormData({
          patient: '',
          diagnosis: '',
          medicines: [{ name: '', dosage: '', frequency: 'Twice daily', duration: '', instructions: '' }],
          notes: '',
          followUpDate: ''
        })
        loadPrescriptions()
      }
    } catch (error) {
      console.error('Error creating prescription:', error)
      alert('Error creating prescription')
    }
  }

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>
  }

  return (
    <div className="doctor-prescriptions">
      <div className="page-header">
        <div>
          <h1>Prescriptions</h1>
          <p>Manage patient prescriptions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Prescription
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Create New Prescription</h2>
          <form onSubmit={handleSubmit} className="prescription-form">
            <div className="form-group">
              <label>Patient ID *</label>
              <input
                type="text"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                placeholder="Enter Patient ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Diagnosis *</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div className="form-section">
              <h3>Medicines</h3>
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="medicine-entry">
                  <div className="medicine-grid">
                    <div className="form-group">
                      <label>Medicine Name</label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Dosage</label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        placeholder="e.g., 1 tablet"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Frequency</label>
                      <select
                        value={medicine.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 5 days"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Instructions</label>
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      placeholder="e.g., After meals"
                    />
                  </div>
                  {formData.medicines.length > 1 && (
                    <button type="button" className="btn-danger-sm" onClick={() => removeMedicine(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={addMedicine}>
                <Plus size={16} /> Add Medicine
              </button>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Prescription</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search prescriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="prescriptions-list">
        {filteredPrescriptions.length === 0 ? (
          <div className="no-data">
            <FileText size={48} />
            <h3>No prescriptions found</h3>
            <p>Create a new prescription to get started</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card">
              <div className="prescription-header">
                <div className="patient-info">
                  <User size={20} />
                  <h3>{prescription.patient?.name || 'Unknown Patient'}</h3>
                </div>
                <span className={`status-badge ${prescription.status?.toLowerCase()}`}>
                  {prescription.status}
                </span>
              </div>
              
              <div className="prescription-details">
                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                <p><strong>Medicines:</strong></p>
                <ul className="medicines-list">
                  {prescription.medicines?.map((med, idx) => (
                    <li key={idx}>
                      {med.name} - {med.dosage} - {med.frequency} - {med.duration}
                    </li>
                  ))}
                </ul>
                {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
              </div>

              <div className="prescription-footer">
                <div className="meta-info">
                  <Clock size={16} />
                  <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                </div>
                {prescription.followUpDate && (
                  <div className="follow-up">
                    Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorPrescriptions
