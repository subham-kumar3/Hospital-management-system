import React, { useState, useEffect } from 'react'
import { FlaskConical, Calendar } from 'lucide-react'
import { patientApi } from '../services/patientApi'
import './PatientLabReports.css'

const PatientLabReports = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const response = await patientApi.getMedicalRecords()
      if (response.data.success) {
        setRecords(response.data.data.filter(r => r.labTests && r.labTests.length > 0))
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading lab reports...</div>

  return (
    <div className="patient-lab-reports">
      <div className="page-header">
        <h1>Lab Reports</h1>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <FlaskConical size={64} />
          <h3>No lab reports found</h3>
          <p>Your lab test results will appear here</p>
        </div>
      ) : (
        <div className="reports-list">
          {records.map((record) => (
            <div key={record._id} className="report-card">
              <div className="report-header">
                <h3>Medical Record - {new Date(record.createdAt).toLocaleDateString()}</h3>
                <Calendar size={20} />
              </div>
              
              <div className="lab-tests">
                {record.labTests.map((test, idx) => (
                  <div key={idx} className="test-item">
                    <div className="test-info">
                      <h4>{test.testName}</h4>
                      <p>Date: {test.date ? new Date(test.date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="test-result">
                      <strong>Result:</strong>
                      <p>{test.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientLabReports
