import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, X } from 'lucide-react'
import { doctorService } from '../services'
import './Doctors.css'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [viewingDoctor, setViewingDoctor] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    email: '',
    department: '',
    status: 'Active',
    consultationFee: ''
  })

  // Load doctors on mount
  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorService.getAllDoctors()
      if (response.success && response.data.length > 0) {
        setDoctors(response.data)
      } else {
        // Fallback to demo data - 6 doctors from different departments
        setDoctors([
          { 
            _id: '1', 
            name: 'Dr. Sarah Johnson', 
            specialization: 'Cardiology', 
            qualification: 'MD, DM, FACC', 
            experience: 15,
            experienceText: '15 years', 
            phone: '+1 234-567-8901', 
            email: 'sarah.johnson@hospital.com', 
            department: 'Cardiology', 
            status: 'Active',
            consultationFee: 600,
            bio: 'Expert in interventional cardiology with focus on minimally invasive procedures.',
            image: ''
          },
          { 
            _id: '2', 
            name: 'Dr. Rajesh Kumar', 
            specialization: 'Neurology', 
            qualification: 'MBBS, MD, DM', 
            experience: 18,
            experienceText: '18 years', 
            phone: '+1 234-567-8902', 
            email: 'rajesh.kumar@hospital.com', 
            department: 'Neurology', 
            status: 'Active',
            consultationFee: 550,
            bio: 'Specialist in stroke management and movement disorders.',
            image: ''
          },
          { 
            _id: '3', 
            name: 'Dr. Maria Garcia', 
            specialization: 'Orthopedics', 
            qualification: 'MS, MCh, FRCS', 
            experience: 12,
            experienceText: '12 years', 
            phone: '+1 234-567-8903', 
            email: 'maria.garcia@hospital.com', 
            department: 'Orthopedics', 
            status: 'Active',
            consultationFee: 500,
            bio: 'Expert in joint replacement surgeries and sports medicine.',
            image: ''
          },
          { 
            _id: '4', 
            name: 'Dr. Amit Patel', 
            specialization: 'Pediatrics', 
            qualification: 'MBBS, MD (Pediatrics)', 
            experience: 10,
            experienceText: '10 years', 
            phone: '+1 234-567-8904', 
            email: 'amit.patel@hospital.com', 
            department: 'Pediatrics', 
            status: 'Active',
            consultationFee: 450,
            bio: 'Dedicated to providing comprehensive care for children of all ages.',
            image: ''
          },
          { 
            _id: '5', 
            name: 'Dr. Jennifer Lee', 
            specialization: 'Dermatology', 
            qualification: 'MD, DDVL', 
            experience: 8,
            experienceText: '8 years', 
            phone: '+1 234-567-8905', 
            email: 'jennifer.lee@hospital.com', 
            department: 'Dermatology', 
            status: 'Active',
            consultationFee: 400,
            bio: 'Specialist in cosmetic dermatology and laser treatments.',
            image: ''
          },
          { 
            _id: '6', 
            name: 'Dr. David Smith', 
            specialization: 'General Surgery', 
            qualification: 'MBBS, MS, MCh', 
            experience: 20,
            experienceText: '20 years', 
            phone: '+1 234-567-8906', 
            email: 'david.smith@hospital.com', 
            department: 'Surgery', 
            status: 'Active',
            consultationFee: 700,
            bio: 'Senior surgeon with expertise in laparoscopic and robotic surgeries.',
            image: ''
          }
        ])
      }
    } catch (error) {
      console.error('Error loading doctors:', error)
      // Use demo data as fallback - 6 doctors from different departments
      setDoctors([
        { 
          _id: '1', 
          name: 'Dr. Sarah Johnson', 
          specialization: 'Cardiology', 
          qualification: 'MD, DM, FACC', 
          experience: 15,
          experienceText: '15 years', 
          phone: '+1 234-567-8901', 
          email: 'sarah.johnson@hospital.com', 
          department: 'Cardiology', 
          status: 'Active',
          consultationFee: 600,
          bio: 'Expert in interventional cardiology with focus on minimally invasive procedures.',
          image: ''
        },
        { 
          _id: '2', 
          name: 'Dr. Rajesh Kumar', 
          specialization: 'Neurology', 
          qualification: 'MBBS, MD, DM', 
          experience: 18,
          experienceText: '18 years', 
          phone: '+1 234-567-8902', 
          email: 'rajesh.kumar@hospital.com', 
          department: 'Neurology', 
          status: 'Active',
          consultationFee: 550,
          bio: 'Specialist in stroke management and movement disorders.',
          image: ''
        },
        { 
          _id: '3', 
          name: 'Dr. Maria Garcia', 
          specialization: 'Orthopedics', 
          qualification: 'MS, MCh, FRCS', 
          experience: 12,
          experienceText: '12 years', 
          phone: '+1 234-567-8903', 
          email: 'maria.garcia@hospital.com', 
          department: 'Orthopedics', 
          status: 'Active',
          consultationFee: 500,
          bio: 'Expert in joint replacement surgeries and sports medicine.',
          image: ''
        },
        { 
          _id: '4', 
          name: 'Dr. Amit Patel', 
          specialization: 'Pediatrics', 
          qualification: 'MBBS, MD (Pediatrics)', 
          experience: 10,
          experienceText: '10 years', 
          phone: '+1 234-567-8904', 
          email: 'amit.patel@hospital.com', 
          department: 'Pediatrics', 
          status: 'Active',
          consultationFee: 450,
          bio: 'Dedicated to providing comprehensive care for children of all ages.',
          image: ''
        },
        { 
          _id: '5', 
          name: 'Dr. Jennifer Lee', 
          specialization: 'Dermatology', 
          qualification: 'MD, DDVL', 
          experience: 8,
          experienceText: '8 years', 
          phone: '+1 234-567-8905', 
          email: 'jennifer.lee@hospital.com', 
          department: 'Dermatology', 
          status: 'Active',
          consultationFee: 400,
          bio: 'Specialist in cosmetic dermatology and laser treatments.',
          image: ''
        },
        { 
          _id: '6', 
          name: 'Dr. David Smith', 
          specialization: 'General Surgery', 
          qualification: 'MBBS, MS, MCh', 
          experience: 20,
          experienceText: '20 years', 
          phone: '+1 234-567-8906', 
          email: 'david.smith@hospital.com', 
          department: 'Surgery', 
          status: 'Active',
          consultationFee: 700,
          bio: 'Senior surgeon with expertise in laparoscopic and robotic surgeries.',
          image: ''
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      department: doctor.department || '',
      status: doctor.status || 'Active',
      consultationFee: doctor.consultationFee || ''
    })
    setShowModal(true)
  }

  const handleViewProfile = (doctor) => {
    setViewingDoctor(doctor)
    setShowProfileModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const doctorData = {
      ...formData,
      experience: parseInt(formData.experience) || 0
    }

    try {
      if (editingDoctor) {
        // Update existing doctor
        if (editingDoctor._id) {
          await doctorService.updateDoctor(editingDoctor._id, doctorData)
        }
      } else {
        // Create new doctor
        await doctorService.createDoctor(doctorData)
      }
      
      // Show success toast
      showToast(editingDoctor ? '✓ Doctor updated successfully!' : '✓ Doctor added successfully!', 'success')
      
      setShowModal(false)
      loadDoctors()
      resetForm()
    } catch (error) {
      console.error('Error saving doctor:', error)
      
      // Show error toast
      showToast('✗ Failed to save doctor. Please try again.', 'error')
      
      // Still add to local state for demo
      if (!editingDoctor) {
        const newDoctor = {
          _id: Date.now().toString(),
          ...doctorData,
          experienceText: `${doctorData.experience} years`
        }
        setDoctors([...doctors, newDoctor])
        showToast('✓ Doctor added locally (demo mode)', 'success')
      }
      setShowModal(false)
    }
  }

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div')
    toast.className = `toast-${type}`
    toast.style.cssText = `
      position: fixed;
      inset-block-start: 20px;
      inset-inline-end: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      qualification: '',
      experience: '',
      phone: '',
      email: '',
      department: '',
      status: 'Active',
      consultationFee: ''
    })
    setEditingDoctor(null)
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="doctors-page">
      {/* Header */}
      <div className="page-header-modern">
        <div>
          <h1>👨‍⚕️ Doctor Management</h1>
          <p className="subtitle">Manage doctors and their schedules</p>
        </div>
        <button className="btn-create" onClick={() => {
          resetForm()
          setShowModal(true)
        }}>
          <Plus size={20} />
          Add New Doctor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card-modern stat-total">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{doctors.length}</h3>
            <p>Total Doctors</p>
          </div>
        </div>
        <div className="stat-card-modern stat-confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{doctors.filter(d => d.status === 'Active').length}</h3>
            <p>Active Doctors</p>
          </div>
        </div>
        <div className="stat-card-modern stat-pending">
          <div className="stat-icon">🏖️</div>
          <div className="stat-info">
            <h3>{doctors.filter(d => d.status === 'On Leave').length}</h3>
            <p>On Leave</p>
          </div>
        </div>
        <div className="stat-card-modern stat-cancelled">
          <div className="stat-icon">🏥</div>
          <div className="stat-info">
            <h3>{[...new Set(doctors.map(d => d.department))].length}</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="controls-bar">
        <div className="search-container">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="Search by doctor name, specialization or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading doctors...</div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.length === 0 ? (
            <div className="no-doctors">No doctors found</div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id || doctor.id} className="doctor-card">
                <div className="doctor-header">
                  <div className="doctor-avatar">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className={`status-badge ${doctor.status.toLowerCase().replace(' ', '-')}`}>
                    {doctor.status}
                  </span>
                </div>
                
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="qualification">{doctor.qualification}</p>
                  
                  <div className="doctor-details">
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <Mail size={16} />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{doctor.department}</span>
                    </div>
                  </div>

                  <div className="experience-badge">
                    {doctor.experienceText || `${doctor.experience || 0} years`} Experience
                  </div>
                  
                  {doctor.consultationFee && (
                    <div className="consultation-fee">
                      Consultation: ${doctor.consultationFee}
                    </div>
                  )}
                </div>

                <div className="doctor-actions">
                  <button className="btn-action" onClick={() => handleViewProfile(doctor)}>
                    View Profile
                  </button>
                  <button 
                    className="btn-icon-edit" 
                    title="Edit"
                    onClick={() => handleOpenEdit(doctor)}
                  >
                    <Edit size={18} />
                  </button>
                  <button className="btn-icon-delete" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item full-width">
                      <label>Doctor Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter doctor name"
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Specialization *</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        placeholder="e.g., Cardiology"
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Qualification *</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        placeholder="e.g., MD, DM"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Professional Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Department *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Surgery">Surgery</option>
                      </select>
                    </div>
                    <div className="detail-item">
                      <label>Status *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="detail-item">
                      <label>Experience (years) *</label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="e.g., 15"
                        min="0"
                        max="60"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 234-567-8901"
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="doctor@hospital.com"
                        required
                      />
                    </div>
                    <div className="detail-item">
                      <label>Consultation Fee ($)</label>
                      <input
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                        placeholder="500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile View Modal */}
      {showProfileModal && viewingDoctor && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Doctor Profile</h2>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="profile-header">
                <div className="profile-avatar">
                  {viewingDoctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="profile-info">
                  <h3>{viewingDoctor.name}</h3>
                  <p className="specialization">{viewingDoctor.specialization}</p>
                  <p className="qualification">{viewingDoctor.qualification}</p>
                  <span className={`status-badge ${viewingDoctor.status.toLowerCase().replace(' ', '-')}`}>
                    {viewingDoctor.status}
                  </span>
                </div>
              </div>

              <div className="profile-section">
                <h4>About</h4>
                <p className="bio">
                  {viewingDoctor.bio || 'Experienced healthcare professional dedicated to providing excellent patient care.'}
                </p>
              </div>

              <div className="profile-section">
                <h4>Professional Details</h4>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Department:</span>
                    <span className="value">{viewingDoctor.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Experience:</span>
                    <span className="value">{viewingDoctor.experienceText || `${viewingDoctor.experience} years`}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Consultation Fee:</span>
                    <span className="value">${viewingDoctor.consultationFee}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h4>Contact Information</h4>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{viewingDoctor.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{viewingDoctor.email}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowProfileModal(false)
                    handleOpenEdit(viewingDoctor)
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors
