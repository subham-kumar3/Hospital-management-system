import React, { useState, useEffect } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { appointmentService, doctorService, patientService } from '../services'
import { onAppointmentUpdate } from '../services/socketService'

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    
    // Setup real-time listener for appointments
    const cleanup = onAppointmentUpdate((data) => {
      console.log('🔄 Real-time appointment update:', data.action)
      fetchData() // Refresh appointments
    })
    
    // Cleanup listener on unmount
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const fetchData = async () => {
    try {
      const [aptRes, docRes, patRes] = await Promise.all([
        appointmentService.getAllAppointments(),
        doctorService.getAllDoctors(),
        patientService.getAllPatients()
      ])
      if (aptRes.success) setAppointments(aptRes.data)
      if (docRes.success) setDoctors(docRes.data)
      if (patRes.success) setPatients(patRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await appointmentService.createAppointment(formData)
      setShowForm(false)
      fetchData()
      setFormData({ patient: '', doctor: '', department: '', date: '', time: '', type: 'Consultation', notes: '' })
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointment(id, { status })
      fetchData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={32} /> Appointments
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Book Appointment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Book New Appointment</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Patient</label>
              <select value={formData.patient} onChange={(e) => setFormData({...formData, patient: e.target.value})} required style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Doctor</label>
              <select value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value, department: doctors.find(d => d._id === e.target.value)?.department})} required style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time</label>
              <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}>
                <option>Check-up</option>
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>
          <button type="submit" style={{ marginTop: '20px', padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Book Appointment</button>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white'
              }}>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Date</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Time</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Patient</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Doctor</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Type</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Status</th>
                <th style={{ 
                  padding: '14px 12px', 
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px' }}>{new Date(apt.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{apt.time}</td>
                  <td style={{ padding: '12px' }}>{apt.patient?.name}</td>
                  <td style={{ padding: '12px' }}>{apt.doctor?.name}</td>
                  <td style={{ padding: '12px' }}>{apt.type}</td>
                  <td style={{ padding: '12px' }}><span style={{ padding: '4px 12px', borderRadius: '12px', background: apt.status === 'Confirmed' ? '#d4edda' : apt.status === 'Pending' ? '#fff3cd' : '#f8d7da', color: apt.status === 'Confirmed' ? '#155724' : apt.status === 'Pending' ? '#856404' : '#721c24' }}>{apt.status}</span></td>
                  <td style={{ padding: '12px' }}>
                    {apt.status === 'Pending' && <button onClick={() => updateStatus(apt._id, 'Confirmed')} style={{ padding: '6px 12px', marginRight: '8px', background: '#11998e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirm</button>}
                    {apt.status !== 'Cancelled' && <button onClick={() => updateStatus(apt._id, 'Cancelled')} style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ReceptionistAppointments
