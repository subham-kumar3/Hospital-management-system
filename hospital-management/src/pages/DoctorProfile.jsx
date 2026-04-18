import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Activity, FileText, Edit2, Save, X } from 'lucide-react'
import './DoctorProfile.css'

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Mock profile data (connect to backend API later)
      const profileData = {
        name: userData.name || 'Dr. John Doe',
        email: userData.email || 'doctor@hospital.com',
        phone: '+91 9876543210',
        specialization: 'Cardiology',
        qualification: 'MD, DM',
        experience: 15,
        department: 'Cardiology',
        consultationFee: 500,
        bio: 'Experienced cardiologist with 15+ years of practice.'
      }
      
      setDoctor(profileData)
      setFormData(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      // TODO: Call API to update profile
      setDoctor(formData)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData(doctor)
    setIsEditing(false)
  }

  if (loading) {
    return <div className="loading-container">Loading profile...</div>
  }

  return (
    <div className="doctor-profile-page">
      <div className="page-header">
        <h1>👨‍⚕️ My Profile</h1>
        <button 
          className="btn-edit"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X size={18} /> : <Edit2 size={18} />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card-main">
          <div className="profile-avatar-section">
            <div className="avatar-large">
              <User size={64} />
            </div>
            <h2>{doctor?.name}</h2>
            <p className="specialization">{doctor?.specialization}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <Activity size={24} />
              <div>
                <strong>{doctor?.experience}+</strong>
                <span>Years Experience</span>
              </div>
            </div>
            <div className="stat-item">
              <FileText size={24} />
              <div>
                <strong>{doctor?.qualification}</strong>
                <span>Qualification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-info-card">
          <h3>Personal Information</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <label>
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.name}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.email}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.phone}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <Activity size={16} />
                Specialization
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.specialization}</p>
              )}
            </div>

            <div className="info-item">
              <label>
                <FileText size={16} />
                Qualification
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.qualification}</p>
              )}
            </div>

            <div className="info-item">
              <label>Experience (Years)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{doctor?.experience} years</p>
              )}
            </div>

            <div className="info-item full-width">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                />
              ) : (
                <p>{doctor?.bio}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button className="btn-save" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
