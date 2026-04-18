import React from 'react'
import { useAuth } from '../context/AuthContext'

const AdminProfile = () => {
  const { user } = useAuth()

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: '2rem' }}><h1>Profile</h1></div>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem' }}>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  )
}

export default AdminProfile
