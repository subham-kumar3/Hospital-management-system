# 🔐 All Login Credentials - Hospital Management System

## Quick Reference Guide

### 👨‍💼 **Admin Login**
- **Email:** `admin@hospital.com`
- **Password:** `admin123`
- **Access:** Full system access, manage all modules
- **Dashboard:** `/dashboard`

---

### 👨‍⚕️ **Doctor Logins**

#### Doctor 1 - Cardiology
- **Email:** `dr.emily@hospital.com`
- **Password:** `doctor123`
- **Name:** Dr. Emily Brown
- **Department:** Cardiology
- **Dashboard:** `/doctor-dashboard`

#### Doctor 2 - Neurology
- **Email:** `dr.michael@hospital.com`
- **Password:** `doctor123`
- **Name:** Dr. Michael Chen
- **Department:** Neurology
- **Dashboard:** `/doctor-dashboard`

---

### 👩‍⚕️ **Nurse Logins**

#### Nurse 1
- **Email:** `nurse.sarah@hospital.com`
- **Password:** `nurse123`
- **Name:** Nurse Sarah
- **Dashboard:** `/nurse-dashboard`

#### Nurse 2
- **Email:** `nurse.james@hospital.com`
- **Password:** `nurse123`
- **Name:** Nurse James
- **Dashboard:** `/nurse-dashboard`

---

### 👨‍💼 **Receptionist Login**
- **Email:** `receptionist@hospital.com`
- **Password:** `receptionist123`
- **Access:** Appointments, Patient Registration, Billing
- **Dashboard:** `/receptionist-dashboard`

---

### 🧑 **Patient Logins**

#### Patient 1
- **Email:** `patient.john@email.com`
- **Password:** `patient123`
- **Name:** John Smith
- **Status:** Admitted
- **Dashboard:** `/patient/dashboard`

#### Patient 2
- **Email:** `patient.sarah@email.com`
- **Password:** `patient123`
- **Name:** Sarah Johnson
- **Status:** Stable
- **Dashboard:** `/patient/dashboard`

---

## 📋 **Complete Credentials Table**

| Role | Email | Password | Dashboard Route |
|------|-------|----------|----------------|
| **Admin** | admin@hospital.com | admin123 | /dashboard |
| **Doctor (Cardiology)** | dr.emily@hospital.com | doctor123 | /doctor-dashboard |
| **Doctor (Neurology)** | dr.michael@hospital.com | doctor123 | /doctor-dashboard |
| **Nurse 1** | nurse.sarah@hospital.com | nurse123 | /nurse-dashboard |
| **Nurse 2** | nurse.james@hospital.com | nurse123 | /nurse-dashboard |
| **Receptionist** | receptionist@hospital.com | receptionist123 | /receptionist-dashboard |
| **Patient 1** | patient.john@email.com | patient123 | /patient/dashboard |
| **Patient 2** | patient.sarah@email.com | patient123 | /patient/dashboard |

---

## 🚀 **How to Use**

1. **Start the Backend Server:**
```bash
cd backend
npm start
```

2. **Start the Frontend:**
```bash
cd hospital-management
npm run dev
```

3. **Open Login Page:**
   - Go to: `http://localhost:5173/login`
   - All credentials are displayed on the login page
   - Click "Quick Login" buttons for instant access

4. **Database Seeding (First Time Only):**
```bash
cd backend
npm run seed
```

---

## 🎯 **Features by Role**

### Admin
- ✅ Manage all doctors, nurses, receptionists
- ✅ View all appointments & patients
- ✅ Department management
- ✅ Full system access
- ✅ Generate reports

### Doctor
- ✅ View today's appointments
- ✅ Manage patient consultations
- ✅ Write prescriptions
- ✅ Order lab tests
- ✅ Add medical notes
- ✅ View patient history & vitals
- ✅ Receive notifications

### Nurse
- ✅ View assigned patients
- ✅ Record patient vitals
- ✅ Track medication administration
- ✅ Add nursing notes
- ✅ Manage ward/bed allocation
- ✅ Receive alerts from doctors

### Receptionist
- ✅ Register new patients
- ✅ Schedule appointments
- ✅ Manage patient inquiries
- ✅ Generate bills & invoices
- ✅ View doctor schedules

### Patient
- ✅ Book appointments
- ✅ View medical records
- ✅ View prescriptions
- ✅ View lab reports
- ✅ View bills
- ✅ Update profile

---

## 🔒 **Security Notes**

- All passwords are hashed using bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Session timeout after 30 days
- Password minimum length: 6 characters

---

## 📝 **Testing Tips**

1. **Test Role-Based Access:**
   - Login as different roles
   - Try accessing different dashboards
   - Verify role restrictions work

2. **Test Features:**
   - Admin: Create new doctor/nurse
   - Doctor: Order lab test, write prescription
   - Nurse: Record vitals, give medication
   - Patient: Book appointment, view records

3. **Test Notifications:**
   - Doctor orders lab test → Lab gets notification
   - Admin creates user → User can login immediately

---

## 🆘 **Troubleshooting**

### Login Not Working?
1. Make sure backend is running on port 5000
2. Check if database is seeded: `npm run seed`
3. Verify MongoDB connection in `.env` file
4. Check browser console for errors

### Can't See Dashboard?
1. Check user role in database
2. Verify JWT token is stored in localStorage
3. Clear browser cache and try again
4. Re-login with correct credentials

### Database Issues?
1. Stop MongoDB service
2. Delete database: `db.dropDatabase()`
3. Re-run seed: `npm run seed`
4. Restart backend server

---

## 📞 **Support**

For any issues or questions:
- Check the implementation guides in the project root
- Review the API documentation
- Check backend logs for errors
- Verify all dependencies are installed

---

**Last Updated:** April 2026
**System Version:** 2.0
**Total User Accounts:** 8
