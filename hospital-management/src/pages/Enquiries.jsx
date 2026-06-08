import React, { useState, useEffect } from 'react'
import { MessageSquare, Plus, User, Phone, Mail } from 'lucide-react'
import { enquiryService } from '../services'
import './Enquiries.css'

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    priority: 'Medium'
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryService.getAllEnquiries()
      if (response.success) setEnquiries(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await enquiryService.createEnquiry(formData)
      setShowForm(false)
      fetchEnquiries()
      setFormData({ name: '', phone: '', email: '', subject: '', message: '', priority: 'Medium' })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await enquiryService.updateEnquiry(id, { status })
      fetchEnquiries()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading enquiries...</p>
      </div>
    )
  }

  return (
    <div className="enquiries-page">
      <div className="enquiries-header">
        <div>
          <h1>
            <MessageSquare size={28} />
            Enquiries
          </h1>
          <p className="subtitle">Manage patient queries and requests</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary"
        >
          <Plus size={18} />
          <span>{showForm ? 'Cancel' : 'Add Enquiry'}</span>
        </button>
      </div>

      {showForm && (
        <div className="enquiry-form-container">
          <h2>New Enquiry</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  required 
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Priority *</label>
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Subject *</label>
                <input 
                  type="text" 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  required 
                  placeholder="Enter subject"
                />
              </div>
              <div className="form-group full-width">
                <label>Message *</label>
                <textarea 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  required 
                  rows="4" 
                  placeholder="Enter message"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Submit Enquiry</button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="enquiries-list">
        {enquiries.length > 0 ? (
          enquiries.map(enquiry => (
            <div key={enquiry._id} className="enquiry-card">
              <div className="enquiry-header">
                <h3>{enquiry.subject}</h3>
                <span className={`priority-badge ${enquiry.priority.toLowerCase()}`}>
                  {enquiry.priority}
                </span>
              </div>
              
              <div className="enquiry-meta">
                <span>
                  <User size={14} />
                  {enquiry.name}
                </span>
                <span>
                  <Phone size={14} />
                  {enquiry.phone}
                </span>
                {enquiry.email && (
                  <span>
                    <Mail size={14} />
                    {enquiry.email}
                  </span>
                )}
              </div>

              <p className="enquiry-message">{enquiry.message}</p>

              <div className="enquiry-footer">
                <span className={`status-badge ${enquiry.status.toLowerCase().replace(' ', '-')}`}>
                  {enquiry.status}
                </span>
                <div className="enquiry-actions">
                  {enquiry.status === 'New' && (
                    <button 
                      onClick={() => updateStatus(enquiry._id, 'In Progress')} 
                      className="btn-action btn-progress"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {enquiry.status !== 'Resolved' && (
                    <button 
                      onClick={() => updateStatus(enquiry._id, 'Resolved')} 
                      className="btn-action btn-resolved"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <MessageSquare size={64} />
            <h3>No enquiries yet</h3>
            <p>Click "Add Enquiry" to create your first enquiry</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Enquiries
