import React, { useState } from 'react'
import { Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authProfileService } from '../services'

const ReceptionistProfile = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const response = await authProfileService.updateProfile(profileData)
      if (response.success) {
        setMessage('Profile updated successfully')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await authProfileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (response.success) {
        setMessage('Password changed successfully')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password')
    }
  }

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Settings size={32} /> Profile Settings
      </h1>

      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'grid', gap: '30px', maxWidth: '800px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Update Profile</h2>
          <form onSubmit={handleProfileUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Update Profile
            </button>
          </form>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReceptionistProfile
