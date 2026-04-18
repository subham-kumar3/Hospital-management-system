import React, { useState, useEffect } from 'react'
import { FileText, User, Calendar, Activity } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import './PatientMedicalRecords.css'

const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await patientApi.getMedicalRecords()
      if (response.data.success) {
        setRecords(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading medical records...</div>

  return (
    <div className="patient-medical-records">
      <div className="page-header">
        <h1>Medical Records</h1>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No medical records found</h3>
          <p>Your medical history will appear here</p>
        </div>
      ) : (
        <div className="records-timeline">
          {records.map((record) => (
            <div key={record._id} className="record-card">
              <div className="record-header">
                <div className="record-info">
                  <User size={20} />
                  <div>
                    <h3>Dr. {record.doctor?.name}</h3>
                    <p>{record.doctor?.specialization}</p>
                  </div>
                </div>
                <span className="record-type">{record.type}</span>
              </div>

              <div className="record-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <strong>Diagnosis:</strong>
                  <p>{record.diagnosis}</p>
                </div>
                <div className="detail-row">
                  <strong>Treatment:</strong>
                  <p>{record.treatment}</p>
                </div>
                {record.symptoms && record.symptoms.length > 0 && (
                  <div className="detail-row">
                    <strong>Symptoms:</strong>
                    <div className="symptoms-list">
                      {record.symptoms.map((symptom, idx) => (
                        <span key={idx} className="symptom-tag">{symptom}</span>
                      ))}
                    </div>
                  </div>
                )}
                {record.medications && record.medications.length > 0 && (
                  <div className="detail-row">
                    <strong>Medications:</strong>
                    <ul className="medications-list">
                      {record.medications.map((med, idx) => (
                        <li key={idx}>
                          {med.name} - {med.dosage}, {med.frequency}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.notes && (
                  <div className="detail-row">
                    <strong>Notes:</strong>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientMedicalRecords
