# Hospital Management System

A comprehensive web-based hospital management system built with React and Vite.

## Features

### 🏥 Core Modules
- **Dashboard** - Real-time statistics, recent activities, and upcoming appointments
- **Patient Management** - Add, view, edit, and manage patient records
- **Doctor Management** - Manage doctor profiles, specializations, and schedules
- **Appointment Scheduling** - Book and track patient appointments
- **Medical Records** - Maintain comprehensive patient medical history
- **Departments** - View and manage hospital departments

### ✨ Key Features
- Modern, responsive UI design
- Intuitive navigation with collapsible sidebar
- Real-time search and filtering
- Modal forms for data entry
- Status tracking for appointments and records
- Beautiful card-based layouts
- Smooth animations and transitions

## Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Styling:** CSS3 with modern features

## Installation

The project is already set up. Just follow the steps below to run it.

## Running the Application

The development server is already running on `http://localhost:3000`

If you need to restart:

```bash
cd hospital-management
npm run dev
```

## Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

## Project Structure

```
hospital-management/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Patients.jsx        # Patient management
│   │   ├── Doctors.jsx         # Doctor management
│   │   ├── Appointments.jsx    # Appointment scheduling
│   │   ├── MedicalRecords.jsx  # Medical records
│   │   └── Departments.jsx     # Departments overview
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Usage Guide

### Dashboard
- View key hospital metrics at a glance
- Track recent activities across all modules
- See today's upcoming appointments

### Patient Management
- Click "Add New Patient" to register a new patient
- Use the search bar to find patients by name or email
- View, edit, or delete patient records using action buttons

### Doctor Management
- Add new doctors with their specialization and qualifications
- View doctor profiles with contact information
- Filter doctors by status (Active/On Leave)

### Appointments
- Book new appointments with date and time selection
- Filter appointments by status (All/Confirmed/Pending/Cancelled)
- Confirm or cancel appointments with one click

### Medical Records
- Access complete patient medical history
- Search records by patient name or ID
- View diagnosis, treatment, and doctor information

### Departments
- View all hospital departments
- See department statistics (doctors, patients)
- Get floor and equipment information

## Customization

### Adding New Data
Each page component contains sample data arrays. You can modify these or connect to a backend API:

```javascript
// Example: Adding a new patient in Patients.jsx
const patientsData = [
  // ... existing data
  { 
    id: 7, 
    name: 'New Patient Name', 
    age: 35, 
    // ... other fields
  }
];
```

### Styling
- Colors are defined as CSS variables in each component's CSS file
- Modify the color scheme in the respective `.css` files
- The app uses a consistent color palette:
  - Primary: `#3498db` (Blue)
  - Success: `#2ecc71` (Green)
  - Warning: `#f39c12` (Orange)
  - Danger: `#e74c3c` (Red)

## Future Enhancements

Potential features to add:
- Backend integration with database
- User authentication and authorization
- Prescription management
- Billing and invoicing
- Laboratory test integration
- Inventory management
- Reports and analytics
- Email/SMS notifications
- Mobile app version

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the documentation or contact support.
