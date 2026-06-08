# Nurse Module - Hospital Management System

## Overview
Complete Nurse Module for the Hospital Management System built with MERN stack (MongoDB, Express.js, React, Node.js). This module is fully integrated with the centralized database and works seamlessly with Admin, Receptionist, and Doctor modules.

---

## Features Implemented

### 1. Authentication & Role-Based Access
- ✅ JWT authentication
- ✅ Role: Nurse
- ✅ Protected routes (only Nurse can access)
- ✅ Login required for all endpoints

### 2. Nurse Dashboard
**Display:**
- Total Assigned Patients
- Patients in Ward
- Critical Patients
- Tasks Pending
- Vitals Recorded Today
- Emergency Alerts

**API:**
```
GET /api/nurse/dashboard
```

### 3. Assigned Patients
- Show only patients assigned to the logged-in nurse
- Display: Name, Age, Gender, Room Number, Bed Number, Status, Ward, Doctor
- Search and filter by ward/status

**API:**
```
GET /api/nurse/patients?search=&ward=&status=
GET /api/nurse/patients/:id
```

### 4. Vitals Management
Nurse can record patient vitals with automatic critical alerts.

**Fields:**
- Patient Name
- Temperature (°F)
- Blood Pressure (Systolic/Diastolic)
- Pulse Rate (bpm)
- Oxygen Level (%)
- Respiratory Rate
- Notes

**Critical Alert Thresholds:**
- Temperature: > 103°F or < 95°F
- Blood Pressure: Systolic > 180 or < 80, Diastolic > 120 or < 50
- Pulse: > 120 or < 50 bpm
- Oxygen Level: < 90%

**API:**
```
POST /api/vitals
GET /api/vitals/patient/:patientId
GET /api/vitals/today
PUT /api/vitals/:id
```

### 5. Patient Care Notes
- Add daily notes for patient care
- Track recovery status
- Note types: General, Observation, Condition, Update, Emergency

**Fields:**
- Patient ID
- Note Type
- Notes
- Date (auto-generated)

**API:**
```
POST /api/nurse-notes
GET /api/nurse-notes/patient/:patientId
PUT /api/nurse-notes/:id
DELETE /api/nurse-notes/:id
```

### 6. Task Management
- Assign daily tasks (medication, checkup, etc.)
- Mark tasks as completed
- Priority levels: Low, Medium, High, Urgent
- Task types: Medication, Checkup, Vitals Check, Wound Care, IV Therapy, Patient Education, Other

**Fields:**
- Task Name
- Patient
- Task Type
- Priority
- Status (Pending / In Progress / Completed / Cancelled)
- Scheduled Time
- Description
- Notes

**API:**
```
POST /api/nurse/tasks
GET /api/nurse/tasks?status=&priority=&search=&page=&limit=
GET /api/nurse/tasks/stats
PUT /api/nurse/tasks/:id
DELETE /api/nurse/tasks/:id
```

### 7. Lab Reports View
- View lab reports of assigned patients
- Filter by patient and status
- Detailed report view

**API:**
```
GET /api/nurse/lab-reports?patientId=&status=&page=&limit=
GET /api/nurse/lab-reports/:id
```

### 8. Notifications
- Emergency alerts
- Doctor instructions
- New patient assigned
- Critical vitals alerts

**API:**
```
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
```

### 9. Profile Settings
- Update nurse profile
- Change password

**API:**
```
GET /api/nurse/profile
PUT /api/nurse/profile
PUT /api/nurse/change-password
```

---

## Database Models

### Relationships
- **Patient** → assignedNurse (User)
- **Vital** → Patient + Nurse
- **NurseNote** → Patient + Nurse
- **NurseTask** → Patient + Nurse
- **Notification** → Recipient (Nurse) + Patient

### Models Created/Updated
1. `User.js` - Already exists with Nurse role
2. `Patient.js` - Already has assignedNurse field
3. `Vital.js` - Already exists
4. `NurseNote.js` - Already exists
5. `NurseTask.js` - **NEW** - Task management
6. `Notification.js` - Already exists

---

## Frontend Structure

### Pages Created
1. `NurseDashboard.jsx` - Dashboard with stats
2. `NursePatients.jsx` - Assigned patients list
3. `NurseVitals.jsx` - Vitals recording with alerts
4. `NurseNotes.jsx` - Patient care notes
5. `NurseTasks.jsx` - **NEW** - Task management
6. `NurseLabReports.jsx` - **NEW** - Lab reports view
7. `NurseMedications.jsx` - Medication management
8. `NurseWardManagement.jsx` - Ward management
9. `NurseNotifications.jsx` - Notifications
10. `NurseProfile.jsx` - Profile settings

### Components
- `NurseLayout.jsx` - Sidebar navigation with all menu items

### Services
- `nurseApi.js` - All API calls for nurse module

### Routes Added to App.jsx
```jsx
<Route path="nurse-dashboard" element={<NurseDashboard />} />
<Route path="nurse-patients" element={<NursePatients />} />
<Route path="nurse-vitals" element={<NurseVitals />} />
<Route path="nurse-medications" element={<NurseMedications />} />
<Route path="nurse-notes" element={<NurseNotes />} />
<Route path="nurse-tasks" element={<NurseTasks />} />
<Route path="nurse-lab-reports" element={<NurseLabReports />} />
<Route path="nurse-ward" element={<NurseWardManagement />} />
<Route path="nurse-notifications" element={<NurseNotifications />} />
<Route path="nurse-profile" element={<NurseProfile />} />
```

---

## Backend Structure

### Controllers
1. `nurseController.js` - Dashboard & patients
2. `vitalController.js` - Vitals management with alerts
3. `nurseNoteController.js` - Care notes
4. `nurseTaskController.js` - **NEW** - Task management
5. `nurseLabController.js` - **NEW** - Lab reports
6. `nurseProfileController.js` - Profile settings

### Routes
1. `nurseRoutes.js` - Main nurse routes
2. `vitalRoutes.js` - Vitals routes
3. `nurseNoteRoutes.js` - Notes routes
4. `nurseTaskRoutes.js` - **NEW** - Task routes
5. `nurseLabRoutes.js` - **NEW** - Lab report routes

### Route Registration in server.js
```javascript
app.use('/api/nurse', require('./routes/nurseRoutes'));
app.use('/api/nurse/tasks', require('./routes/nurseTaskRoutes'));
app.use('/api/nurse/lab-reports', require('./routes/nurseLabRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/nurse-notes', require('./routes/nurseNoteRoutes'));
```

---

## Sidebar Navigation

```
┌─────────────────────────┐
│  🏥 Hospital HMS        │
├─────────────────────────┤
│  📊 Dashboard           │
│  👥 My Patients         │
│  ❤️  Vitals             │
│  💊 Medications         │
│  📝 Notes               │
│  ☑️  Tasks              │
│  🧪 Lab Reports         │
│  🛏️  Ward Management    │
│  🔔 Notifications       │
│  👤 Profile             │
└─────────────────────────┘
```

---

## API Endpoints Summary

### Dashboard & Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nurse/dashboard` | Get dashboard statistics |
| GET | `/api/nurse/patients` | Get assigned patients |
| GET | `/api/nurse/patients/:id` | Get patient details |

### Vitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vitals` | Record new vitals |
| GET | `/api/vitals/patient/:patientId` | Get patient vitals history |
| GET | `/api/vitals/today` | Get today's vitals |
| PUT | `/api/vitals/:id` | Update vitals |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/nurse-notes` | Add nurse note |
| GET | `/api/nurse-notes/patient/:patientId` | Get patient notes |
| PUT | `/api/nurse-notes/:id` | Update note |
| DELETE | `/api/nurse-notes/:id` | Delete note |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/nurse/tasks` | Create task |
| GET | `/api/nurse/tasks` | Get tasks (with pagination) |
| GET | `/api/nurse/tasks/stats` | Get task statistics |
| PUT | `/api/nurse/tasks/:id` | Update task |
| DELETE | `/api/nurse/tasks/:id` | Delete task |

### Lab Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nurse/lab-reports` | Get lab reports |
| GET | `/api/nurse/lab-reports/:id` | Get single report |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nurse/profile` | Get profile |
| PUT | `/api/nurse/profile` | Update profile |
| PUT | `/api/nurse/change-password` | Change password |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## Bonus Features Implemented

### ✅ Real-time Vitals Alerts
- Automatic detection of critical vital values
- Emergency notifications created instantly
- Patient status auto-updated to "Critical"
- Alert displayed to nurse immediately

### ✅ Critical Alert System
Monitors:
- Temperature abnormalities
- Blood pressure crises
- Abnormal pulse rates
- Low oxygen levels

### ✅ Search & Filter
- Search patients by name or room number
- Filter by ward and status
- Search tasks by name
- Filter tasks by status and priority
- Filter lab reports by patient and status

### ✅ Pagination
- Tasks: 20 per page
- Lab Reports: 20 per page
- Navigation controls included

---

## How to Use

### 1. Login as Nurse
```
Email: nurse@example.com
Password: (set by admin)
```

### 2. Navigate the Dashboard
- View summary statistics
- See critical patients at a glance
- Access quick actions

### 3. Record Vitals
1. Go to "Vitals" page
2. Select patient
3. Click "Record Vitals"
4. Fill in vital signs
5. Submit (alerts shown if critical)

### 4. Manage Tasks
1. Go to "Tasks" page
2. Click "Add Task"
3. Fill task details
4. Track progress (Pending → In Progress → Completed)

### 5. Add Care Notes
1. Go to "Notes" page
2. Select patient
3. Choose note type
4. Write observation
5. Submit

### 6. View Lab Reports
1. Go to "Lab Reports" page
2. Filter by patient/status
3. Click "View" for details

---

## Security Features

- ✅ JWT token authentication
- ✅ Role-based authorization middleware
- ✅ Patient access restricted to assigned nurse
- ✅ Data validation on all inputs
- ✅ Error handling on all endpoints
- ✅ Password hashing with bcrypt
- ✅ Protected API routes

---

## Integration with Other Modules

### Receptionist Module
- Receptionist adds patients and assigns nurses
- Nurse sees assigned patients immediately

### Doctor Module
- Doctors update patient diagnosis
- Nurses see updated medical records
- Doctors can view vitals recorded by nurses

### Lab Module
- Lab technicians create lab reports
- Nurses can view reports for their patients

### Admin Module
- Admin manages nurse accounts
- Admin can view all nurse activities

---

## Technology Stack

**Frontend:**
- React 18
- React Router
- Axios
- Lucide React (icons)
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

---

## File Structure

```
backend/
├── controllers/
│   ├── nurseController.js
│   ├── nurseTaskController.js (NEW)
│   ├── nurseLabController.js (NEW)
│   ├── nurseProfileController.js
│   ├── vitalController.js
│   └── nurseNoteController.js
├── models/
│   ├── NurseTask.js (NEW)
│   ├── Patient.js
│   ├── Vital.js
│   ├── NurseNote.js
│   ├── Notification.js
│   └── User.js
├── routes/
│   ├── nurseRoutes.js
│   ├── nurseTaskRoutes.js (NEW)
│   ├── nurseLabRoutes.js (NEW)
│   ├── vitalRoutes.js
│   └── nurseNoteRoutes.js
└── server.js

hospital-management/
├── src/
│   ├── pages/
│   │   ├── NurseDashboard.jsx
│   │   ├── NursePatients.jsx
│   │   ├── NurseVitals.jsx
│   │   ├── NurseNotes.jsx
│   │   ├── NurseTasks.jsx (NEW)
│   │   ├── NurseLabReports.jsx (NEW)
│   │   ├── NurseMedications.jsx
│   │   ├── NurseWardManagement.jsx
│   │   ├── NurseNotifications.jsx
│   │   └── NurseProfile.jsx
│   ├── components/
│   │   └── NurseLayout.jsx
│   └── services/
│       └── nurseApi.js
```

---

## Testing

### Create Test Nurse Account
Run in MongoDB or via Admin panel:
```javascript
{
  name: "Test Nurse",
  email: "nurse@example.com",
  password: "nurse123",
  role: "Nurse",
  status: "Active"
}
```

### Assign Patients to Nurse
Via Admin or Receptionist panel, assign patients to the nurse.

### Test Features
1. ✅ Login as nurse
2. ✅ View dashboard stats
3. ✅ View assigned patients
4. ✅ Record vitals (test critical alerts)
5. ✅ Add care notes
6. ✅ Create and manage tasks
7. ✅ View lab reports
8. ✅ Check notifications
9. ✅ Update profile
10. ✅ Change password

---

## Future Enhancements

- [ ] Real-time WebSocket updates for vitals
- [ ] Push notifications for critical alerts
- [ ] Vitals trend charts/graphs
- [ ] Export reports to PDF
- [ ] Mobile responsive improvements
- [ ] Shift management
- [ ] Handover notes between nurses
- [ ] Medication schedule automation
- [ ] Integration with medical devices

---

## Support

For issues or questions:
- Check API responses for error messages
- Verify nurse is assigned to patients
- Ensure MongoDB is running
- Check JWT token validity
- Review browser console for frontend errors

---

## License

Part of Hospital Management System - Internal Use

---

**Module Status: ✅ COMPLETE & READY FOR PRODUCTION**

All requested features have been implemented and tested. The Nurse Module is fully functional and integrated with the centralized database.
