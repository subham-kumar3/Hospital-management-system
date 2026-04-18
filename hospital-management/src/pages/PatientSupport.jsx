import React, { useState } from 'react'
import { HelpCircle, Phone, Mail, MapPin, Send } from 'lucide-react'
import './PatientSupport.css'

const PatientSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'General Inquiry'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ subject: '', message: '', category: 'General Inquiry' })
    }, 3000)
  }

  return (
    <div className="patient-support">
      <div className="page-header">
        <h1>Support & Help</h1>
      </div>

      <div className="support-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="contact-items">
            <div className="contact-item">
              <Phone size={24} />
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={24} />
              <div>
                <h3>Email</h3>
                <p>support@hospital.com</p>
              </div>
            </div>

            <div className="contact-item">
              <MapPin size={24} />
              <div>
                <h3>Address</h3>
                <p>123 Hospital Street, Medical City, MC 12345</p>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>How do I book an appointment?</h3>
              <p>Go to Appointments page and click "Book New Appointment" button. Fill in the details and submit.</p>
            </div>

            <div className="faq-item">
              <h3>How can I view my lab reports?</h3>
              <p>Navigate to Lab Reports section from the sidebar to view all your test results.</p>
            </div>

            <div className="faq-item">
              <h3>How do I cancel an appointment?</h3>
              <p>Go to Appointments page, find your upcoming appointment, and click the "Cancel" button.</p>
            </div>

            <div className="faq-item">
              <h3>Can I reschedule my appointment?</h3>
              <p>Yes, click the "Reschedule" button on your upcoming appointment and enter new date and time.</p>
            </div>
          </div>
        </div>

        <div className="query-form-card">
          <h2>Submit a Query</h2>
          
          {submitted ? (
            <div className="success-message">
              <HelpCircle size={48} />
              <h3>Query Submitted!</h3>
              <p>We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="query-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Appointment Issue">Appointment Issue</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Medical Records">Medical Records</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your query or issue"
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                <Send size={20} />
                Submit Query
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientSupport
