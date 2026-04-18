# 🔐 Hospital Management System - Login Guide

## 📋 **STEP-BY-STEP LOGIN PROCESS**

### **Step 1: Seed the Database (First Time Only)**

Before you can login, you need to create user accounts in the database.

```bash
# Navigate to backend folder
cd backend

# Run the seeder to create all users
npm run seed
# OR
node seeder.js
```

**This will create:**
- ✅ 1 Admin account
- ✅ 3 Doctor accounts
- ✅ 2 Nurse accounts
- ✅ 1 Receptionist account
- ✅ 2 Patient accounts
- ✅ Sample patients, doctors, appointments

---

## 👥 **LOGIN CREDENTIALS FOR ALL ROLES**

### 👨‍💼 **ADMIN** (Full Access)
```
Email: admin@hospital.com
Password: admin123
Dashboard: /dashboard
Access: Everything (Manage doctors, patients, appointments, bills, reports)
```

### 👨‍⚕️ **DOCTORS** (Own Patients & Appointments)
```
Doctor 1 (Cardiology):
Email: dr.emily@hospital.com
Password: doctor123
Dashboard: /doctor-dashboard

Doctor 2 (Neurology):
Email: dr.michael@hospital.com
Password: doctor123
Dashboard: /doctor-dashboard

Doctor 3 (Orthopedics):
Email: dr.lisa@hospital.com
Password: doctor123
Dashboard: /doctor-dashboard

Access: View patients, create prescriptions, view appointments
```

### 👩‍⚕️ **NURSES** (Patient Care)
```
Nurse 1:
Email: nurse.sarah@hospital.com
Password: nurse123

Nurse 2:
Email: nurse.james@hospital.com
Password: nurse123

Access: View patients, update medical records, view appointments
```

### 👨‍💼 **RECEPTIONIST** (Front Desk)
```
Email: receptionist@hospital.com
Password: receptionist123

Access: Manage appointments, create bills, manage patients
```

### 🧑 **PATIENTS** (Own Data Only)
```
Patient 1:
Email: patient.john@email.com
Password: patient123

Patient 2:
Email: patient.sarah@email.com
Password: patient123

Access: View own appointments, view prescriptions, view bills
```

---

## 🚀 **HOW TO START THE SYSTEM**

### **1. Start Backend Server**
```bash
cd backend
npm start
```
**Backend will run on:** `http://localhost:5001`

### **2. Start Frontend (New Terminal)**
```bash
cd hospital-management
npm run dev
```
**Frontend will run on:** `http://localhost:5173`

### **3. Open Browser**
Go to: `http://localhost:5173`

You'll see the login page automatically!

---

## 🎯 **QUICK LOGIN STEPS**

1. **Open** `http://localhost:5173`
2. **Enter** email and password from the credentials above
3. **Click** "Sign In" button
4. **You'll be redirected** to your role-specific dashboard

---

## 🎨 **LOGIN PAGE FEATURES**

The login page includes:
- ✅ Email and password fields
- ✅ Error messages for invalid credentials
- ✅ Loading state during login
- ✅ Quick login buttons for doctors (on the page)
- ✅ Demo data option (browse without login)

---

## 🔄 **PASSWORD RESET**

If you forget passwords, just re-run the seeder:
```bash
cd backend
npm run seed
```

This will reset all users to default passwords.

---

## 🛡️ **SECURITY NOTES**

- All passwords are **hashed** using bcrypt (never stored as plain text)
- JWT tokens are used for authentication
- Each role has **different access permissions**
- Protected routes prevent unauthorized access

---

## 📱 **WHAT EACH ROLE CAN DO**

### **Admin Dashboard:**
- ✅ View all statistics
- ✅ Manage doctors (add/edit/delete)
- ✅ Manage patients
- ✅ View all appointments
- ✅ View all prescriptions
- ✅ View all bills
- ✅ Generate reports

### **Doctor Dashboard:**
- ✅ View assigned patients
- ✅ View today's appointments
- ✅ Create prescriptions
- ✅ Update patient records
- ✅ View own schedule

### **Nurse Dashboard:**
- ✅ View patient list
- ✅ Update patient vitals
- ✅ View medical records
- ✅ Assist with appointments

### **Receptionist Dashboard:**
- ✅ Manage appointments (book/update/cancel)
- ✅ Create and manage bills
- ✅ Patient check-in/check-out
- ✅ View daily schedule

### **Patient Dashboard:**
- ✅ View own appointments
- ✅ View prescriptions
- ✅ View bills
- ✅ Book new appointments

---

## 🐛 **TROUBLESHOOTING**

### **Problem: "Invalid credentials" error**
**Solution:** 
1. Make sure you ran the seeder: `npm run seed`
2. Check if MongoDB is running
3. Verify email/password spelling (case-sensitive)

### **Problem: Can't connect to server**
**Solution:**
1. Make sure backend is running: `npm start` in backend folder
2. Check if MongoDB is running
3. Verify port 5001 is not blocked

### **Problem: Login redirects to wrong dashboard**
**Solution:**
1. Clear browser localStorage
2. Logout and login again
3. Check user role in database

### **Problem: No data showing after login**
**Solution:**
1. Run the seeder to populate data
2. Check browser console for errors
3. Verify API is running on port 5001

---

## 💡 **TIPS**

1. **Start with Admin** - Login as admin first to see all features
2. **Test different roles** - Try logging in as different users
3. **Check console** - Open browser console (F12) to see logs
4. **Quick access** - Login page has quick buttons for doctors

---

## 📞 **DEFAULT CREDENTIALS SUMMARY**

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@hospital.com | admin123 |
| **Doctor 1** | dr.emily@hospital.com | doctor123 |
| **Doctor 2** | dr.michael@hospital.com | doctor123 |
| **Doctor 3** | dr.lisa@hospital.com | doctor123 |
| **Nurse 1** | nurse.sarah@hospital.com | nurse123 |
| **Nurse 2** | nurse.james@hospital.com | nurse123 |
| **Receptionist** | receptionist@hospital.com | receptionist123 |
| **Patient 1** | patient.john@email.com | patient123 |
| **Patient 2** | patient.sarah@email.com | patient123 |

---

## 🎉 **YOU'RE READY!**

1. Run seeder: `cd backend && npm run seed`
2. Start backend: `npm start`
3. Start frontend: `cd hospital-management && npm run dev`
4. Open browser: `http://localhost:5173`
5. Login with any credentials above
6. Explore the system!

**Happy Managing! 🏥**
