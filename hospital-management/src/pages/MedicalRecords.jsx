import React, { useState, useEffect } from 'react'
import { FileText, Search, Plus, Eye, Download, X } from 'lucide-react'
import jsPDF from 'jspdf'
import './MedicalRecords.css'

const MedicalRecords = () => {
  const [records, setRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  
  // Form state for adding new record
  const [newRecord, setNewRecord] = useState({
    patientId: '',
    patientName: '',
    doctor: '',
    diagnosis: '',
    treatment: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Outpatient',
    notes: ''
  })

  // Initial demo medical records
  const initialRecords = [
    { 
      id: 1, 
      patientId: '#0001', 
      patientName: 'John Smith', 
      doctor: 'Dr. Emily Brown', 
      diagnosis: 'Hypertension', 
      treatment: 'Medication prescribed', 
      date: '2024-01-15', 
      type: 'Outpatient',
      notes: 'Patient advised to monitor blood pressure regularly'
    },
    { 
      id: 2, 
      patientId: '#0002', 
      patientName: 'Sarah Johnson', 
      doctor: 'Dr. Michael Chen', 
      diagnosis: 'Migraine', 
      treatment: 'Therapy recommended', 
      date: '2024-01-18', 
      type: 'Outpatient',
      notes: 'Stress management techniques suggested'
    },
    { 
      id: 3, 
      patientId: '#0003', 
      patientName: 'Michael Brown', 
      doctor: 'Dr. Lisa Wilson', 
      diagnosis: 'Fractured Arm', 
      treatment: 'Cast applied', 
      date: '2024-01-20', 
      type: 'Emergency',
      notes: 'Follow-up after 4 weeks'
    },
    { 
      id: 4, 
      patientId: '#0004', 
      patientName: 'Emily Davis', 
      doctor: 'Dr. James Taylor', 
      diagnosis: 'Pneumonia', 
      treatment: 'Hospitalized for treatment', 
      date: '2024-01-22', 
      type: 'Inpatient',
      notes: 'Responding well to antibiotics'
    },
    { 
      id: 5, 
      patientId: '#0005', 
      patientName: 'Robert Wilson', 
      doctor: 'Dr. Sarah Martinez', 
      diagnosis: 'Skin Allergy', 
      treatment: 'Topical cream prescribed', 
      date: '2024-01-25', 
      type: 'Outpatient',
      notes: 'Avoid allergens identified in tests'
    },
    { 
      id: 6, 
      patientId: '#0006', 
      patientName: 'Lisa Anderson', 
      doctor: 'Dr. Robert Johnson', 
      diagnosis: 'Appendicitis', 
      treatment: 'Surgery performed', 
      date: '2024-01-28', 
      type: 'Surgical',
      notes: 'Successful appendectomy, recovery normal'
    },
  ]

  // Load records on mount
  useEffect(() => {
    setRecords(initialRecords)
    setLoading(false)
  }, [])

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewRecord = (record) => {
    setSelectedRecord(record)
    setShowViewModal(true)
  }

  const handleAddNewRecord = () => {
    setNewRecord({
      patientId: '',
      patientName: '',
      doctor: '',
      diagnosis: '',
      treatment: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Outpatient',
      notes: ''
    })
    setShowAddModal(true)
  }

  const handleSubmitNewRecord = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!newRecord.patientName || !newRecord.diagnosis || !newRecord.treatment) {
      const toast = document.createElement('div')
      toast.className = 'toast-error'
      toast.textContent = '✗ Please fill all required fields'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
      return
    }

    // Create new record object
    const recordToAdd = {
      id: records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1,
      patientId: newRecord.patientId || `#${String(records.length + 1).padStart(4, '0')}`,
      patientName: newRecord.patientName,
      doctor: newRecord.doctor,
      diagnosis: newRecord.diagnosis,
      treatment: newRecord.treatment,
      date: newRecord.date,
      type: newRecord.type,
      notes: newRecord.notes
    }

    // Add to records list
    setRecords([...records, recordToAdd])
    
    // Close modal
    setShowAddModal(false)
    
    // Show success toast
    const toast = document.createElement('div')
    toast.className = 'toast-success'
    toast.textContent = '✓ Medical record added successfully!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const handleInputChange = (field, value) => {
    setNewRecord({
      ...newRecord,
      [field]: value
    })
  }

  const handleDownloadRecord = (record) => {
    // Create PDF using jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Header - Hospital Title
    doc.setFillColor(212, 175, 55) // Gold color
    doc.rect(0, 0, pageWidth, 30, 'F')
    
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('HOSPITAL MANAGEMENT SYSTEM', pageWidth / 2, 12, { align: 'center' })
    doc.setFontSize(14)
    doc.text('MEDICAL RECORD REPORT', pageWidth / 2, 22, { align: 'center' })
    
    // Content area
    let yPos = 45
    
    // Record Information Section
    doc.setFontSize(16)
    doc.setTextColor(212, 175, 55)
    doc.setFont('helvetica', 'bold')
    doc.text('RECORD INFORMATION', 14, yPos)
    yPos += 10
    
    // Draw a line
    doc.setDrawColor(212, 175, 55)
    doc.setLineWidth(0.5)
    doc.line(14, yPos - 2, pageWidth - 14, yPos - 2)
    yPos += 8
    
    // Record details
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    
    const recordDetails = [
      [`Record ID:`, `REC-${record.id.toString().padStart(4, '0')}`],
      [`Patient ID:`, `${record.patientId}`],
      [`Patient Name:`, `${record.patientName}`],
      [`Attending Doctor:`, `${record.doctor}`],
      [`Date of Treatment:`, `${record.date}`],
      [`Record Type:`, `${record.type}`]
    ]
    
    recordDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, 14, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(value, 70, yPos)
      yPos += 8
    })
    
    yPos += 5
    
    // Medical Information Section
    doc.setFontSize(16)
    doc.setTextColor(212, 175, 55)
    doc.setFont('helvetica', 'bold')
    doc.text('MEDICAL INFORMATION', 14, yPos)
    yPos += 10
    
    doc.setDrawColor(212, 175, 55)
    doc.line(14, yPos - 2, pageWidth - 14, yPos - 2)
    yPos += 8
    
    // Diagnosis
    doc.setFont('helvetica', 'bold')
    doc.text('Diagnosis:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    const diagnosisText = doc.splitTextToSize(record.diagnosis, pageWidth - 70)
    doc.text(diagnosisText, 70, yPos)
    yPos += (diagnosisText.length * 6) + 5
    
    // Treatment
    doc.setFont('helvetica', 'bold')
    doc.text('Treatment:', 14, yPos)
    doc.setFont('helvetica', 'normal')
    const treatmentText = doc.splitTextToSize(record.treatment, pageWidth - 70)
    doc.text(treatmentText, 70, yPos)
    yPos += (treatmentText.length * 6) + 5
    
    // Clinical Notes
    if (record.notes) {
      doc.setFontSize(16)
      doc.setTextColor(212, 175, 55)
      doc.setFont('helvetica', 'bold')
      doc.text('CLINICAL NOTES', 14, yPos)
      yPos += 10
      
      doc.setDrawColor(212, 175, 55)
      doc.line(14, yPos - 2, pageWidth - 14, yPos - 2)
      yPos += 8
      
      doc.setFont('helvetica', 'normal')
      const notesText = doc.splitTextToSize(record.notes, pageWidth - 28)
      doc.text(notesText, 14, yPos)
      yPos += (notesText.length * 6) + 10
    }
    
    // Footer
    doc.setFillColor(245, 245, 245)
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')
    
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.setFont('helvetica', 'italic')
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    doc.text('This is a computer-generated medical record from Hospital Management System', pageWidth / 2, pageHeight - 5, { align: 'center' })
    
    // Save the PDF
    const filename = `Medical-Record-${record.patientName.replace(/\s+/g, '-')}.pdf`
    doc.save(filename)
    
    // Show success toast
    const toast = document.createElement('div')
    toast.className = 'toast-success'
    toast.textContent = '✓ PDF downloaded successfully!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  return (
    <div className="records-page">
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>📋 Medical Records</h1>
          <p className="subtitle">Patient medical history and treatment records</p>
        </div>
        <button className="btn-create" onClick={handleAddNewRecord}>
          <Plus size={20} />
          Add New Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{records.length}</h3>
            <p>Total Records</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">🏥</div>
          <div className="stat-info">
            <h3>{records.filter(r => r.type === 'Outpatient').length}</h3>
            <p>Outpatient</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">🚑</div>
          <div className="stat-info">
            <h3>{records.filter(r => r.type === 'Emergency').length}</h3>
            <p>Emergency</p>
          </div>
        </div>
        <div className="stat-card-modern stat-cancelled">
          <div className="stat-icon">🛏️</div>
          <div className="stat-info">
            <h3>{records.filter(r => r.type === 'Inpatient').length}</h3>
            <p>Inpatient</p>
          </div>
        </div>
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">⚕️</div>
          <div className="stat-info">
            <h3>{records.filter(r => r.type === 'Surgical').length}</h3>
            <p>Surgical</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="Search by patient name, ID or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading medical records...</div>
      ) : (
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Date</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                    No medical records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td><strong>REC-{record.id.toString().padStart(4, '0')}</strong></td>
                    <td>{record.patientId}</td>
                    <td>{record.patientName}</td>
                    <td>{record.doctor}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.treatment}</td>
                    <td>{record.date}</td>
                    <td><span className={`type-badge ${record.type.toLowerCase()}`}>{record.type}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon-view" 
                          title="View Details"
                          onClick={() => handleViewRecord(record)}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="btn-icon-download" 
                          title="Download"
                          onClick={() => handleDownloadRecord(record)}
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Medical Record Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-section">
                <h3>Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Patient ID:</label>
                    <span>{selectedRecord.patientId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Patient Name:</label>
                    <span>{selectedRecord.patientName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Attending Doctor:</label>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Medical Information</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>Diagnosis:</label>
                    <span>{selectedRecord.diagnosis}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Treatment:</label>
                    <span>{selectedRecord.treatment}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{selectedRecord.date}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span className={`type-badge ${selectedRecord.type.toLowerCase()}`}>
                      {selectedRecord.type}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="detail-section">
                  <h3>Clinical Notes</h3>
                  <p className="notes-text">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => handleDownloadRecord(selectedRecord)}
              >
                <Download size={18} />
                Download Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Medical Record</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitNewRecord}>
              <div className="modal-content">
                <div className="detail-section">
                  <h3>Patient Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Patient ID (Optional)</label>
                      <input
                        type="text"
                        value={newRecord.patientId}
                        onChange={(e) => handleInputChange('patientId', e.target.value)}
                        placeholder="#0007"
                      />
                    </div>
                    <div className="detail-item">
                      <label>Patient Name *</label>
                      <input
                        type="text"
                        value={newRecord.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        placeholder="Enter patient name"
                        required
                      />
                    </div>
                    <div className="detail-item full-width">
                      <label>Doctor *</label>
                      <select
                        value={newRecord.doctor}
                        onChange={(e) => handleInputChange('doctor', e.target.value)}
                        required
                      >
                        <option value="">Select Doctor</option>
                        <option value="Dr. Emily Brown">Dr. Emily Brown - Cardiology</option>
                        <option value="Dr. Michael Chen">Dr. Michael Chen - Neurology</option>
                        <option value="Dr. Lisa Wilson">Dr. Lisa Wilson - Orthopedics</option>
                        <option value="Dr. James Taylor">Dr. James Taylor - Pediatrics</option>
                        <option value="Dr. Sarah Martinez">Dr. Sarah Martinez - Dermatology</option>
                        <option value="Dr. Robert Johnson">Dr. Robert Johnson - Surgery</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Medical Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item full-width">
                      <label>Diagnosis *</label>
                      <input
                        type="text"
                        value={newRecord.diagnosis}
                        onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>
                    <div className="detail-item full-width">
                      <label>Treatment *</label>
                      <textarea
                        value={newRecord.treatment}
                        onChange={(e) => handleInputChange('treatment', e.target.value)}
                        placeholder="Enter treatment details"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={newRecord.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Record Type *</label>
                      <select
                        value={newRecord.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        required
                      >
                        <option value="Outpatient">Outpatient</option>
                        <option value="Inpatient">Inpatient</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Surgical">Surgical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Clinical Notes</h3>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes (optional)"
                    rows="3"
                    style={{ inlineSize: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={18} />
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalRecords
