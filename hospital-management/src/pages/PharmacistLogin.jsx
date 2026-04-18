import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Pill, Mail, Lock, Loader } from 'lucide-react'
import './Login.css'

const PharmacistLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        if (user.role === 'Pharmacist') {
          navigate('/pharmacy-dashboard')
        } else {
          setError('Access denied. Pharmacist role required.')
        }
      } else {
        setError(result.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Pill size={64} strokeWidth={2.5} color="#16a34a" />
              </div>
              <h1>Pharmacy Module</h1>
              <p>Hospital Management System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacist@hospital.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Logging in...
                </>
              ) : (
                <>
                  <Pill size={18} />
                  Login to Pharmacy
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <a href="/login">Back to Main Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacistLogin
