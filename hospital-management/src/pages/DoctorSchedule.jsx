import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { doctorService } from '../services'

const DoctorSchedule = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors()
      if (response.success) setDoctors(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Clock size={32} /> Doctor Schedule
      </h1>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {doctors.map(doctor => (
            <div key={doctor._id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{doctor.name}</h3>
              <p style={{ color: '#7f8c8d', margin: '5px 0' }}><strong>Specialization:</strong> {doctor.specialization}</p>
              <p style={{ color: '#7f8c8d', margin: '5px 0' }}><strong>Department:</strong> {doctor.department}</p>
              <p style={{ color: '#7f8c8d', margin: '5px 0' }}><strong>Experience:</strong> {doctor.experience} years</p>
              <p style={{ color: '#7f8c8d', margin: '5px 0' }}><strong>Fee:</strong> ₹{doctor.consultationFee}</p>
              <p style={{ margin: '10px 0 5px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '12px', background: doctor.status === 'Active' ? '#d4edda' : '#f8d7da', color: doctor.status === 'Active' ? '#155724' : '#721c24', fontWeight: '600' }}>
                  {doctor.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorSchedule
