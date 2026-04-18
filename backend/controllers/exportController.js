const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const LabTest = require('../models/LabTest');
const Medicine = require('../models/Medicine');
const Bill = require('../models/Bill');

// Helper function to generate Excel file
const generateExcel = async (res, fileName, headers, rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  
  worksheet.columns = headers.map(h => ({ header: h, key: h, width: 20 }));
  worksheet.addRows(rows);
  
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}.xlsx"`
  );
  
  await workbook.xlsx.write(res);
  res.end();
};

// Helper function to generate PDF
const generatePDF = (res, fileName, title, headers, rows) => {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
  
  doc.pipe(res);
  
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);
  
  // Table headers
  let yPos = doc.y;
  const colWidth = 500 / headers.length;
  
  headers.forEach((header, index) => {
    doc.font('Helvetica-Bold').fontSize(10).text(header, 50 + index * colWidth, yPos, {
      width: colWidth,
      align: 'center'
    });
  });
  
  yPos += 20;
  doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
  yPos += 10;
  
  // Table rows
  rows.forEach((row, rowIndex) => {
    if (yPos > 750) {
      doc.addPage();
      yPos = 50;
    }
    
    const bgColor = rowIndex % 2 === 0 ? '#f5f5f5' : null;
    if (bgColor) {
      doc.rect(50, yPos - 5, 500, 15).fill(bgColor);
    }
    
    doc.font('Helvetica').fontSize(9);
    Object.values(row).forEach((value, index) => {
      doc.text(String(value), 50 + index * colWidth, yPos, {
        width: colWidth,
        align: 'center'
      });
    });
    
    yPos += 20;
  });
  
  doc.end();
};

// @desc    Export patients report
// @route   POST /api/export/patients
// @access  Private (Admin only)
exports.exportPatients = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const patients = await Patient.find().select('-__v');
    
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'Blood Group'];
    const rows = patients.map(p => ({
      'Patient ID': p.patientId,
      'Name': p.name,
      'Age': p.age,
      'Gender': p.gender,
      'Phone': p.phone,
      'Email': p.email,
      'Blood Group': p.bloodGroup
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'patients_report', headers, rows);
    } else {
      generatePDF(res, 'patients_report', 'Patient Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export doctors report
// @route   POST /api/export/doctors
// @access  Private (Admin only)
exports.exportDoctors = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const doctors = await Doctor.find().populate('user', 'email phone');
    
    const headers = ['Name', 'Specialization', 'Qualification', 'Email', 'Phone', 'Department'];
    const rows = doctors.map(d => ({
      'Name': d.name,
      'Specialization': d.specialization,
      'Qualification': d.qualification,
      'Email': d.user?.email || '',
      'Phone': d.user?.phone || '',
      'Department': d.department
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'doctors_report', headers, rows);
    } else {
      generatePDF(res, 'doctors_report', 'Doctor Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export appointments report
// @route   POST /api/export/appointments
// @access  Private (Admin only)
exports.exportAppointments = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const appointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialization');
    
    const headers = ['Date', 'Time', 'Patient', 'Doctor', 'Department', 'Status', 'Type'];
    const rows = appointments.map(a => ({
      'Date': new Date(a.date).toLocaleDateString(),
      'Time': a.time,
      'Patient': a.patient?.name || '',
      'Doctor': a.doctor?.name || '',
      'Department': a.department,
      'Status': a.status,
      'Type': a.type
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'appointments_report', headers, rows);
    } else {
      generatePDF(res, 'appointments_report', 'Appointments Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export lab tests report
// @route   POST /api/export/lab-tests
// @access  Private (Admin only)
exports.exportLabTests = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const labTests = await LabTest.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialization');
    
    const headers = ['Test Name', 'Type', 'Patient', 'Doctor', 'Priority', 'Status', 'Date'];
    const rows = labTests.map(t => ({
      'Test Name': t.testName,
      'Type': t.testType,
      'Patient': t.patient?.name || '',
      'Doctor': t.doctor?.name || '',
      'Priority': t.priority,
      'Status': t.status,
      'Date': new Date(t.createdAt).toLocaleDateString()
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'lab_tests_report', headers, rows);
    } else {
      generatePDF(res, 'lab_tests_report', 'Lab Tests Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export medicines report
// @route   POST /api/export/medicines
// @access  Private (Admin only)
exports.exportMedicines = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const medicines = await Medicine.find();
    
    const headers = ['Name', 'Category', 'Stock', 'Expiry Date', 'Batch No', 'Manufacturer'];
    const rows = medicines.map(m => ({
      'Name': m.name,
      'Category': m.category,
      'Stock': m.stock,
      'Expiry Date': new Date(m.expiryDate).toLocaleDateString(),
      'Batch No': m.batchNumber,
      'Manufacturer': m.manufacturer
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'medicines_report', headers, rows);
    } else {
      generatePDF(res, 'medicines_report', 'Medicines Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export financial report
// @route   POST /api/export/financial
// @access  Private (Admin only)
exports.exportFinancial = async (req, res) => {
  try {
    const { format = 'excel' } = req.body;
    const bills = await Bill.find()
      .populate('patient', 'name')
      .populate('user', 'name');
    
    const headers = ['Bill Number', 'Patient', 'Amount', 'Discount', 'Net Amount', 'Status', 'Date'];
    const rows = bills.map(b => ({
      'Bill Number': b.billNumber,
      'Patient': b.patient?.name || '',
      'Amount': `$${b.totalAmount}`,
      'Discount': `${b.discountPercent || 0}%`,
      'Net Amount': `$${b.netAmount}`,
      'Status': b.paymentStatus,
      'Date': new Date(b.createdAt).toLocaleDateString()
    }));
    
    if (format === 'excel') {
      await generateExcel(res, 'financial_report', headers, rows);
    } else {
      generatePDF(res, 'financial_report', 'Financial Report', headers, rows);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
