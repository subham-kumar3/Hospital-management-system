# 🏥 Complete Hospital Management System

A full-stack Hospital Management System with React frontend, Node.js/Express backend, MongoDB database, and Docker support.

## 🌟 Features

### Multi-Role Dashboard
- ✅ **Admin** - Complete system management
- ✅ **Doctor** - Patient care and appointments
- ✅ **Nurse** - Patient monitoring and vitals
- ✅ **Receptionist** - Appointments and enquiries
- ✅ **Patient** - Personal health records
- ✅ **Pharmacist** - Medicine and pharmacy bills
- ✅ **Lab Technician** - Lab tests and reports

### Frontend (React + Vite)
- ✅ Modern, responsive UI design
- ✅ Authentication with login system
- ✅ Protected routes for each role
- ✅ Real-time data from backend API
- ✅ Interactive dashboards with statistics
- ✅ Patient Management (CRUD operations)
- ✅ Doctor Management (CRUD operations)
- ✅ Appointment Scheduling
- ✅ Medical Records
- ✅ Department Management
- ✅ Pharmacy Module
- ✅ Laboratory Module
- ✅ Inventory Management
- ✅ Billing System
- ✅ Notifications System
- ✅ Search and filtering capabilities

### Backend (Node.js + Express)
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ MongoDB database integration
- ✅ Real-time WebSocket (Socket.io)
- ✅ Data validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Account lockout security

### Database (MongoDB + Mongoose)
- ✅ User authentication model
- ✅ Patient records
- ✅ Doctor profiles
- ✅ Appointment scheduling
- ✅ Medical history tracking
- ✅ Pharmacy & inventory
- ✅ Laboratory tests & reports
- ✅ Billing system
- ✅ Relationships between collections

### Docker Support
- ✅ Docker Compose for all services
- ✅ Containerized MongoDB
- ✅ Containerized Backend
- ✅ Containerized Frontend
- ✅ Easy deployment and scaling

## 📁 Project Structure

```
Hospital management executed system/
├── hospital-management/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/           # Layout components
│   │   ├── pages/                # Page components
│   │   ├── context/              # React Context (Auth)
│   │   ├── services/             # API services
│   │   ├── styles/               # Global styles
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── backend/                      # Backend (Node.js + Express)
│   ├── config/                   # Database configuration
│   ├── models/                   # Mongoose models
│   ├── controllers/              # Route controllers
│   ├── routes/                   # API routes
│   ├── middleware/               # Auth middleware
│   ├── services/                 # Socket.io service
│   ├── utils/                    # Utility functions
│   ├── .env                      # Environment variables
│   ├── server.js                 # Server entry point
│   ├── seeder.js                 # Database seeder
│   └── Dockerfile
│
├── docker-compose.yml            # Docker configuration
├── docker-start.sh               # Docker startup script
└── README.md                     # This file
```

## 🚀 Getting Started

### Option 1: Using Docker (Recommended) ⭐

#### Prerequisites
- Docker Desktop installed and running

#### Quick Start with Docker

```bash
# Clone the repository
cd "Hospital management executed system new"

# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d --build

# Seed the database with sample data
docker exec hospital-backend node seeder.js
```

**That's it!** Your system is now running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **MongoDB:** localhost:27017

#### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and start fresh
docker-compose down
docker-compose up -d --build
docker exec hospital-backend node seeder.js
```

### Option 2: Manual Installation

#### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

#### Installation Steps

##### 1. Install MongoDB

**For macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Windows:**
Download from: https://www.mongodb.com/try/download/community

**For Linux:**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

##### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created)
# Update MONGODB_URI if needed

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

##### 3. Setup Frontend

Open a new terminal:

```bash
cd hospital-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Login Credentials

### 👨‍💼 Admin
- **Email:** admin@hospital.com
- **Password:** admin123

### 👨‍⚕️ Doctors
- **Email:** dr.emily@hospital.com | **Password:** doctor123 (Cardiology)
- **Email:** dr.michael@hospital.com | **Password:** doctor123 (Neurology)
- **Email:** dr.lisa@hospital.com | **Password:** doctor123 (Orthopedics)

### 👩‍⚕️ Nurses
- **Email:** nurse.sarah@hospital.com | **Password:** nurse123
- **Email:** nurse.james@hospital.com | **Password:** nurse123

### 👨‍💼 Receptionist
- **Email:** receptionist@hospital.com
- **Password:** receptionist123

### 🧑 Patients
- **Email:** patient.john@email.com | **Password:** patient123
- **Email:** patient.sarah@email.com | **Password:** patient123

## 📊 Database Models

### User
- name, email, password (hashed)
- role (Admin, Doctor, Receptionist, Nurse, Patient, Pharmacist, Lab Technician)
- isActive, isFirstLogin
- loginAttempts, lockUntil

### Patient
- name, age, gender, bloodGroup
- phone, email, address
- admittedDate, status
- ward, roomNumber, bedNumber
- assignedDoctor, assignedNurse
- medicalHistory

### Doctor
- name, specialization, qualification
- experience, phone, email
- department, status
- availability, consultationFee

### Appointment
- patient (ref), doctor (ref)
- date, time, type
- status, notes
- department

### MedicalRecord
- patient (ref), doctor (ref)
- diagnosis, treatment, type
- symptoms, medications
- labTests, notes

### Medicine
- name, genericName, manufacturer
- price, stock, expiryDate
- category, description

### Bill
- patient (ref), billNumber
- items, totalAmount
- status, paymentMethod
- dueDate

### LabTest
- testName, testType, description
- price, turnaroundTime
- status, priority

### Department
- name, description
- floor, equipment
- phone, email, status

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search/:keyword` - Search patients

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/search/:keyword` - Search doctors
- `GET /api/doctors/department/:department` - Get by department

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/date/:date` - Get by date
- `GET /api/appointments/status/:status` - Get by status

### Pharmacy
- `GET /api/pharmacy/medicines` - Get all medicines
- `POST /api/pharmacy/medicines` - Add medicine
- `PUT /api/pharmacy/medicines/:id` - Update medicine
- `DELETE /api/pharmacy/medicines/:id` - Delete medicine
- `GET /api/pharmacy/bills` - Get pharmacy bills
- `POST /api/pharmacy/bills` - Create bill

### Laboratory
- `GET /api/lab/tests` - Get all lab tests
- `POST /api/lab/tests` - Create lab test
- `PUT /api/lab/tests/:id` - Update test
- `GET /api/lab/samples` - Get samples
- `POST /api/lab/samples` - Add sample
- `GET /api/lab/reports` - Get reports

### Inventory
- `GET /api/inventory/items` - Get inventory items
- `POST /api/inventory/items` - Add item
- `PUT /api/inventory/items/:id` - Update item
- `GET /api/inventory/purchases` - Get purchases
- `POST /api/inventory/purchases` - Create purchase

### Billing
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `PUT /api/bills/:id` - Update bill
- `GET /api/bills/:id` - Get single bill

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification (Admin)
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread-count` - Get unread count

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Vitals
- `GET /api/vitals/patient/:patientId` - Get patient vitals
- `POST /api/vitals` - Record vitals
- `PUT /api/vitals/:id` - Update vitals

### Enquiries
- `GET /api/enquiries` - Get all enquiries
- `POST /api/enquiries` - Create enquiry
- `PUT /api/enquiries/:id` - Update enquiry
- `DELETE /api/enquiries/:id` - Delete enquiry

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - Object modeling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🎯 Key Features Explained

### 1. Authentication System
- Secure login with JWT tokens
- Token stored in localStorage
- Protected routes redirect to login
- Password hashing with bcrypt
- Account lockout after 5 failed attempts (2 hours)
- Role-based access control

### 2. Patient Management
- Add, edit, delete patients
- Search functionality
- View patient details
- Track medical history
- Assign to doctors and nurses
- Ward and bed management

### 3. Doctor Management
- Manage doctor profiles
- Filter by department
- Track availability
- Consultation fees
- Patient assignments

### 4. Appointment Scheduling
- Book appointments
- Confirm/Cancel appointments
- Filter by date or status
- Link to patients and doctors
- Department-wise scheduling

### 5. Medical Records
- Comprehensive patient history
- Diagnosis and treatment tracking
- Lab test results
- Prescription management
- Doctor and nurse notes

### 6. Pharmacy Module
- Medicine inventory management
- Pharmacy billing
- Stock tracking
- Expiry date monitoring
- Prescription fulfillment

### 7. Laboratory Module
- Lab test management
- Sample collection tracking
- Report generation
- Priority handling
- Status notifications

### 8. Inventory Management
- Stock management
- Purchase orders
- Low stock alerts
- Supplier tracking

### 9. Billing System
- Patient billing
- Payment tracking
- Multiple payment methods
- Due date management

### 10. Real-time Notifications
- WebSocket-based notifications
- Role-specific alerts
- Read/unread tracking
- Real-time updates

### 11. Department Management
- Department CRUD operations
- Equipment tracking
- Contact information
- Status management

### 12. Enquiries
- Patient enquiries
- Priority levels
- Status tracking
- Resolution management

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication (30-day expiry)
- Protected API routes
- Role-based authorization
- Input validation
- CORS configuration
- Account lockout after 5 failed login attempts
- Auto-lock for 2 hours on brute force
- Secure environment variables

## 🐛 Troubleshooting

### Docker Issues

#### Containers not starting
```bash
# Stop all containers
docker-compose down

# Remove old containers
docker rm -f hospital-mongodb hospital-backend hospital-frontend

# Rebuild and start
docker-compose up -d --build
```

#### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 27017
lsof -ti:27017 | xargs kill -9
```

#### Database not seeded
```bash
# Run seeder
docker exec hospital-backend node seeder.js
```

#### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs hospital-backend -f
docker logs hospital-frontend -f
docker logs hospital-mongodb -f
```

### MongoDB Connection Issues (Manual Setup)
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000 (manual) or 5001 (Docker)
- Check API URL in frontend service configuration
- Verify CORS is enabled in backend
- Check Docker network connectivity

### Login Issues
```bash
# Reset database and re-seed
docker-compose down
docker-compose up -d --build
docker exec hospital-backend node seeder.js
```

## 📝 Testing the Application

### With Docker
```bash
# 1. Start all services
docker-compose up -d

# 2. Seed the database
docker exec hospital-backend node seeder.js

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5001

# 4. Login with admin credentials
# Email: admin@hospital.com
# Password: admin123
```

### Manual Setup
```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Run backend
cd backend
npm run seed
npm run dev

# 3. Run frontend (new terminal)
cd hospital-management
npm run dev

# 4. Test all modules:
#    - Dashboard statistics
#    - Add/Edit/Delete patients
#    - Add/Edit/Delete doctors
#    - Schedule appointments
#    - View medical records
#    - Browse departments
#    - Pharmacy module
#    - Laboratory module
#    - Inventory management
#    - Billing system
```

## 🚀 Production Deployment

### Docker Production

```bash
# Build for production
docker-compose -f docker-compose.yml up -d --build

# Update environment variables
# Edit .env and docker-compose.yml with production values
```

### Manual Production

#### Backend
```bash
cd backend
NODE_ENV=production npm start
```

#### Frontend
```bash
cd hospital-management
npm run build
# Deploy 'dist' folder to hosting service (Netlify, Vercel, etc.)
```

### Environment Variables for Production
- Update `MONGODB_URI` for production database
- Change `JWT_SECRET` to a secure random string (minimum 32 characters)
- Set `NODE_ENV=production`
- Update CORS origins
- Use environment-specific ports

### Docker Compose Production Example
```yaml
services:
  backend:
    environment:
      - JWT_SECRET=your_super_secure_random_string_here
      - NODE_ENV=production
      - MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hospital
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

To contribute or customize:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Inspect browser console for errors
- Verify MongoDB/Docker connection
- Check backend logs

## 🎉 Features Implemented

- [x] Multi-role authentication (Admin, Doctor, Nurse, Receptionist, Patient, Pharmacist, Lab Technician)
- [x] Dashboard with real-time statistics
- [x] Patient management with assignments
- [x] Doctor management and scheduling
- [x] Appointment booking system
- [x] Medical records and history
- [x] Department management
- [x] Pharmacy module with billing
- [x] Laboratory module with reports
- [x] Inventory management
- [x] Billing and invoicing
- [x] Real-time notifications
- [x] Enquiry management
- [x] Vital signs tracking
- [x] Docker support
- [x] Account security (lockout mechanism)
- [x] Search and filtering
- [x] Responsive design

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] SMS reminders
- [ ] Advanced analytics and reports
- [ ] Export to PDF/Excel
- [ ] Telemedicine features
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Insurance management
- [ ] Bed management system
- [ ] OT scheduling
- [ ] Ambulance management
- [ ] HR and payroll module

---

**Built with ❤️ using the MERN Stack + Docker**
