import React, { useState, useEffect } from 'react'
import { getNurseProfile, updateNurseProfile, changePassword } from '../services/nurseApi'
import './NurseProfile.css'

const NurseProfile = () => {
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getNurseProfile()
      if (response.success) {
        setProfile(response.data)
        setFormData({ 
          name: response.data.name, 
          phone: response.data.phone || '',
          email: response.data.email || ''
        })
      } else {
        setError(response.message || 'Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError(error.response?.data?.message || 'Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await updateNurseProfile(formData)
      if (response.success) {
        alert('Profile updated successfully!')
        setEditMode(false)
        fetchProfile()
      } else {
        alert(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(error.response?.data?.message || 'Error updating profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    try {
      const response = await changePassword({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      })
      if (response.success) {
        alert('Password changed successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        alert(response.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert(error.response?.data?.message || 'Error changing password')
    }
  }

  if (loading) {
    return (
      <div className="nurse-profile">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="nurse-profile">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProfile} className="btn-retry">Retry</button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="nurse-profile">
        <div className="error-message">
          <p>No profile data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="nurse-profile">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Profile Information</h2>
          {editMode ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input type="text" value={profile.role} disabled />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <input type="text" value={profile.status} disabled />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <strong>User ID:</strong>
                <span>{profile.userId || 'N/A'}</span>
              </div>
              <div className="info-item">
                <strong>Name:</strong>
                <span>{profile.name}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong>
                <span>{profile.email}</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <span>{profile.phone || 'Not set'}</span>
              </div>
              <div className="info-item">
                <strong>Role:</strong>
                <span className="role-badge">{profile.role}</span>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <span className={`status-badge status-${profile.status?.toLowerCase()}`}>
                  {profile.status || 'Active'}
                </span>
              </div>
              {profile.lastLogin && (
                <div className="info-item">
                  <strong>Last Login:</strong>
                  <span>{new Date(profile.lastLogin).toLocaleString()}</span>
                </div>
              )}
              <button className="btn-edit" onClick={() => setEditMode(true)}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password:</label>
              <input 
                type="password" 
                value={passwordData.currentPassword} 
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                required 
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                required 
                placeholder="Enter new password (min 6 characters)"
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password:</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                required 
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
            <div className="password-requirements">
              <p>Password Requirements:</p>
              <ul>
                <li>Minimum 6 characters</li>
                <li>Use a mix of letters, numbers, and symbols</li>
                <li>Avoid common passwords</li>
              </ul>
            </div>
            <button type="submit" className="btn-password">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NurseProfile
