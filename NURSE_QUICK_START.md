# Nurse Module - Quick Start Guide

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running
- Backend server running
- Frontend dev server running

---

## 1. Start the Backend

```bash
cd backend
npm start
```

---

## 2. Start the Frontend

```bash
cd hospital-management
npm run dev
```

---

## 3. Create Nurse Account

### Via Admin Panel:
1. Login as Admin
2. Go to User Management
3. Add User with role "Nurse"
4. Set email and password

---

## 4. Assign Patients to Nurse

Via Admin or Receptionist:
1. Open patient record
2. Set "Assigned Nurse" field
3. Save

---

## 5. Login as Nurse

1. Go to login page
2. Enter nurse credentials
3. You'll be redirected to Nurse Dashboard

---

## 6. Use the Module

### Dashboard
- View stats: total patients, critical patients, pending tasks
- Quick action buttons

### Record Vitals
1. Click "Vitals" in sidebar
2. Select patient
3. Click "Record Vitals"
4. Enter values
5. Submit (alert if critical)

### Manage Tasks
1. Click "Tasks"
2. Click "Add Task"
3. Fill details
4. Track: Pending → In Progress → Completed

### Add Notes
1. Click "Notes"
2. Select patient
3. Choose note type
4. Write observation
5. Submit

### View Lab Reports
1. Click "Lab Reports"
2. Filter by patient/status
3. Click "View"

---

## Test Critical Alerts

Enter these values to test:
- Temperature: 104°F (critical)
- BP: 190/130 (critical)
- Pulse: 130 bpm (critical)
- O2 Level: 85% (critical)

You should see an emergency alert!

---

## Common Issues

### No patients showing?
- Make sure patients are assigned to your nurse account
- Check Admin panel

### Can't login?
- Verify credentials
- Check if account is Active

### API errors?
- Ensure backend is running
- Check MongoDB connection
- Verify JWT token

---

## Next Steps

- Explore all features
- Record vitals for patients
- Create tasks
- Add care notes
- Check notifications

---

**Enjoy using the Nurse Module! 🏥**
