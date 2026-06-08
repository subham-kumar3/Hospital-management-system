import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Activity, Mail, Lock, Loader, Stethoscope } from 'lucide-react'
import './Login.css'

const Login = () => {
  console.log('🔍 Login Component Rendering!')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  console.log('✅ Login State:', { email, password, error, loading })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        // Data is already stored in localStorage by authService
        // Just redirect based on role
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        console.log('🔐 Login successful! User data:', user)
        console.log('👤 User role:', user.role)
        
        // Redirect based on role
        if (user.role === 'Doctor') {
          console.log('➡️ Redirecting to Doctor Dashboard')
          navigate('/doctor-dashboard')
        } else if (user.role === 'Patient') {
          console.log('➡️ Redirecting to Patient Portal')
          navigate('/patient/appointments')
        } else if (user.role === 'Nurse') {
          console.log('➡️ Redirecting to Nurse Dashboard')
          navigate('/nurse-dashboard')
        } else if (user.role === 'Pharmacist') {
          console.log('➡️ Redirecting to Pharmacy Dashboard')
          navigate('/pharmacy-dashboard')
        } else if (user.role === 'Receptionist') {
          console.log('➡️ Redirecting to Receptionist Dashboard')
          navigate('/receptionist-dashboard')
        } else if (user.role === 'Lab Technician') {
          console.log('➡️ Redirecting to Lab Dashboard')
          navigate('/lab-dashboard')
        } else if (user.role === 'Admin') {
          // Admin role
          console.log('➡️ Redirecting to Admin Dashboard')
          navigate('/admin/dashboard')
        } else {
          // Fallback for any other role
          console.log('➡️ Redirecting to Admin Dashboard (default)')
          navigate('/admin/dashboard')
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
    <>
      {console.log('🎨 Login Page JSX Rendering!')}
      <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Stethoscope size={64} strokeWidth={2.5} color="#d4af37" />
                <Activity 
                  size={28} 
                  strokeWidth={3} 
                  style={{ 
                    position: 'absolute', 
                    insetBlockEnd: '-5px', 
                    insetInlineEnd: '-5px',
                    color: '#e74c3c',
                    background: 'white',
                    borderRadius: '50%',
                    padding: '2px'
                  }} 
                />
              </div>
            </div>
            <h1>Hospital Management System</h1>
            <p>Please sign in to continue</p>
            {import.meta.env.DEV && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', lineHeight: 1.5 }}>
                Dev mode: API proxied to <code>localhost:5001</code>. LAN testing: set <code>VITE_API_URL</code> in <code>.env.development</code>
              </p>
            )}
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your email"
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

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>🔐 All Login Credentials</h3>
            
            {/* Admin Login */}
            <div className="login-section">
              <p><strong>👨‍💼 Admin Login:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> admin@hospital.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <button 
                onClick={() => { setEmail('admin@hospital.com'); setPassword('admin123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '15px'
                }}
              >
                Quick Login as Admin
              </button>
            </div>
            
            {/* Doctor Logins */}
            <div className="login-section">
              <p><strong>👨‍⚕️ Doctor Logins:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> dr.emily@hospital.com</p>
                <p><strong>Password:</strong> doctor123</p>
                <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>Dr. Emily - Cardiology Department</p>
              </div>
              <button 
                onClick={() => { setEmail('dr.emily@hospital.com'); setPassword('doctor123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Dr. Emily (Cardiology)
              </button>
              
              <div className="credentials-box" style={{ marginTop: '10px' }}>
                <p><strong>Email:</strong> dr.michael@hospital.com</p>
                <p><strong>Password:</strong> doctor123</p>
                <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>Dr. Michael - Neurology Department</p>
              </div>
              <button 
                onClick={() => { setEmail('dr.michael@hospital.com'); setPassword('doctor123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Dr. Michael (Neurology)
              </button>
            </div>
            
            {/* Nurse Logins */}
            <div className="login-section">
              <p><strong>👩‍⚕️ Nurse Logins:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> nurse.sarah@hospital.com</p>
                <p><strong>Password:</strong> nurse123</p>
              </div>
              <button 
                onClick={() => { setEmail('nurse.sarah@hospital.com'); setPassword('nurse123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Nurse Sarah
              </button>
              
              <div className="credentials-box" style={{ marginTop: '10px' }}>
                <p><strong>Email:</strong> nurse.james@hospital.com</p>
                <p><strong>Password:</strong> nurse123</p>
              </div>
              <button 
                onClick={() => { setEmail('nurse.james@hospital.com'); setPassword('nurse123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Nurse James
              </button>
            </div>
            
            {/* Pharmacy Login */}
            <div className="login-section">
              <p><strong>💊 Pharmacist Login:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> pharmacist@hospital.com</p>
                <p><strong>Password:</strong> pharmacy123</p>
              </div>
              <button 
                onClick={() => { setEmail('pharmacist@hospital.com'); setPassword('pharmacy123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Pharmacist
              </button>
            </div>

            {/* Lab Login */}
            <div className="login-section">
              <p><strong>🔬 Lab Technician Login:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> lab@hospital.com</p>
                <p><strong>Password:</strong> lab123</p>
              </div>
              <button 
                onClick={() => { setEmail('lab@hospital.com'); setPassword('lab123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Lab Technician
              </button>
            </div>

            {/* Receptionist Login */}
            <div className="login-section">
              <p><strong>👨‍💼 Receptionist Login:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> receptionist@hospital.com</p>
                <p><strong>Password:</strong> receptionist123</p>
              </div>
              <button 
                onClick={() => { setEmail('receptionist@hospital.com'); setPassword('receptionist123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Receptionist
              </button>
            </div>
            
            {/* Patient Logins */}
            <div className="login-section">
              <p><strong>🧑 Patient Logins:</strong></p>
              <div className="credentials-box">
                <p><strong>Email:</strong> patient.john@email.com</p>
                <p><strong>Password:</strong> patient123</p>
                <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>John Smith - Admitted Patient</p>
              </div>
              <button 
                onClick={() => { setEmail('patient.john@email.com'); setPassword('patient123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  color: '#2c3e50',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Patient John
              </button>
              
              <div className="credentials-box" style={{ marginTop: '10px' }}>
                <p><strong>Email:</strong> patient.sarah@email.com</p>
                <p><strong>Password:</strong> patient123</p>
                <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>Sarah Johnson - Stable Patient</p>
              </div>
              <button 
                onClick={() => { setEmail('patient.sarah@email.com'); setPassword('patient123'); }}
                className="quick-login-btn"
                style={{
                  display: 'block',
                  inlineSize: '100%',
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  color: '#2c3e50',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBlockEnd: '8px'
                }}
              >
                Login as Patient Sarah
              </button>
            </div>
            
            <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#7f8c8d' }}>
              <strong>Note:</strong> Run <code>npm run seed</code> in backend folder first!
            </p>
          </div>
          
          <div style={{textAlign: 'center', marginBlockStart: '20px'}}>
            <button 
              onClick={() => navigate('/')} 
              style={{
                background: 'none',
                border: '1px solid #3498db',
                color: '#3498db',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Browse with Demo Data (No Login)
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
