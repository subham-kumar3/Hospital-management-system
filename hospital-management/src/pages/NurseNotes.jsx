import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { getAssignedPatients, addNurseNote, getPatientNotes } from '../services/nurseApi'
import './NurseNotes.css'

const NurseNotes = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ noteType: 'General', note: '' })

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) fetchNotes()
  }, [selectedPatient])

  const fetchPatients = async () => {
    try {
      const response = await getAssignedPatients()
      if (response.success) setPatients(response.data)
    } catch (error) { console.error('Error:', error) }
  }

  const fetchNotes = async () => {
    try {
      const response = await getPatientNotes(selectedPatient)
      if (response.success) setNotes(response.data)
    } catch (error) { console.error('Error:', error) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addNurseNote({ patientId: selectedPatient, ...formData })
      setFormData({ noteType: 'General', note: '' })
      setShowForm(false)
      fetchNotes()
      alert('Note added successfully!')
    } catch (error) { alert('Error adding note') }
  }

  return (
    <div className="nurse-notes">
      <div className="page-header">
        <h1>Patient Notes & Observations</h1>
        <p>Add and view patient care notes</p>
      </div>

      <div className="notes-controls">
        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
          <option value="">Select a patient...</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.name} - Room {p.roomNumber || 'N/A'}</option>
          ))}
        </select>
        {selectedPatient && (
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} /> {showForm ? 'Cancel' : 'Add Note'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="note-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Note Type:</label>
            <select value={formData.noteType} onChange={(e) => setFormData({...formData, noteType: e.target.value})}>
              <option value="General">General</option>
              <option value="Observation">Observation</option>
              <option value="Condition">Condition</option>
              <option value="Update">Update</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div className="form-group">
            <label>Note:</label>
            <textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} required rows="4"></textarea>
          </div>
          <button type="submit" className="btn-submit">Add Note</button>
        </form>
      )}

      {notes.length > 0 && (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note._id} className={`note-card ${note.noteType.toLowerCase()}`}>
              <div className="note-header">
                <span className="note-type">{note.noteType}</span>
                <span className="note-date">{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="note-content">{note.note}</p>
              <p className="note-author">- {note.nurse?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NurseNotes
