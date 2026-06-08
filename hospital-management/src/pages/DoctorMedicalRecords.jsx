import React, { useState, useEffect } from 'react'
import { Plus, Search, FileText, User, Calendar } from 'lucide-react'
import { medicalRecordService } from '../services'
import { onDashboardUpdate } from '../services/socketService'
import './DoctorMedicalRecords.css'

const DoctorMedicalRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    treatment: '',
    type: 'Outpatient',
    symptoms: '',
    notes: '',
    followUpDate: ''
  })

  useEffect(() => {
    loadRecords()
    
    // Setup real-time listener
    const cleanup = onDashboardUpdate((data) => {
      console.log('🔄 Doctor Medical Records: Real-time update:', data.data.type)
      loadRecords()
    })
    
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const loadRecords = async () => {
    try {
      setLoading(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const doctorId = userData.doctorProfile || userData._id
      
      const response = await medicalRecordService.getRecordsByDoctor(doctorId)
      if (response.success) {
        setRecords(response.data)
      }
    } catch (error) {
      console.error('Error loading records:', error)
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
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const recordData = {
        ...formData,
        doctor: userData.doctorProfile || userData._id,
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s)
      }

      const response = await medicalRecordService.createMedicalRecord(recordData)
      if (response.success) {
        alert('Medical record created successfully!')
        setShowForm(false)
        setFormData({
          patient: '',
          diagnosis: '',
          treatment: '',
          type: 'Outpatient',
          symptoms: '',
          notes: '',
          followUpDate: ''
        })
        loadRecords()
      }
    } catch (error) {
      console.error('Error creating record:', error)
      alert('Error creating medical record')
    }
  }

  const filteredRecords = records.filter(r => 
    r.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Loading medical records...</div>
  }

  return (
    <div className="doctor-medical-records">
      <div className="page-header">
        <div>
          <h1>Medical Records</h1>
          <p>Manage patient medical records</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          New Record
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>Create Medical Record</h2>
          <form onSubmit={handleSubmit} className="record-form">
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

            <div className="form-group">
              <label>Treatment *</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Enter treatment details"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Record Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="Outpatient">Outpatient</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Emergency">Emergency</option>
                <option value="Surgical">Surgical</option>
              </select>
            </div>

            <div className="form-group">
              <label>Symptoms (comma-separated)</label>
              <input
                type="text"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="e.g., Fever, Cough, Headache"
              />
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
              <button type="submit" className="btn-primary">Create Record</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="records-list">
        {filteredRecords.length === 0 ? (
          <div className="no-data">
            <FileText size={48} />
            <h3>No medical records found</h3>
            <p>Create a new record to get started</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <div className="patient-info">
                  <User size={20} />
                  <h3>{record.patient?.name || 'Unknown Patient'}</h3>
                </div>
                <span className="type-badge">{record.type}</span>
              </div>
              
              <div className="record-details">
                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                <p><strong>Treatment:</strong> {record.treatment}</p>
                {record.symptoms && record.symptoms.length > 0 && (
                  <p><strong>Symptoms:</strong> {record.symptoms.join(', ')}</p>
                )}
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              </div>

              <div className="record-footer">
                <div className="meta-info">
                  <Calendar size={16} />
                  <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
                {record.followUpDate && (
                  <div className="follow-up">
                    Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
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

export default DoctorMedicalRecords
