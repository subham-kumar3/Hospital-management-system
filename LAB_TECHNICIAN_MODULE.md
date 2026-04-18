# Lab Technician Module - Hospital Management System

## Overview
The Lab Technician Module is a comprehensive laboratory management system integrated into the Hospital Management System. It provides role-based access for lab technicians to manage test requests, samples, results, and reports.

## Features Implemented

### 1. Authentication & Authorization
- **Role-based Access**: Only users with "Lab Technician" role can access the module
- **Secure Login**: JWT-based authentication
- **Protected Routes**: All lab routes require authentication and proper role

### 2. Dashboard
- **Statistics Cards**: 
  - Pending Tests
  - In Progress Tests
  - Completed Tests
  - Urgent Tests
  - Pending Samples
  - Collected Samples
- **Quick Actions**: Fast access to key features
- **Urgent Tests Alert**: Display of critical and urgent priority tests
- **Recent Tests**: Latest test requests overview

### 3. Test Requests Management
- **View All Tests**: Complete list of test requests from doctors
- **Search Functionality**: Search by patient name or ID
- **Filter Options**: 
  - By status (Pending, In Progress, Completed)
  - By priority (Normal, Urgent, Critical)
- **Status Updates**: Change test status directly from the list
- **Sample Tracking**: View sample collection status
- **Test Details Modal**: Detailed view of each test request
- **Equipment Assignment**: Assign tests to lab equipment

### 4. Sample Management
- **Sample Tracking**: Monitor all patient samples
- **Collection Status**: Update as Collected/Not Collected
- **Sample Information**:
  - Auto-generated Sample IDs
  - Sample type (Blood, Urine, etc.)
  - Collection date and time
  - Expiry date tracking
  - Storage conditions
  - Storage location
- **Filter Options**: View by collection status
- **Visual Cards**: Easy-to-read sample information cards

### 5. Test Result Entry
- **Result Entry Form**: Enter detailed test results
- **Parameter Values**: Add multiple parameters with:
  - Parameter name
  - Value
  - Normal range
  - Unit
- **Overall Result**: Summary result text
- **Notes**: Additional observations
- **Auto-completion**: Automatically marks test as completed
- **Sample Validation**: Requires sample collection before result entry

### 6. Reports Management
- **Generated Reports**: View all completed lab reports
- **Search**: Find reports by ID, test name, or type
- **Report Details**:
  - Auto-generated Report IDs
  - Patient information
  - Test details
  - Results with parameters
  - Interpreting technician
  - Date and time
- **Actions**: View, Print, Download options
- **Status Tracking**: Final, Draft, Revised status

### 7. Notifications System
- **Real-time Alerts**: 
  - Urgent test notifications
  - Sample collection reminders
  - Expiry alerts
  - Equipment alerts
- **Priority Levels**: Critical, High, Medium, Low
- **Mark as Read**: Individual or bulk mark as read
- **Delete**: Remove old notifications
- **Filter**: View all, unread only, or read only
- **Visual Indicators**: Color-coded priority and unread status

### 8. Profile Settings
- **Update Personal Information**:
  - Name
  - Email
- **Change Password**:
  - Current password verification
  - New password with confirmation
  - Minimum 6 character requirement
- **Account Information**:
  - Account creation date
  - Last login
  - Account status

## Database Models

### 1. LabTest Model
Stores all laboratory test requests with:
- Patient and doctor references
- Test type and name
- Priority level (Normal, Urgent, Critical)
- Status (Pending, In Progress, Completed, Cancelled)
- Sample collection tracking
- Equipment assignment
- Test results with parameters
- Report file attachment
- Timestamps

### 2. LabSample Model
Manages patient samples with:
- Auto-generated unique Sample IDs
- Sample type enumeration
- Collection status tracking
- Collection date/time
- Storage conditions and location
- Expiry date tracking
- Status management (Active, Processed, Discarded)

### 3. LabReport Model
Stores completed lab reports:
- Auto-generated unique Report IDs
- Test and patient references
- Detailed test results
- Report file storage
- Interpretation details
- Status tracking (Draft, Final, Revised)

### 4. LabNotification Model
Manages system notifications:
- Notification type categorization
- Priority levels
- Read/unread status
- Related test/sample references
- Timestamps

## API Endpoints

### Lab Tests
- `GET /api/lab/tests` - Get all lab tests (with filters)
- `GET /api/lab/tests/:id` - Get single test details
- `PUT /api/lab/tests/:id/status` - Update test status
- `PUT /api/lab/tests/:id/results` - Add test results

### Samples
- `GET /api/lab/samples` - Get all samples (with filters)
- `GET /api/lab/samples/expiring` - Get expiring samples
- `GET /api/lab/samples/:id` - Get single sample
- `POST /api/lab/samples` - Create new sample
- `PUT /api/lab/samples/:id/collection` - Update collection status
- `PUT /api/lab/samples/:id` - Update sample details

### Reports
- `GET /api/lab/reports` - Get all reports
- `GET /api/lab/reports/:id` - Get single report
- `GET /api/lab/reports/patient/:patientId` - Get patient test history
- `POST /api/lab/reports/generate/:testId` - Generate report from test

### Notifications
- `GET /api/lab/notifications` - Get technician notifications
- `PUT /api/lab/notifications/:id/read` - Mark as read
- `PUT /api/lab/notifications/read-all` - Mark all as read
- `DELETE /api/lab/notifications/:id` - Delete notification

### Dashboard
- `GET /api/lab/dashboard` - Get dashboard statistics

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running
- Existing Hospital Management System setup

### Installation Steps

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Seed Lab Module Data**:
   ```bash
   npm run seed:lab
   ```
   This creates:
   - Lab Technician user account
   - Sample test requests
   - Sample data for testing
   - Initial notifications

3. **Start Backend Server**:
   ```bash
   npm run dev
   ```

4. **Frontend Setup**:
   ```bash
   cd ../hospital-management
   npm install
   npm run dev
   ```

### Login Credentials

After seeding, use these credentials:
- **Email**: lab@hospital.com
- **Password**: lab123

### Access the Lab Portal

Navigate to: `http://localhost:5173/lab-dashboard`

## File Structure

### Backend
```
backend/
├── models/
│   ├── LabTest.js              # Lab test model
│   ├── LabSample.js            # Sample tracking model
│   ├── LabReport.js            # Report storage model
│   └── LabNotification.js      # Notifications model
├── controllers/
│   ├── labController.js        # Lab test operations
│   ├── sampleController.js     # Sample management
│   ├── reportController.js     # Report operations
│   └── notificationController.js # Notification handling
├── routes/
│   └── labRoutes.js            # All lab API routes
├── seed-lab-module.js          # Seed script for lab data
└── server.js                   # Updated with lab routes
```

### Frontend
```
hospital-management/src/
├── components/
│   ├── LabLayout.jsx           # Lab technician layout
│   └── LabLayout.css           # Layout styles
├── pages/
│   ├── LabDashboard.jsx        # Dashboard page
│   ├── LabDashboard.css
│   ├── LabTests.jsx            # Test requests page
│   ├── LabTests.css
│   ├── LabSamples.jsx          # Sample management page
│   ├── LabSamples.css
│   ├── LabResults.jsx          # Test results entry
│   ├── LabResults.css
│   ├── LabReports.jsx          # Reports page
│   ├── LabReports.css
│   ├── LabNotifications.jsx    # Notifications page
│   ├── LabNotifications.css
│   ├── LabProfile.jsx          # Profile settings
│   └── LabProfile.css
└── App.jsx                     # Updated with lab routes
```

## UI/UX Features

### Design Principles
- **Clean Interface**: Simple, uncluttered design
- **Fast Navigation**: Sidebar navigation for quick access
- **Responsive**: Works on desktop and mobile devices
- **Color Coding**: 
  - Red for critical/urgent items
  - Orange for warnings
  - Green for completed/success
  - Blue for information

### User Experience
- **Real-time Updates**: Immediate feedback on actions
- **Visual Indicators**: Status badges and priority markers
- **Search & Filter**: Quick data discovery
- **Modal Windows**: Detailed views without page navigation
- **Form Validation**: Prevents invalid data entry
- **Loading States**: Clear indication of data fetching

## Security Features

- **Role-based Access Control**: Only Lab Technicians can access
- **JWT Authentication**: Secure token-based auth
- **Protected API Routes**: Middleware validation
- **Password Hashing**: Bcrypt for secure storage
- **Input Validation**: Server-side validation on all inputs

## Future Enhancements

Potential improvements for future versions:
1. **File Upload**: Attach PDF/Image reports
2. **Email Notifications**: Send reports to doctors
3. **Advanced Analytics**: Test completion metrics
4. **Barcode Integration**: Sample barcode scanning
5. **Equipment Integration**: Direct machine data import
6. **Quality Control**: QC checks and validations
7. **Multi-language Support**: Internationalization
8. **Export Features**: Excel/CSV export
9. **Automated Alerts**: SMS/Email for critical results
10. **Audit Trail**: Complete history tracking

## Troubleshooting

### Common Issues

1. **Cannot Access Lab Portal**:
   - Ensure you ran `npm run seed:lab`
   - Verify user role is "Lab Technician"
   - Check authentication token

2. **No Tests Showing**:
   - Run the seeder to create sample data
   - Check MongoDB connection
   - Verify patient and doctor data exists

3. **API Errors**:
   - Check backend server is running
   - Verify API URL in frontend services
   - Check browser console for errors

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Verify database connections
4. Check server logs for errors

## License

This module is part of the Hospital Management System and follows the same licensing terms.

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-07  
**Module**: Lab Technician  
**Status**: Production Ready
