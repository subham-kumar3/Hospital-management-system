import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import { getAssignedPatients, getPatientMedications, markMedicationGiven } from '../services/nurseApi'
import './NurseMedications.css'

const NurseMedications = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [medications, setMedications] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) fetchMedications()
  }, [selectedPatient, filterStatus])

  const fetchPatients = async () => {
    try {
      const response = await getAssignedPatients()
      if (response.success) setPatients(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchMedications = async () => {
    setLoading(true)
    try {
      const params = filterStatus ? { status: filterStatus } : {}
      const response = await getPatientMedications(selectedPatient, params)
      if (response.success) setMedications(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkGiven = async (medId) => {
    try {
      await markMedicationGiven(medId)
      fetchMedications()
      alert('Medication marked as given!')
    } catch (error) {
      alert('Error updating medication')
    }
  }

  return (
    <div className="nurse-medications">
      <div className="page-header">
        <h1>Medication Tracking</h1>
        <p>Track and administer patient medications</p>
      </div>

      <div className="med-controls">
        <div className="selector">
          <label>Select Patient:</label>
          <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
            <option value="">Choose a patient...</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} - Room {p.roomNumber || 'N/A'}</option>
            ))}
          </select>
        </div>
        <div className="filter">
          <label>Filter:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Given">Given</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading medications...</div>
      ) : medications.length > 0 ? (
        <div className="med-list">
          {medications.map((med) => (
            <div key={med._id} className={`med-card ${med.status.toLowerCase()}`}>
              <div className="med-header">
                <h3>{med.medicine.name}</h3>
                <span className={`status-badge ${med.status.toLowerCase()}`}>
                  {med.status === 'Given' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  {med.status}
                </span>
              </div>
              <div className="med-details">
                <p><strong>Dosage:</strong> {med.medicine.dosage}</p>
                <p><strong>Frequency:</strong> {med.medicine.frequency}</p>
                {med.medicine.instructions && <p><strong>Instructions:</strong> {med.medicine.instructions}</p>}
                {med.administeredAt && <p><strong>Given at:</strong> {new Date(med.administeredAt).toLocaleString()}</p>}
              </div>
              {med.status === 'Pending' && (
                <button className="btn-give" onClick={() => handleMarkGiven(med._id)}>
                  Mark as Given
                </button>
              )}
            </div>
          ))}
        </div>
      ) : selectedPatient ? (
        <div className="empty-state">No medications found</div>
      ) : null}
    </div>
  )
}

export default NurseMedications
