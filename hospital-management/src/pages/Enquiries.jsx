import React, { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { enquiryService } from '../services'

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

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageSquare size={32} /> Enquiries
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Add Enquiry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={{ padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={{ padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required style={{ gridColumn: '1 / -1', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
            <textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows="4" style={{ gridColumn: '1 / -1', padding: '12px', border: '2px solid #dee2e6', borderRadius: '8px' }} />
          </div>
          <button type="submit" style={{ marginTop: '20px', padding: '12px 30px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Submit Enquiry</button>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {enquiries.map(enquiry => (
              <div key={enquiry._id} style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#2c3e50' }}>{enquiry.subject}</h3>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', background: enquiry.priority === 'High' ? '#f8d7da' : enquiry.priority === 'Medium' ? '#fff3cd' : '#d4edda', color: enquiry.priority === 'High' ? '#721c24' : enquiry.priority === 'Medium' ? '#856404' : '#155724', fontWeight: '600', fontSize: '0.85rem' }}>
                    {enquiry.priority}
                  </span>
                </div>
                <p style={{ color: '#7f8c8d', margin: '5px 0' }}><strong>From:</strong> {enquiry.name} | {enquiry.phone}</p>
                <p style={{ margin: '10px 0' }}>{enquiry.message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', background: enquiry.status === 'Resolved' ? '#d4edda' : enquiry.status === 'In Progress' ? '#cce5ff' : '#fff3cd', color: enquiry.status === 'Resolved' ? '#155724' : enquiry.status === 'In Progress' ? '#004085' : '#856404', fontWeight: '600', fontSize: '0.85rem' }}>
                    {enquiry.status}
                  </span>
                  <div>
                    {enquiry.status === 'New' && <button onClick={() => updateStatus(enquiry._id, 'In Progress')} style={{ padding: '6px 12px', marginRight: '8px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Mark In Progress</button>}
                    {enquiry.status !== 'Resolved' && <button onClick={() => updateStatus(enquiry._id, 'Resolved')} style={{ padding: '6px 12px', background: '#11998e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Mark Resolved</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Enquiries
