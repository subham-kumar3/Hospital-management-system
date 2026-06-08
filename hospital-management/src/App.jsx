import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import DoctorLayout from './components/DoctorLayout'
import PatientLayout from './components/PatientLayout'
import AdminLayout from './components/AdminLayout'
import ReceptionistLayout from './components/ReceptionistLayout'
import PharmacistLayout from './components/PharmacistLayout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Appointments from './pages/Appointments'
import MedicalRecords from './pages/MedicalRecords'
import Departments from './pages/Departments'
import Login from './pages/Login'
import PatientLogin from './pages/PatientLogin'
import PatientDashboard from './pages/PatientDashboard'
import PatientAppointments from './pages/PatientAppointments'
import PatientDoctors from './pages/PatientDoctors'
import PatientMedicalRecords from './pages/PatientMedicalRecords'
import PatientPrescriptions from './pages/PatientPrescriptions'
import PatientLabReports from './pages/PatientLabReports'
import PatientBilling from './pages/PatientBilling'
import PatientNotifications from './pages/PatientNotifications'
import PatientProfile from './pages/PatientProfile'
import PatientSupport from './pages/PatientSupport'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminPatients from './pages/AdminPatients'
import AdminAppointments from './pages/AdminAppointments'
import AdminPharmacy from './pages/AdminPharmacy'
import AdminLab from './pages/AdminLab'
import AdminFinancial from './pages/AdminFinancial'
import AdminReports from './pages/AdminReports'
import AdminNotifications from './pages/AdminNotifications'
import AdminSettings from './pages/AdminSettings'
import AdminProfile from './pages/AdminProfile'
import AdminUserManagement from './pages/AdminUserManagement'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorAppointments from './pages/DoctorAppointments'
import DoctorPatients from './pages/DoctorPatients'
import DoctorPrescriptions from './pages/DoctorPrescriptions'
import DoctorMedicalRecords from './pages/DoctorMedicalRecords'
import DoctorLabReports from './pages/DoctorLabReports'
import DoctorNotifications from './pages/DoctorNotifications'
import DoctorProfile from './pages/DoctorProfile'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import PatientRegistration from './pages/PatientRegistration'
import ReceptionistPatientList from './pages/ReceptionistPatientList'
import ReceptionistAppointments from './pages/ReceptionistAppointments'
import DoctorSchedule from './pages/DoctorSchedule'
import Billing from './pages/Billing'
import Invoice from './pages/Invoice'
import Enquiries from './pages/Enquiries'
import Notifications from './pages/Notifications'
import ReceptionistProfile from './pages/ReceptionistProfile'
import PharmacistLogin from './pages/PharmacistLogin'
import PharmacistDashboard from './pages/PharmacistDashboard'
import PrescriptionManagement from './pages/PrescriptionManagement'
import MedicineInventory from './pages/MedicineInventory'
import PharmacyBilling from './pages/PharmacyBilling'
import PurchaseManagement from './pages/PurchaseManagement'
import PharmacistProfile from './pages/PharmacistProfile'
import LabLayout from './components/LabLayout'
import LabDashboard from './pages/LabDashboard'
import LabTests from './pages/LabTests'
import LabSamples from './pages/LabSamples'
import LabResults from './pages/LabResults'
import LabReports from './pages/LabReports'
import LabNotifications from './pages/LabNotifications'
import LabProfile from './pages/LabProfile'
import NurseLayout from './components/NurseLayout'
import NurseDashboard from './pages/NurseDashboard'
import NursePatients from './pages/NursePatients'
import NurseVitals from './pages/NurseVitals'
import NurseMedications from './pages/NurseMedications'
import NurseNotes from './pages/NurseNotes'
import NurseTasks from './pages/NurseTasks'
import NurseLabReports from './pages/NurseLabReports'
import NurseWardManagement from './pages/NurseWardManagement'
import NurseNotifications from './pages/NurseNotifications'
import NurseProfile from './pages/NurseProfile'
import NotFound from './pages/NotFound'

// Protected Route Component with role-based access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        blockSize: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Admin/Staff Login Page */}
      <Route path="/login" element={<Login />} />
      
      {/* Patient Portal Routes */}
      <Route path="/patient-login" element={<PatientLogin />} />
      
      {/* Patient Portal with PatientLayout */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="patient/dashboard" element={<PatientDashboard />} />
        <Route path="patient/appointments" element={<PatientAppointments />} />
        <Route path="patient/doctors" element={<PatientDoctors />} />
        <Route path="patient/medical-records" element={<PatientMedicalRecords />} />
        <Route path="patient/prescriptions" element={<PatientPrescriptions />} />
        <Route path="patient/lab-reports" element={<PatientLabReports />} />
        <Route path="patient/billing" element={<PatientBilling />} />
        <Route path="patient/notifications" element={<PatientNotifications />} />
        <Route path="patient/profile" element={<PatientProfile />} />
        <Route path="patient/support" element={<PatientSupport />} />
      </Route>
      
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Legacy route redirects */}
      <Route path="/appointments" element={<Navigate to="/login" replace />} />
      <Route path="/patients" element={<Navigate to="/admin/patients" replace />} />
      <Route path="/doctors" element={<Navigate to="/login" replace />} />
      <Route path="/departments" element={<Navigate to="/login" replace />} />
      <Route path="/medical-records" element={<Navigate to="/login" replace />} />
      
      {/* Doctor Routes with DoctorLayout */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="doctor-appointments" element={<DoctorAppointments />} />
        <Route path="doctor-patients" element={<DoctorPatients />} />
        <Route path="doctor-prescriptions" element={<DoctorPrescriptions />} />
        <Route path="doctor-medical-records" element={<DoctorMedicalRecords />} />
        <Route path="doctor-lab-reports" element={<DoctorLabReports />} />
        <Route path="doctor-notifications" element={<DoctorNotifications />} />
        <Route path="doctor-profile" element={<DoctorProfile />} />
      </Route>
      
      {/* Receptionist Routes with ReceptionistLayout */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Receptionist']}>
            <ReceptionistLayout />
          </ProtectedRoute>
        }
      >
        <Route path="receptionist-dashboard" element={<ReceptionistDashboard />} />
        <Route path="patient-registration" element={<PatientRegistration />} />
        <Route path="patient-list" element={<ReceptionistPatientList />} />
        <Route path="receptionist-appointments" element={<ReceptionistAppointments />} />
        <Route path="doctor-schedule" element={<DoctorSchedule />} />
        <Route path="billing" element={<Billing />} />
        <Route path="invoice/:id" element={<Invoice />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="receptionist-profile" element={<ReceptionistProfile />} />
      </Route>
      
      {/* Admin Routes - Redirect to Admin Portal */}
      {/* All admin users should use AdminLayout with /admin/* routes */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin-user-management" element={<AdminUserManagement />} />
        <Route path="admin/patients" element={<AdminPatients />} />
        <Route path="admin/appointments" element={<AdminAppointments />} />
        <Route path="admin/pharmacy" element={<AdminPharmacy />} />
        <Route path="admin/lab" element={<AdminLab />} />
        <Route path="admin/financial" element={<AdminFinancial />} />
        <Route path="admin/reports" element={<AdminReports />} />
        <Route path="admin/notifications" element={<AdminNotifications />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Pharmacist Routes */}
      <Route path="/pharmacy-login" element={<PharmacistLogin />} />
      
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Pharmacist']}>
            <PharmacistLayout />
          </ProtectedRoute>
        }
      >
        <Route path="pharmacy-dashboard" element={<PharmacistDashboard />} />
        <Route path="pharmacy/prescriptions" element={<PrescriptionManagement />} />
        <Route path="pharmacy/inventory" element={<MedicineInventory />} />
        <Route path="pharmacy/billing" element={<PharmacyBilling />} />
        <Route path="pharmacy/purchases" element={<PurchaseManagement />} />
        <Route path="pharmacy/profile" element={<PharmacistProfile />} />
      </Route>

      {/* Lab Technician Routes */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Lab Technician']}>
            <LabLayout />
          </ProtectedRoute>
        }
      >
        <Route path="lab-dashboard" element={<LabDashboard />} />
        <Route path="lab-tests" element={<LabTests />} />
        <Route path="lab-samples" element={<LabSamples />} />
        <Route path="lab-results" element={<LabResults />} />
        <Route path="lab-reports" element={<LabReports />} />
        <Route path="lab-notifications" element={<LabNotifications />} />
        <Route path="lab-profile" element={<LabProfile />} />
      </Route>

      {/* Nurse Routes */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['Nurse']}>
            <NurseLayout />
          </ProtectedRoute>
        }
      >
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
      </Route>

      {/* 404 - catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
