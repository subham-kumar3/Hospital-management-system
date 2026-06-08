import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <div className="not-found-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link to="/login" className="btn-home">
            <Home size={18} />
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
