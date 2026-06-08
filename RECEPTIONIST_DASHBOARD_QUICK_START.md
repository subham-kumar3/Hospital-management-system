# 🚀 Quick Start Guide - Receptionist Dashboard

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB running locally or MongoDB Atlas account

---

## 📦 Installation

### 1. Navigate to the project directory
```bash
cd /Users/shubhamkumar/Desktop/Hospital-management-executed-system-new
```

### 2. Install dependencies (if not already installed)
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../hospital-management
npm install
```

### 3. Set up environment variables

Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-management
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

---

## 🏃 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd hospital-management
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Option 2: Using Docker
```bash
docker-compose up
```

---

## 👤 Login as Receptionist

### Test Credentials

**Receptionist Account:**
- Email: `receptionist@hospital.com`
- Password: `receptionist123`

**If the account doesn't exist, create one:**

1. Login as Admin:
   - Email: `admin@hospital.com`
   - Password: `admin123`

2. Navigate to Admin Dashboard → User Management

3. Create new user:
   - Name: Receptionist User
   - Email: `receptionist@hospital.com`
   - Password: `receptionist123`
   - Role: Receptionist

---

## 🎯 Accessing the Dashboard

1. Open browser: `http://localhost:5173/login`
2. Enter receptionist credentials
3. You'll be redirected to: `http://localhost:5173/receptionist-dashboard`

---

## 📋 Dashboard Features

### Main Dashboard (`/receptionist-dashboard`)
- **Stats Overview**: Total Patients, Today's Appointments, Pending Bills, Enquiries
- **Quick Actions**: Fast access to common tasks
- **Today's Appointments**: Searchable list with status
- **Pending Bills**: Bills requiring attention
- **Recent Enquiries**: Latest patient queries
- **Recent Patients**: Newly registered patients

### Patient Registration (`/patient-registration`)
- Register new patients
- Auto-generate Patient ID
- Form validation
- Quick navigation to appointment booking

### Patient List (`/patient-list`)
- View all registered patients
- Search and filter
- Patient details

### Appointments (`/receptionist-appointments`)
- Book new appointments
- View all appointments
- Manage appointment status
- Filter by date/status

### Doctor Schedule (`/doctor-schedule`)
- View all doctors
- Filter by department
- See weekly schedules
- Doctor availability

### Billing (`/billing`)
- View all bills
- Search bills
- Filter by payment status
- View invoices

### Enquiries (`/enquiries`)
- Create new enquiries
- Update enquiry status
- Priority management
- Contact information

### Notifications (`/notifications`)
- View all notifications
- Mark as read
- Filter notifications
- Delete notifications

### Profile Settings (`/receptionist-profile`)
- Update profile information
- Change password
- View account details

---

## 🎨 UI Features

### Modern Design Elements
✅ Gradient backgrounds  
✅ Card-based layout  
✅ Smooth animations  
✅ Hover effects  
✅ Loading spinners  
✅ Empty states  
✅ Status badges  
✅ Priority indicators  

### Responsive Design
✅ Desktop optimized  
✅ Tablet friendly  
✅ Mobile responsive  
✅ Touch-friendly buttons  

### Interactive Components
✅ Search functionality  
✅ Filter options  
✅ Real-time updates  
✅ Form validation  
✅ Error handling  

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod --version

# Check if port 5000 is available
lsof -i :5000
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
cd hospital-management
rm -rf node_modules package-lock.json
npm install
```

### Can't login
1. Check backend is running
2. Verify MongoDB connection
3. Check browser console for errors
4. Verify credentials

### API errors
1. Check backend logs
2. Verify API endpoints
3. Check authentication token
4. Review CORS settings

---

## 📊 Sample Data

To seed the database with sample data:
```bash
cd backend
npm run seed
```

This will create:
- Admin user
- Receptionist user
- Sample patients
- Sample doctors
- Sample appointments
- Sample departments

---

## 🎯 Testing the Dashboard

### 1. View Stats
- Check if stats cards show correct numbers
- Verify trend indicators

### 2. Test Quick Actions
- Click each quick action button
- Verify navigation works

### 3. Search Functionality
- Search appointments by patient name
- Search bills by bill number
- Search enquiries by subject

### 4. Filter Options
- Filter bills by payment status
- Filter notifications by read/unread
- Filter doctors by department

### 5. Forms
- Register a new patient
- Create a new enquiry
- Book an appointment

### 6. Status Updates
- Update enquiry status
- Mark notifications as read
- Change appointment status

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

## 📱 Mobile Testing

Test responsive design:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select different devices
4. Test all features

---

## 🚀 Performance Tips

1. **Use Production Build**
   ```bash
   cd hospital-management
   npm run build
   npm run preview
   ```

2. **Enable Compression**
   - Backend already configured with compression

3. **Use CDN for Production**
   - Consider using CDN for assets

---

## 📚 Additional Resources

- [Full Implementation Guide](RECEPTIONIST_DASHBOARD_IMPLEMENTATION.md)
- [Visual Guide](RECEPTIONIST_DASHBOARD_VISUAL_GUIDE.md)
- [Main README](README.md)

---

## 🐛 Known Issues

None at this time. If you encounter any issues, please check:
1. Console for errors
2. Network tab for API failures
3. Backend logs
4. Database connection

---

## 📞 Support

For issues or questions:
1. Check console errors
2. Review implementation guide
3. Verify API endpoints
4. Check database connection

---

## ✅ Checklist

Before going to production:
- [ ] Test all features
- [ ] Verify API endpoints
- [ ] Check responsive design
- [ ] Test on multiple browsers
- [ ] Review error handling
- [ ] Verify security settings
- [ ] Update environment variables
- [ ] Set up proper MongoDB
- [ ] Configure CORS
- [ ] Set up SSL/HTTPS

---

**Happy Managing! 🏥**
