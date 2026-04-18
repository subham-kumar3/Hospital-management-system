import React, { useState, useEffect } from 'react'
import { ClipboardList, User, Calendar } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import './PatientPrescriptions.css'

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await patientApi.getPrescriptions()
      if (response.data.success) {
        setPrescriptions(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading prescriptions...</div>

  return (
    <div className="patient-prescriptions">
      <div className="page-header">
        <h1>My Prescriptions</h1>
      </div>

      {prescriptions.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={64} />
          <h3>No prescriptions found</h3>
          <p>Your prescriptions will appear here</p>
        </div>
      ) : (
        <div className="prescriptions-list">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="prescription-card">
              <div className="rx-header">
                <div className="rx-doctor">
                  <User size={20} />
                  <div>
                    <h3>Dr. {rx.doctor?.name}</h3>
                    <p>{rx.doctor?.specialization}</p>
                  </div>
                </div>
                <span className={`status-badge ${rx.status.toLowerCase()}`}>
                  {rx.status}
                </span>
              </div>

              <div className="rx-info">
                <div className="info-item">
                  <Calendar size={16} />
                  <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <strong>Diagnosis:</strong>
                  <p>{rx.diagnosis}</p>
                </div>
              </div>

              <div className="medications-section">
                <h4>Medications:</h4>
                <div className="medications-table">
                  <div className="med-header">
                    <span>Name</span>
                    <span>Dosage</span>
                    <span>Frequency</span>
                    <span>Duration</span>
                  </div>
                  {rx.medicines?.map((med, idx) => (
                    <div key={idx} className="med-row">
                      <span>{med.name}</span>
                      <span>{med.dosage}</span>
                      <span>{med.frequency}</span>
                      <span>{med.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {rx.notes && (
                <div className="rx-notes">
                  <strong>Notes:</strong>
                  <p>{rx.notes}</p>
                </div>
              )}

              {rx.followUpDate && (
                <div className="follow-up">
                  <strong>Follow-up Date:</strong>
                  <span>{new Date(rx.followUpDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientPrescriptions
