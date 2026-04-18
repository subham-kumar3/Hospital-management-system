# 🚀 Quick Start Guide - Login to Hospital Management System

## ⚡ **3 STEPS TO LOGIN**

### **Step 1: Seed Database (One Time Only)**
```bash
cd backend
npm run seed
```

**You should see:**
```
🔐 LOGIN CREDENTIALS:

👨‍💼 ADMIN:
   Email: admin@hospital.com
   Password: admin123

👨‍⚕️ DOCTORS:
   Email: dr.emily@hospital.com | Password: doctor123
   ...
```

### **Step 2: Start Backend**
```bash
cd backend
npm start
```

**You should see:**
```
Server running in development mode on port 5001
✅ MongoDB Connected
```

### **Step 3: Start Frontend (New Terminal)**
```bash
cd hospital-management
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### **Step 4: Open Browser & Login**
1. Open: `http://localhost:5173`
2. Click any quick login button OR enter credentials manually
3. You're in! 🎉

---

## 🎯 **QUICK LOGIN BUTTONS**

The login page has **one-click buttons** for:
- ✅ Admin
- ✅ Dr. Emily (Cardiology)
- ✅ Dr. Michael (Neurology)
- ✅ Nurse Sarah
- ✅ Receptionist
- ✅ Patient John

**Just click and you're logged in!**

---

## 📱 **TEST ALL ROLES**

Try logging in as different roles to see different dashboards:

1. **Admin** - See everything
2. **Doctor** - See prescriptions & patients
3. **Nurse** - See patient care
4. **Receptionist** - See appointments & billing
5. **Patient** - See own data

---

## ❓ **Need Help?**

- Check `LOGIN_GUIDE.md` for full credentials list
- Check `IMPLEMENTATION_SUMMARY.md` for system overview
- Check browser console (F12) for errors

**That's it! You're ready to use the system! 🏥**
