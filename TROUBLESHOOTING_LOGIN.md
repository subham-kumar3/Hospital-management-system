# 🔧 Troubleshooting - Login Not Working

## ❌ **Problem: Nurse, Receptionist, Patient Login Not Working**

### **Solution: You Need to Re-Run the Seeder!**

The users were added to the seeder file, but you need to run it to create them in the database.

---

## ✅ **STEP-BY-STEP FIX:**

### **Step 1: Stop Your Backend (if running)**
Press `Ctrl + C` in the backend terminal

### **Step 2: Run the Seeder**
```bash
cd backend
node seeder.js
```

**You should see this output:**
```
Starting database seeding...
✅ Cleared existing data
✅ Patients added: 3
✅ Doctors added: 3
✅ Departments added: 8
✅ Doctor users created: 3
✅ Nurse users created: 2
✅ Receptionist users created: 1
✅ Patient users created: 2
✅ Appointments added: 2
✅ Medical records added: 2

🎉 Database seeded successfully!

🔐 LOGIN CREDENTIALS:

👨‍💼 ADMIN:
   Email: admin@hospital.com
   Password: admin123

👨‍⚕️ DOCTORS:
   Email: dr.emily@hospital.com | Password: doctor123 (Cardiology)
   Email: dr.michael@hospital.com | Password: doctor123 (Neurology)
   Email: dr.lisa@hospital.com | Password: doctor123 (Orthopedics)

👩‍⚕️ NURSES:
   Email: nurse.sarah@hospital.com | Password: nurse123
   Email: nurse.james@hospital.com | Password: nurse123

👨‍💼 RECEPTIONIST:
   Email: receptionist@hospital.com | Password: receptionist123

🧑 PATIENTS:
   Email: patient.john@email.com | Password: patient123
   Email: patient.sarah@email.com | Password: patient123
```

### **Step 3: Start Backend Again**
```bash
npm start
```

### **Step 4: Try Login Again**
1. Open: `http://localhost:5173`
2. Click the quick login button for Nurse, Receptionist, or Patient
3. It should work now! ✅

---

## 🐛 **Still Not Working? Check These:**

### **1. Check if MongoDB is Running**
```bash
# On Mac
brew services list | grep mongodb

# On Windows
net start MongoDB

# On Linux
sudo systemctl status mongod
```

### **2. Check Backend Console**
Look for errors in the backend terminal. You should see:
```
Server running in development mode on port 5001
✅ MongoDB Connected
```

### **3. Check Browser Console (F12)**
Look for errors when clicking login. You should see:
```
🔐 Login successful! User data: {...}
👤 User role: Nurse
➡️ Redirecting to Admin Dashboard (Nurse)
```

### **4. Clear Browser Data**
Sometimes old data causes issues:
1. Open browser console (F12)
2. Go to Application tab
3. Clear all localStorage
4. Refresh page and try again

OR run this in browser console:
```javascript
localStorage.clear()
location.reload()
```

### **5. Test API Directly**
Open terminal and test:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse.sarah@hospital.com","password":"nurse123"}'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Nurse Sarah",
    "email": "nurse.sarah@hospital.com",
    "role": "Nurse",
    "token": "..."
  }
}
```

---

## 📋 **Common Errors:**

### **Error: "Invalid credentials"**
**Cause:** User doesn't exist in database
**Fix:** Run the seeder: `node seeder.js`

### **Error: "Cannot connect to server"**
**Cause:** Backend not running
**Fix:** Start backend: `npm start` in backend folder

### **Error: "Network error"**
**Cause:** MongoDB not running
**Fix:** Start MongoDB service

### **Login works but redirects to wrong page**
**Cause:** Old cached data
**Fix:** Clear localStorage and refresh

---

## 🎯 **Quick Test Commands:**

### **Check if users exist in database:**
```bash
# Open MongoDB shell or MongoDB Compass
# Check the "users" collection
# You should see 9 users total
```

### **Check user count via API:**
```bash
# Login as admin first, then check
```

---

## ✅ **Verification Checklist:**

- [ ] MongoDB is running
- [ ] Backend server is running on port 5001
- [ ] You ran `node seeder.js` successfully
- [ ] Seeder showed "Nurse users created: 2"
- [ ] Seeder showed "Receptionist users created: 1"
- [ ] Seeder showed "Patient users created: 2"
- [ ] Frontend is running on port 5173
- [ ] Browser console shows no errors
- [ ] Quick login buttons are visible on login page

---

## 🚀 **The Fix:**

**99% of the time, the issue is:**
You didn't run the seeder AFTER I updated it!

**Solution:**
```bash
cd backend
node seeder.js
npm start
```

Then try login again! 🎉
