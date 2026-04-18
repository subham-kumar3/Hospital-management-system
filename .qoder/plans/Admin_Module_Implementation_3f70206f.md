# Admin Module Implementation Plan

## Overview
The Hospital Management System already has extensive admin backend APIs. This plan focuses on creating a complete Admin frontend module with all requested features, while enhancing backend capabilities for pharmacy inventory, lab management, reports export, and system settings.

**Existing Backend APIs to leverage:**
- `/api/admin/dashboard` - Dashboard statistics
- `/api/admin/users` - User CRUD operations
- `/api/admin/patients` - Patient management
- `/api/admin/appointments` - Appointment oversight
- `/api/admin/financial` - Financial overview
- `/api/admin/reports` - Reports data
- `/api/admin/notifications` - System notifications

---

## Phase 1: Backend Enhancements

### 1.1 Create Medicine Inventory Enhancement
**File**: Update `/backend/models/Medicine.js`
- Add fields: minStockLevel, supplier, purchasePrice, sellingPrice, location
- Already has: name, category, stock, expiryDate, manufacturer, batchNumber

**File**: `/backend/controllers/inventoryController.js` (New)
- `getInventoryStats` - Total medicines, low stock, expired, total value
- `getLowStockMedicines` - Medicines below minStockLevel
- `getExpiringMedicines` - Medicines expiring within 30/60/90 days
- `updateStock` - Add/reduce stock with logging
- `generatePurchaseOrder` - Auto-generate for low stock items

**File**: `/backend/routes/inventoryRoutes.js` (New)
- GET `/api/inventory/stats`
- GET `/api/inventory/low-stock`
- GET `/api/inventory/expiring`
- PUT `/api/inventory/:id/stock`
- POST `/api/inventory/purchase-order`

### 1.2 Create Lab Management Enhancement
**File**: `/backend/controllers/labAdminController.js` (New)
- `getLabStats` - Total tests, pending, completed, urgent
- `getAllLabTests` - With filters (status, priority, date range)
- `assignTechnician` - Assign lab technician to test
- `getTechnicianWorkload` - Tests per technician
- `generateLabReport` - Aggregate lab statistics

**File**: `/backend/routes/labAdminRoutes.js` (New)
- GET `/api/lab-admin/stats`
- GET `/api/lab-admin/tests`
- PUT `/api/lab-admin/tests/:id/assign`
- GET `/api/lab-admin/technicians/workload`
- GET `/api/lab-admin/reports`

### 1.3 Create Report Export Controller
**File**: `/backend/controllers/exportController.js` (New)
- `exportPatientReport` - PDF/Excel with demographics, admissions, discharges
- `exportDoctorReport` - Activity, appointments, patients treated
- `exportAppointmentReport` - Statistics by date range, department, status
- `exportLabReport` - Test statistics, turnaround times
- `exportMedicineReport` - Usage, stock, expiry report
- `exportFinancialReport` - Revenue, payments, outstanding

**Dependencies**: Install `exceljs` and `pdfkit` for export functionality

**File**: `/backend/routes/exportRoutes.js` (New)
- POST `/api/export/patients`
- POST `/api/export/doctors`
- POST `/api/export/appointments`
- POST `/api/export/lab-tests`
- POST `/api/export/medicines`
- POST `/api/export/financial`

### 1.4 Create Settings Controller
**File**: `/backend/models/Settings.js` (New)
- hospitalName, address, phone, email, website
- workingHours (open/close time for each day)
- appointmentSlotDuration
- maxLoginAttempts, lockoutDuration
- notificationPreferences (email, SMS, in-app)
- backupSchedule

**File**: `/backend/controllers/settingsController.js` (New)
- `getSettings` - Get all settings
- `updateSettings` - Update system settings
- `updateHospitalInfo` - Update hospital details
- `backupDatabase` - Trigger database backup
- `getActivityLogs` - Admin activity logs

**File**: `/backend/routes/settingsRoutes.js` (New)
- GET `/api/settings`
- PUT `/api/settings`
- PUT `/api/settings/hospital-info`
- POST `/api/settings/backup`
- GET `/api/settings/activity-logs`

### 1.5 Update server.js
**File**: `/backend/server.js`
- Mount new routes: inventory, lab-admin, export, settings

### 1.6 Update Seeder
**File**: `/backend/seeder.js`
- Add more sample users (Pharmacists, Lab Technicians)
- Add sample medicines with varying stock levels
- Add sample lab tests
- Add sample settings

---

## Phase 2: Frontend - Admin Layout Enhancement

### 2.1 Update Admin Layout
**File**: Update `/hospital-management/src/components/Layout.jsx`
- Add comprehensive sidebar menu:
  - Dashboard
  - User Management
  - Patient Management
  - Staff Management
  - Appointments
  - Pharmacy & Inventory
  - Lab Management
  - Billing & Finance
  - Reports & Analytics
  - Notifications
  - Settings
  - Profile

### 2.2 Add Notification Bell
- Integrate with existing notification system
- Show unread count badge
- Quick access to alerts (low stock, pending tests, emergencies)

---

## Phase 3: Frontend - Admin Pages

### 3.1 Enhanced Admin Dashboard
**File**: Update `/hospital-management/src/pages/Dashboard.jsx`

**Features:**
- Stats cards: Total Patients, Doctors, Nurses, Staff, Appointments Today, Pending Lab Tests, Low-Stock Medicines, Revenue
- Quick action buttons: Add Staff, Add Patient, Generate Reports, View Alerts
- Recent activities feed
- Upcoming appointments table
- Alerts section (low stock, pending tests, appointment conflicts)
- Charts: Appointments trend, Revenue trend (optional with recharts)

**API Calls:**
- `GET /api/admin/dashboard`
- `GET /api/inventory/low-stock`
- `GET /api/lab-admin/stats`

### 3.2 User Management Page
**File**: `/hospital-management/src/pages/AdminUserManagement.jsx`
**File**: `/hospital-management/src/pages/AdminUserManagement.css`

**Features:**
- Table view of all users with pagination
- Search by name, email, user ID
- Filter by role (Doctor, Nurse, Receptionist, Pharmacist, Lab Technician)
- Filter by status (Active, Inactive, Locked)
- Add new user modal with role selection
- Edit user details
- Reset password
- Change user status (Active/Inactive/Locked)
- Delete user
- Bulk import users (CSV upload)

**API Calls:**
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/:id`
- `POST /api/admin/users/:id/reset-password`
- `PUT /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `POST /api/admin/users/bulk-import`

### 3.3 Patient Management Page
**File**: `/hospital-management/src/pages/AdminPatientManagement.jsx`
**File**: `/hospital-management/src/pages/AdminPatientManagement.css`

**Features:**
- View all patients with search and filter
- Add new patient
- Edit patient details
- Delete patient
- Assign patient to doctor
- View patient medical history
- Export patient list

**API Calls:**
- `GET /api/admin/patients`
- `PUT /api/admin/patients/:id`
- `DELETE /api/admin/patients/:id`

### 3.4 Staff Management Page
**File**: `/hospital-management/src/pages/AdminStaffManagement.jsx`
**File**: `/hospital-management/src/pages/AdminStaffManagement.css`

**Features:**
- View all staff (Doctors, Nurses, Lab Technicians, Pharmacists)
- Filter by role and department
- Doctor schedules management
- Nurse ward assignments
- Lab technician workload
- Shift management
- Duty roster view

**API Calls:**
- `GET /api/admin/users?role=Doctor`
- `GET /api/doctors`
- `PUT /api/doctors/:id`

### 3.5 Appointment Management Page
**File**: `/hospital-management/src/pages/AdminAppointmentManagement.jsx`
**File**: `/hospital-management/src/pages/AdminAppointmentManagement.css`

**Features:**
- View all appointments (calendar and list view)
- Filter by date, doctor, patient, department, status
- Reschedule appointment
- Cancel appointment
- Manually assign appointments
- Conflict detection
- Teleconsultation indicator

**API Calls:**
- `GET /api/admin/appointments`
- `PUT /api/admin/appointments/:id`
- `DELETE /api/admin/appointments/:id`

### 3.6 Pharmacy & Inventory Management
**File**: `/hospital-management/src/pages/AdminPharmacy.jsx`
**File**: `/hospital-management/src/pages/AdminPharmacy.css`

**Features:**
- Medicine inventory table
- Search and filter medicines
- Add new medicine
- Update stock levels
- Expiry date tracking (highlight expiring soon)
- Low-stock alerts with visual indicators
- Auto-generate purchase orders for low stock
- Medicine usage statistics
- Export inventory report

**API Calls:**
- `GET /api/medicines`
- `POST /api/medicines`
- `PUT /api/medicines/:id`
- `PUT /api/inventory/:id/stock`
- `GET /api/inventory/low-stock`
- `GET /api/inventory/expiring`
- `POST /api/inventory/purchase-order`

### 3.7 Lab Management
**File**: `/hospital-management/src/pages/AdminLabManagement.jsx`
**File**: `/hospital-management/src/pages/AdminLabManagement.css`

**Features:**
- View all lab tests
- Filter by status (Pending, In Progress, Completed)
- Filter by priority (Normal, Urgent, Emergency)
- Assign lab technicians
- Track test turnaround time
- View urgent tests requiring attention
- Generate lab reports
- Lab test statistics

**API Calls:**
- `GET /api/lab-admin/tests`
- `PUT /api/lab-admin/tests/:id/assign`
- `GET /api/lab-admin/stats`
- `GET /api/lab-admin/reports`

### 3.8 Billing & Financial Management
**File**: `/hospital-management/src/pages/AdminBilling.jsx`
**File**: `/hospital-management/src/pages/AdminBilling.css`

**Features:**
- View all bills and invoices
- Filter by date range, payment status, patient
- Payment tracking (Paid, Pending, Partial)
- Outstanding payments summary
- Revenue charts
- Generate financial reports
- Export to PDF/Excel

**API Calls:**
- `GET /api/bills`
- `GET /api/admin/financial`
- `POST /api/export/financial`

### 3.9 Reports & Analytics
**File**: `/hospital-management/src/pages/AdminReports.jsx`
**File**: `/hospital-management/src/pages/AdminReports.css`

**Features:**
- Report type selector:
  - Patient Reports (admissions, discharges, demographics)
  - Doctor Activity Reports
  - Appointment Statistics
  - Lab Test Statistics
  - Medicine Usage Reports
  - Financial Reports
- Date range picker
- Generate report button
- Export to PDF/Excel buttons
- Report preview
- Charts and graphs

**API Calls:**
- `GET /api/admin/reports`
- `POST /api/export/patients`
- `POST /api/export/doctors`
- `POST /api/export/appointments`
- `POST /api/export/lab-tests`
- `POST /api/export/medicines`

### 3.10 Notifications & Alerts
**File**: `/hospital-management/src/pages/AdminNotifications.jsx`
**File**: `/hospital-management/src/pages/AdminNotifications.css`

**Features:**
- System alerts feed:
  - Low medicine stock alerts
  - Pending lab tests
  - Appointment conflicts
  - Emergency notifications
- Mark as read/dismiss
- Create new notification/broadcast
- Filter by type and priority
- Notification history

**API Calls:**
- `GET /api/admin/notifications`
- `POST /api/admin/notifications`
- `GET /api/inventory/low-stock`

### 3.11 Settings & Configuration
**File**: `/hospital-management/src/pages/AdminSettings.jsx`
**File**: `/hospital-management/src/pages/AdminSettings.css`

**Features:**
- **Hospital Info Section:**
  - Hospital name, address, phone, email, website
  - Logo upload
  - Save changes

- **System Preferences:**
  - Working hours configuration (per day)
  - Appointment slot duration
  - Notification preferences (email, SMS, in-app)
  - Time zone settings

- **Security Settings:**
  - Max login attempts
  - Account lockout duration
  - Password policy (min length, complexity)
  - Session timeout

- **Role & Permissions:**
  - View all roles
  - Configure permissions per role (future enhancement)

- **Database Management:**
  - Backup database button
  - Restore from backup
  - Last backup timestamp

- **Activity Logs:**
  - View admin activity logs
  - Filter by date, user, action

**API Calls:**
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/settings/backup`
- `GET /api/settings/activity-logs`

### 3.12 Admin Profile
**File**: `/hospital-management/src/pages/AdminProfile.jsx`
**File**: `/hospital-management/src/pages/AdminProfile.css`

**Features:**
- Update personal details (name, email, phone)
- Change password
- View login history
- Activity log
- Two-factor authentication toggle (future)

**API Calls:**
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

---

## Phase 4: Frontend - Services & Utilities

### 4.1 Create Admin Service
**File**: Update `/hospital-management/src/services/index.js`
- Add `adminService` with methods:
  - `getDashboardStats()`
  - `getAllUsers(params)`
  - `createUser(userData)`
  - `updateUser(id, userData)`
  - `resetPassword(id)`
  - `updateUserStatus(id, status)`
  - `deleteUser(id)`
  - `bulkImportUsers(formData)`
  - `getAllPatients(params)`
  - `updatePatient(id, data)`
  - `deletePatient(id)`
  - `getAllAppointments(params)`
  - `updateAppointment(id, data)`
  - `deleteAppointment(id)`
  - `getFinancialOverview()`
  - `getReports(params)`
  - `getNotifications()`
  - `createNotification(data)`

### 4.2 Create Inventory Service
**File**: Update `/hospital-management/src/services/index.js`
- Add `inventoryService` with methods:
  - `getInventoryStats()`
  - `getLowStockMedicines()`
  - `getExpiringMedicines()`
  - `updateStock(id, stockData)`
  - `generatePurchaseOrder(data)`

### 4.3 Create Lab Admin Service
**File**: Update `/hospital-management/src/services/index.js`
- Add `labAdminService` with methods:
  - `getLabStats()`
  - `getAllLabTests(params)`
  - `assignTechnician(testId, technicianId)`
  - `getTechnicianWorkload()`
  - `generateLabReport(params)`

### 4.4 Create Export Service
**File**: Update `/hospital-management/src/services/index.js`
- Add `exportService` with methods:
  - `exportPatients(format, params)`
  - `exportDoctors(format, params)`
  - `exportAppointments(format, params)`
  - `exportLabTests(format, params)`
  - `exportMedicines(format, params)`
  - `exportFinancial(format, params)`

### 4.5 Create Settings Service
**File**: Update `/hospital-management/src/services/index.js`
- Add `settingsService` with methods:
  - `getSettings()`
  - `updateSettings(data)`
  - `updateHospitalInfo(data)`
  - `backupDatabase()`
  - `getActivityLogs(params)`

---

## Phase 5: Update Routing & Authentication

### 5.1 Update App.jsx
**File**: `/hospital-management/src/App.jsx`
- Add Admin protected routes (already has role check for Admin)
- Import all new admin pages
- Routes:
  - `/dashboard` - Admin Dashboard (existing, will enhance)
  - `/admin-users` - User Management
  - `/admin-patients` - Patient Management
  - `/admin-staff` - Staff Management
  - `/admin-appointments` - Appointment Management
  - `/admin-pharmacy` - Pharmacy & Inventory
  - `/admin-lab` - Lab Management
  - `/admin-billing` - Billing & Finance
  - `/admin-reports` - Reports & Analytics
  - `/admin-notifications` - Notifications
  - `/admin-settings` - Settings
  - `/admin-profile` - Admin Profile

### 5.2 Update Login Redirect
**File**: `/hospital-management/src/pages/Login.jsx`
- Already redirects Admin to `/dashboard` - no changes needed

---

## Phase 6: Dependencies & Installation

### 6.1 Backend Dependencies
```bash
cd backend
npm install exceljs pdfkit
```

### 6.2 Frontend Dependencies
```bash
cd hospital-management
npm install recharts (for charts/graphs - optional)
```

---

## File Creation Summary

### Backend (New Files):
1. `/backend/controllers/inventoryController.js`
2. `/backend/routes/inventoryRoutes.js`
3. `/backend/controllers/labAdminController.js`
4. `/backend/routes/labAdminRoutes.js`
5. `/backend/controllers/exportController.js`
6. `/backend/routes/exportRoutes.js`
7. `/backend/models/Settings.js`
8. `/backend/controllers/settingsController.js`
9. `/backend/routes/settingsRoutes.js`

### Backend (Modified Files):
10. `/backend/models/Medicine.js` - Add minStockLevel, supplier, pricing
11. `/backend/server.js` - Mount new routes
12. `/backend/seeder.js` - Add sample data

### Frontend (New Files):
13. `/hospital-management/src/pages/AdminUserManagement.jsx`
14. `/hospital-management/src/pages/AdminUserManagement.css`
15. `/hospital-management/src/pages/AdminPatientManagement.jsx`
16. `/hospital-management/src/pages/AdminPatientManagement.css`
17. `/hospital-management/src/pages/AdminStaffManagement.jsx`
18. `/hospital-management/src/pages/AdminStaffManagement.css`
19. `/hospital-management/src/pages/AdminAppointmentManagement.jsx`
20. `/hospital-management/src/pages/AdminAppointmentManagement.css`
21. `/hospital-management/src/pages/AdminPharmacy.jsx`
22. `/hospital-management/src/pages/AdminPharmacy.css`
23. `/hospital-management/src/pages/AdminLabManagement.jsx`
24. `/hospital-management/src/pages/AdminLabManagement.css`
25. `/hospital-management/src/pages/AdminBilling.jsx`
26. `/hospital-management/src/pages/AdminBilling.css`
27. `/hospital-management/src/pages/AdminReports.jsx`
28. `/hospital-management/src/pages/AdminReports.css`
29. `/hospital-management/src/pages/AdminNotifications.jsx`
30. `/hospital-management/src/pages/AdminNotifications.css`
31. `/hospital-management/src/pages/AdminSettings.jsx`
32. `/hospital-management/src/pages/AdminSettings.css`
33. `/hospital-management/src/pages/AdminProfile.jsx`
34. `/hospital-management/src/pages/AdminProfile.css`

### Frontend (Modified Files):
35. `/hospital-management/src/components/Layout.jsx` - Enhanced sidebar
36. `/hospital-management/src/pages/Dashboard.jsx` - Enhanced with more stats
37. `/hospital-management/src/App.jsx` - Add admin routes
38. `/hospital-management/src/services/index.js` - Add all admin services

---

## Implementation Order

1. Backend dependencies installation (exceljs, pdfkit)
2. Backend models and controllers (inventory, lab-admin, export, settings)
3. Backend routes and server.js updates
4. Update seeder with sample data
5. Frontend services layer
6. Frontend Layout enhancement
7. Frontend pages (Dashboard → Users → Patients → Staff → Appointments → Pharmacy → Lab → Billing → Reports → Notifications → Settings → Profile)
8. Testing and bug fixes

---

## Key Design Decisions

- **Leverage existing backend** - The system already has robust admin APIs for users, patients, appointments, financial, reports
- **Build missing backend features** - Inventory management, lab admin oversight, export functionality, settings
- **Consistent UI** - Match existing design patterns from Receptionist/Doctor modules
- **Role-based access** - All routes protected with Admin-only access
- **Export functionality** - Both PDF and Excel for all major reports
- **Real-time alerts** - Dashboard shows critical alerts (low stock, pending tests, emergencies)
- **Comprehensive settings** - Hospital info, security policies, backup management
- **Activity logging** - Track all admin actions for audit trail
