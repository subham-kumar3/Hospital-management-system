import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { billService } from '../services'

const Invoice = () => {
  const { id } = useParams()
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBill()
  }, [id])

  const fetchBill = async () => {
    try {
      const response = await billService.getBill(id)
      if (response.success) setBill(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(24)
    doc.setTextColor(102, 126, 234)
    doc.text('Hospital Management System', 105, 20, { align: 'center' })
    
    doc.setFontSize(18)
    doc.setTextColor(44, 62, 80)
    doc.text('INVOICE', 105, 35, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(127, 140, 141)
    doc.text(`Bill Number: ${bill.billNumber}`, 20, 50)
    doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString()}`, 20, 58)
    
    doc.text('Patient Details:', 20, 72)
    doc.setFont(undefined, 'bold')
    doc.text(`Name: ${bill.patient?.name}`, 20, 80)
    doc.text(`Phone: ${bill.patient?.phone}`, 20, 88)
    doc.setFont(undefined, 'normal')
    
    const tableData = bill.items.map(item => [
      item.description,
      item.quantity,
      `₹${item.unitPrice}`,
      `₹${item.total}`
    ])
    
    doc.autoTable({
      startY: 95,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] }
    })
    
    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Subtotal: ₹${bill.subtotal}`, 140, finalY)
    doc.text(`Tax: ₹${bill.tax}`, 140, finalY + 8)
    doc.text(`Discount: ₹${bill.discount}`, 140, finalY + 16)
    doc.setFont(undefined, 'bold')
    doc.text(`Total: ₹${bill.totalAmount}`, 140, finalY + 28)
    doc.text(`Paid: ₹${bill.paidAmount}`, 140, finalY + 36)
    doc.text(`Balance: ₹${bill.balance}`, 140, finalY + 44)
    
    doc.save(`Invoice-${bill.billNumber}.pdf`)
  }

  if (loading) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading...</p>
  if (!bill) return <p style={{ padding: '40px', textAlign: 'center' }}>Bill not found</p>

  return (
    <div style={{ padding: '20px', background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'white', maxWidth: '800px', margin: '0 auto', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #667eea', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#667eea', margin: '0 0 10px' }}>Hospital Management System</h1>
          <h2 style={{ fontSize: '1.8rem', color: '#2c3e50', margin: '0' }}>INVOICE</h2>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <p><strong>Bill Number:</strong> {bill.billNumber}</p>
          <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
        </div>

        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px', color: '#2c3e50' }}>Patient Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Name:</strong> {bill.patient?.name}</p>
          <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {bill.patient?.phone}</p>
          <p style={{ margin: '5px 0' }}><strong>Email:</strong> {bill.patient?.email}</p>
        </div>

        <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{item.unitPrice}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem' }}><strong>Subtotal:</strong> ₹{bill.subtotal}</p>
          <p style={{ fontSize: '1.1rem' }}><strong>Tax:</strong> ₹{bill.tax}</p>
          <p style={{ fontSize: '1.1rem' }}><strong>Discount:</strong> ₹{bill.discount}</p>
          <p style={{ fontSize: '1.3rem', color: '#667eea' }}><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
          <p style={{ fontSize: '1.1rem' }}><strong>Paid Amount:</strong> ₹{bill.paidAmount}</p>
          <p style={{ fontSize: '1.1rem', color: '#e74c3c' }}><strong>Balance:</strong> ₹{bill.balance}</p>
          <p style={{ fontSize: '1.2rem' }}><strong>Payment Status:</strong> {bill.paymentStatus}</p>
        </div>

        <button onClick={downloadPDF} style={{ width: '100%', padding: '15px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default Invoice
