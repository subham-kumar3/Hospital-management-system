import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './LabResults.css';

const LabResults = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultData, setResultData] = useState({
    result: '',
    values: [],
    notes: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/lab/tests', {
        params: { status: 'In Progress' }
      });
      if (response.data.success) {
        setTests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = (test) => {
    setSelectedTest(test);
    setShowResultForm(true);
    setResultData({
      result: '',
      values: [],
      notes: ''
    });
  };

  const addParameterValue = () => {
    setResultData({
      ...resultData,
      values: [...resultData.values, { parameter: '', value: '', normalRange: '', unit: '' }]
    });
  };

  const updateParameterValue = (index, field, value) => {
    const newValues = [...resultData.values];
    newValues[index][field] = value;
    setResultData({ ...resultData, values: newValues });
  };

  const removeParameterValue = (index) => {
    const newValues = resultData.values.filter((_, i) => i !== index);
    setResultData({ ...resultData, values: newValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/lab/tests/${selectedTest._id}/results`, resultData);
      alert('Test result added successfully!');
      setShowResultForm(false);
      fetchTests();
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Failed to add test result');
    }
  };

  return (
    <div className="lab-results-page">
      <div className="page-header">
        <h1>Test Results Entry</h1>
        <p>Enter and manage test results</p>
      </div>

      {loading ? (
        <div className="loading">Loading tests...</div>
      ) : (
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Sample</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td><strong>{test.testName}</strong></td>
                  <td>{test.patient?.name}</td>
                  <td>{test.testType}</td>
                  <td>
                    <span className={`priority-badge ${test.priority.toLowerCase()}`}>
                      {test.priority}
                    </span>
                  </td>
                  <td>
                    {test.sampleCollected ? (
                      <span className="collected-badge">✓ Collected</span>
                    ) : (
                      <span className="not-collected-badge">✗ Not Collected</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleAddResult(test)}
                      className="add-result-btn"
                      disabled={!test.sampleCollected}
                    >
                      {test.sampleCollected ? 'Add Result' : 'Sample Required'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tests.length === 0 && !loading && (
        <div className="no-data">No tests in progress</div>
      )}

      {showResultForm && selectedTest && (
        <div className="modal-overlay" onClick={() => setShowResultForm(false)}>
          <div className="modal-content result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Test Result - {selectedTest.testName}</h2>
              <button className="close-btn" onClick={() => setShowResultForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="result-form">
              <div className="form-group">
                <label>Overall Result *</label>
                <textarea
                  value={resultData.result}
                  onChange={(e) => setResultData({ ...resultData, result: e.target.value })}
                  required
                  rows="3"
                  placeholder="Enter overall test result..."
                />
              </div>

              <div className="form-group">
                <label>Parameter Values</label>
                {resultData.values.map((param, index) => (
                  <div key={index} className="parameter-row">
                    <input
                      type="text"
                      placeholder="Parameter"
                      value={param.parameter}
                      onChange={(e) => updateParameterValue(index, 'parameter', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => updateParameterValue(index, 'value', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Normal Range"
                      value={param.normalRange}
                      onChange={(e) => updateParameterValue(index, 'normalRange', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={param.unit}
                      onChange={(e) => updateParameterValue(index, 'unit', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeParameterValue(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addParameterValue}
                  className="add-parameter-btn"
                >
                  + Add Parameter
                </button>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={resultData.notes}
                  onChange={(e) => setResultData({ ...resultData, notes: e.target.value })}
                  rows="3"
                  placeholder="Additional notes or observations..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Result
                </button>
                <button
                  type="button"
                  onClick={() => setShowResultForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResults;
