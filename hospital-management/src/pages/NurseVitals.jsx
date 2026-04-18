import React, { useState, useEffect } from 'react'
import { Plus, Activity } from 'lucide-react'
import { getAssignedPatients, addVitals, getPatientVitals } from '../services/nurseApi'
import './NurseVitals.css'

const NurseVitals = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [vitalsHistory, setVitalsHistory] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    temperature: '',
    systolic: '',
    diastolic: '',
    pulse: '',
    oxygenLevel: '',
    respiratoryRate: '',
    notes: ''
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await getAssignedPatients()
      if (response.success) setPatients(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchVitalsHistory = async (patientId) => {
    try {
      const response = await getPatientVitals(patientId)
      if (response.success) setVitalsHistory(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        patientId: selectedPatient,
        temperature: parseFloat(formData.temperature),
        bloodPressure: {
          systolic: parseFloat(formData.systolic),
          diastolic: parseFloat(formData.diastolic)
        },
        pulse: parseInt(formData.pulse),
        oxygenLevel: parseFloat(formData.oxygenLevel),
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : undefined,
        notes: formData.notes
      }
      
      const response = await addVitals(data)
      if (response.success) {
        alert('Vitals recorded successfully!')
        setFormData({ temperature: '', systolic: '', diastolic: '', pulse: '', oxygenLevel: '', respiratoryRate: '', notes: '' })
        setShowForm(false)
        fetchVitalsHistory(selectedPatient)
      }
    } catch (error) {
      alert('Error recording vitals')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId)
    fetchVitalsHistory(patientId)
  }

  return (
    <div className="nurse-vitals">
      <div className="page-header">
        <h1>Patient Vitals</h1>
        <p>Record and monitor patient vital signs</p>
      </div>

      <div className="vitals-container">
        <div className="patient-selector">
          <label>Select Patient:</label>
          <select value={selectedPatient} onChange={(e) => handlePatientSelect(e.target.value)}>
            <option value="">Choose a patient...</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.name} - Room {p.roomNumber || 'N/A'}</option>
            ))}
          </select>
          {selectedPatient && (
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              <Plus size={20} />
              {showForm ? 'Cancel' : 'Record Vitals'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="vitals-form-card">
            <h2><Activity size={24} /> Record New Vitals</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Temperature (°F)*</label>
                  <input type="number" step="0.1" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Blood Pressure - Systolic*</label>
                  <input type="number" value={formData.systolic} onChange={(e) => setFormData({...formData, systolic: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Blood Pressure - Diastolic*</label>
                  <input type="number" value={formData.diastolic} onChange={(e) => setFormData({...formData, diastolic: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Pulse (bpm)*</label>
                  <input type="number" value={formData.pulse} onChange={(e) => setFormData({...formData, pulse: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Oxygen Level (%)*</label>
                  <input type="number" step="0.1" value={formData.oxygenLevel} onChange={(e) => setFormData({...formData, oxygenLevel: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Respiratory Rate</label>
                  <input type="number" value={formData.respiratoryRate} onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3"></textarea>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Recording...' : 'Record Vitals'}
              </button>
            </form>
          </div>
        )}

        {selectedPatient && vitalsHistory.length > 0 && (
          <div className="vitals-history">
            <h2>Vitals History</h2>
            <table>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Temp (°F)</th>
                  <th>BP (mmHg)</th>
                  <th>Pulse</th>
                  <th>O2 Level</th>
                  <th>Resp. Rate</th>
                </tr>
              </thead>
              <tbody>
                {vitalsHistory.slice(0, 20).map((vital) => (
                  <tr key={vital._id}>
                    <td>{new Date(vital.recordedAt).toLocaleString()}</td>
                    <td>{vital.temperature}</td>
                    <td>{vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}</td>
                    <td>{vital.pulse}</td>
                    <td>{vital.oxygenLevel}%</td>
                    <td>{vital.respiratoryRate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default NurseVitals
