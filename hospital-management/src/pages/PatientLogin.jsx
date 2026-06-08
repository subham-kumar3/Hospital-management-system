import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, User, Mail, Calendar, Activity } from 'lucide-react'
import api from '../services/api'
import './PatientLogin.css'

const PatientLogin = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login existing patient
        const response = await api.post('/auth/login', {
          email: formData.email || formData.phone,
          password: formData.password
        })

        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.data))
          navigate('/patient/dashboard')
        }
      } else {
        // Register new patient
        const response = await api.post('/auth/register', {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: 'Patient'
        })

        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.data))
          navigate('/patient/dashboard')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="patient-login-page">
      <div className="patient-login-container">
        <div className="patient-login-card">
          <div className="patient-login-header">
            <div className="logo-icon">
              <Calendar size={48} />
            </div>
            <h1>Book Appointment</h1>
            <p>{isLogin ? 'Login to book your appointment' : 'Register to get started'}</p>
          </div>

          {error && (
            <div className="error-message">
              <Activity size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="patient-form">
            {!isLogin && (
              <div className="form-group">
                <User size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <Phone size={20} />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <Mail size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <Lock size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <div className="toggle-mode">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                {isLogin ? ' Register' : ' Login'}
              </button>
            </p>
          </div>

          <div className="back-link">
            <button onClick={() => navigate('/')} className="back-btn">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientLogin
