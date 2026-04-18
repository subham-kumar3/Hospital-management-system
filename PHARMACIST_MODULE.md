# Pharmacist Module - Hospital Management System

## Overview
The Pharmacist Module is a comprehensive pharmacy management system integrated into the Hospital Management System. It provides role-based access control and enables pharmacists to manage prescriptions, medicine inventory, billing, and supplier purchases efficiently.

## Features Implemented

### 1. Authentication & Authorization
- **Single Login System**: Dedicated pharmacist login page at `/pharmacy-login`
- **Role-Based Access**: Only users with "Pharmacist" role can access the module
- **Protected Routes**: All pharmacy routes are protected with authentication and authorization

### 2. Dashboard
- **Today's Prescriptions**: View all prescriptions created today
- **Low-Stock Medicines**: Alert display for medicines below threshold
- **Quick Statistics**: 
  - Total medicines in inventory
  - Pending prescriptions count
  - Today's revenue
  - Low stock alerts count
- **Quick Actions**: Fast navigation to frequently used features

### 3. Prescription Management
- **View Prescriptions**: See all doctor prescriptions
- **Search Functionality**: Search by patient name or contact
- **Filter by Status**: Active, Dispensed, Completed, Cancelled
- **Mark as Dispensed**: Update prescription status with pharmacy notes
- **Detailed View**: View complete prescription details including:
  - Patient information
  - Doctor details
  - Diagnosis
  - Medicines list with dosage, frequency, duration
  - Doctor's notes

### 4. Medicine Inventory Management
- **Complete Medicine List**: View all medicines with details
- **Add New Medicines**: Comprehensive form with all required fields
- **Update Stock**: Add, remove, or set absolute stock quantities
- **Search & Filter**: Search by name, filter by category
- **Stock Alerts**: Visual indicators for low stock and expired medicines
- **Categories Supported**:
  - Tablet, Capsule, Syrup, Injection
  - Ointment, Drops, Powder, Inhaler
- **Track Expiry Dates**: Automatic expiry detection
- **Low Stock Threshold**: Customizable alerts per medicine

### 5. Billing & Sales
- **Generate Bills**: Create bills for dispensed medicines
- **Payment Tracking**: Monitor payment status (Paid, Pending, Partial)
- **Record Payments**: Update payment status with method
- **Print Invoices**: Generate and print professional invoices
- **Bill Details**:
  - Itemized list with quantities and prices
  - Subtotal, tax, discount calculations
  - Payment history
  - Balance tracking

### 6. Purchase / Supplier Management
- **Create Purchase Orders**: Add new medicine purchases
- **Supplier Details**: Record supplier information
- **Track Deliveries**: Update delivery status (Pending, Ordered, Shipped, Delivered)
- **Automatic Stock Update**: Stock automatically updated on delivery
- **Payment Tracking**: Monitor purchase payments
- **Multi-Item Orders**: Add multiple medicines per purchase

### 7. Notifications
- **Low Stock Alerts**: Visual badges on dashboard
- **Urgent Prescription Alerts**: Pending prescriptions indicator
- **Notification Button**: Header notification badge (ready for expansion)

### 8. Profile Settings
- **Update Personal Details**: Modify name and email
- **Change Password**: Secure password update functionality

### 9. UI/UX Features
- **Clean Interface**: Modern, professional design
- **Sidebar Navigation**: Easy access to all features
- **Responsive Layout**: Works on different screen sizes
- **Modal Dialogs**: Interactive forms and details views
- **Color-Coded Status**: Visual badges for quick identification
- **Loading States**: User-friendly loading indicators

## Technical Implementation

### Backend Structure

#### Models Created:
1. **Medicine** (`backend/models/Medicine.js`)
   - Medicine details, stock, pricing, expiry tracking
   - Virtual fields for low stock and expiry detection

2. **Purchase** (`backend/models/Purchase.js`)
   - Purchase orders, supplier info, delivery tracking
   - Auto-generated purchase numbers

#### Models Updated:
1. **User** (`backend/models/User.js`)
   - Added 'Pharmacist' to role enum

2. **Prescription** (`backend/models/Prescription.js`)
   - Added 'Dispensed' status
   - Added dispensedAt, dispensedBy, pharmacyNotes fields

#### Controllers Created:
1. **medicineController.js** - Medicine CRUD operations, stock management, alerts
2. **pharmacyPrescriptionController.js** - Prescription dispensing and tracking
3. **pharmacyBillController.js** - Billing operations and payment tracking
4. **purchaseController.js** - Purchase order and supplier management

#### Routes:
- **pharmacyRoutes.js** - All pharmacy endpoints under `/api/pharmacy/*`
- Role-based authorization using existing middleware

### Frontend Structure

#### Components Created:
1. **PharmacistLayout.jsx** - Main layout with pharmacy navigation

#### Pages Created:
1. **PharmacistLogin.jsx** - Dedicated login page
2. **PharmacistDashboard.jsx** - Main dashboard with statistics
3. **PrescriptionManagement.jsx** - Prescription dispensing interface
4. **MedicineInventory.jsx** - Stock management interface
5. **PharmacyBilling.jsx** - Billing and payment management
6. **PurchaseManagement.jsx** - Supplier and purchase orders
7. **PharmacistProfile.jsx** - Profile settings

#### Services:
1. **pharmacyApi.js** - API service for all pharmacy operations

### API Endpoints

#### Medicine Endpoints:
```
GET    /api/pharmacy/medicines              - Get all medicines
GET    /api/pharmacy/medicines/:id          - Get single medicine
POST   /api/pharmacy/medicines              - Add new medicine
PUT    /api/pharmacy/medicines/:id          - Update medicine
PATCH  /api/pharmacy/medicines/:id/stock    - Update stock
DELETE /api/pharmacy/medicines/:id          - Delete medicine
GET    /api/pharmacy/medicines/alerts/low-stock - Low stock alerts
GET    /api/pharmacy/medicines/alerts/expired   - Expired medicines
GET    /api/pharmacy/medicines/stats        - Medicine statistics
```

#### Prescription Endpoints:
```
GET    /api/pharmacy/prescriptions          - Get all prescriptions
GET    /api/pharmacy/prescriptions/:id      - Get single prescription
PUT    /api/pharmacy/prescriptions/:id/dispense - Mark as dispensed
GET    /api/pharmacy/prescriptions/today    - Today's prescriptions
GET    /api/pharmacy/prescriptions/pending  - Pending prescriptions
GET    /api/pharmacy/prescriptions/stats    - Prescription statistics
```

#### Billing Endpoints:
```
GET    /api/pharmacy/bills                  - Get all bills
GET    /api/pharmacy/bills/:id              - Get single bill
POST   /api/pharmacy/bills                  - Create bill
PUT    /api/pharmacy/bills/:id/payment      - Update payment
POST   /api/pharmacy/bills/from-prescription - Create from prescription
GET    /api/pharmacy/bills/stats            - Bill statistics
```

#### Purchase Endpoints:
```
GET    /api/pharmacy/purchases              - Get all purchases
GET    /api/pharmacy/purchases/:id          - Get single purchase
POST   /api/pharmacy/purchases              - Create purchase
PUT    /api/pharmacy/purchases/:id/delivery - Update delivery
PUT    /api/pharmacy/purchases/:id/payment  - Update payment
DELETE /api/pharmacy/purchases/:id          - Delete purchase
GET    /api/pharmacy/purchases/stats        - Purchase statistics
```

## Setup & Installation

### 1. Seed Test Data
Run the seeder script to create test pharmacist accounts and sample medicines:

```bash
cd backend
node seed-pharmacy.js
```

This will create:
- 2 pharmacist users
- 8 sample medicines (including low stock items for testing alerts)

### 2. Test Credentials

**Pharmacist Account 1:**
- Email: `pharmacist@hospital.com`
- Password: `pharmacist123`

**Pharmacist Account 2:**
- Email: `priya.pharmacy@hospital.com`
- Password: `pharmacy123`

### 3. Access the Module

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
cd hospital-management
npm run dev
```

3. Navigate to:
- Pharmacy Login: `http://localhost:5173/pharmacy-login`
- Or use main login with pharmacist credentials (auto-redirects)

## Usage Guide

### Dispensing a Prescription:
1. Navigate to "Prescriptions" from sidebar
2. Search for patient or browse prescriptions
3. Click "Dispense" button (green checkmark)
4. Add pharmacy notes (optional)
5. Click "Confirm Dispense"

### Adding Medicine Stock:
1. Go to "Medicine Inventory"
2. Click "Add Medicine" button
3. Fill in medicine details
4. Click "Add Medicine"

### Updating Existing Stock:
1. Go to "Medicine Inventory"
2. Click the package icon next to medicine
3. Select operation (Add/Remove/Set)
4. Enter quantity
5. Click "Update Stock"

### Creating Purchase Order:
1. Navigate to "Purchases"
2. Click "New Purchase Order"
3. Fill supplier details
4. Add items (medicine, quantity, price, batch, expiry)
5. Click "Create Purchase Order"

### Marking Delivery:
1. Go to "Purchases"
2. Use dropdown to update delivery status
3. When marked "Delivered", stock automatically updates

### Generating Bill:
1. Navigate to "Billing"
2. View existing bills or create new one
3. Click "Record Payment" to update payment status
4. Click print icon (🖨️) to print invoice

## Database Collections

The module uses the following MongoDB collections:
- `users` - Pharmacist user accounts
- `medicines` - Medicine inventory
- `purchases` - Purchase orders
- `prescriptions` - Doctor prescriptions (updated)
- `bills` - Pharmacy bills

## Security Features

1. **Role-Based Access Control**: Only pharmacists can access pharmacy routes
2. **JWT Authentication**: Secure token-based authentication
3. **Protected API Endpoints**: All routes require valid authentication
4. **Password Hashing**: Bcrypt password encryption
5. **Input Validation**: Server-side validation on all forms

## Future Enhancements

Potential features for future development:
- Barcode scanning for medicines
- Automated low-stock email notifications
- Medicine usage analytics and reports
- Integration with insurance systems
- Patient medication history
- Drug interaction warnings
- Batch-wise expiry tracking
- Multi-pharmacy support
- Mobile app for pharmacists
- GST/Tax compliance features

## Troubleshooting

### Common Issues:

1. **Cannot Access Pharmacy Module**
   - Ensure user has "Pharmacist" role
   - Run seeder script to create pharmacist accounts

2. **Low Stock Alerts Not Showing**
   - Check medicine stock quantities vs thresholds
   - Verify medicines are in "Active" status

3. **Cannot Dispense Prescription**
   - Prescription must be in "Active" status
   - Check backend server is running

4. **Stock Not Updating on Delivery**
   - Ensure delivery status is marked as "Delivered"
   - Check medicine IDs in purchase items are valid

## Support

For issues or questions:
1. Check this README first
2. Review API endpoints in Postman/Insomnia
3. Check browser console for frontend errors
4. Check backend terminal for server errors
5. Verify MongoDB connection

## Version History

**v1.0.0** - Initial Release
- Complete pharmacist module implementation
- All core features functional
- Role-based access control
- Comprehensive UI/UX
- Database integration

---

**Developed for Hospital Management System**
**Last Updated: April 2026**
