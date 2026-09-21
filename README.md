# 🏥 ApexCare - Commercial Full-Stack Hospital Management SaaS System

A modern, full-stack Hospital Management System built with **React**, **Vite**, **Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT Authentication**, and **Recharts**. Designed with a modern clinical SaaS aesthetic, real-time KPI metrics, responsive sidebar navigation, printable invoice generator, and seed data.

---

## 🚀 Key Modules & Features

1. **🔒 Authentication & Security**
   - JWT Token authorization header interceptor
   - Password hashing with `bcryptjs`
   - Role-based Access Control (`admin`, `staff`, `doctor`)
   - Protected routes with fallback state

2. **📊 Executive Dashboard**
   - Real-time KPI stat cards (Total Patients, Active Doctors, Today's Appointments, Gross Revenue)
   - Interactive Recharts Revenue Line Chart & Department Distribution Bar Chart
   - Live Recent Patients table & Upcoming Schedule feed

3. **👥 Patients Management**
   - Full CRUD (Create, View, Edit, Delete)
   - Search & filter by status, blood group, or gender
   - Clinical profile modal with emergency contact details & medical history

4. **👨‍⚕️ Doctors Roster**
   - Specialization, department linkage, experience, consultation fees
   - Availability schedule management & doctor grid cards

5. **🏢 Department Management**
   - Clinical divisions, head of department assignment, doctor capacity counter

6. **📅 Appointments Scheduling**
   - Slot booking with patient & doctor dropdowns
   - Real-time appointment status updater (`Scheduled`, `Completed`, `Cancelled`)
   - Filter by date, doctor, or status

7. **💊 Digital Prescriptions**
   - Issue prescriptions with dynamic medicine rows (Name, Dosage, Frequency, Duration)
   - Print-ready official prescription document view

8. **💳 Billing & Itemized Invoicing**
   - Patient invoice generation with subtotal, tax %, discount, and total calculation
   - Printable official hospital invoice formatted for printing

9. **👔 Staff Management**
   - Nurses, receptionists, pharmacists, lab technicians
   - Role & shift tracking

10. **📈 Reports & Analytics**
    - Gross revenue performance, patient demographics pie chart, and completion rates

11. **⚙️ System Settings**
    - Hospital branding info update & Admin password change

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, Vite, React Router v7, Lucide Icons, Recharts, Custom CSS
- **Backend**: Node.js, Express.js REST APIs, Mongoose, JWT, bcryptjs
- **Database**: MongoDB (Supports standard `MONGODB_URI` + auto zero-setup `mongodb-memory-server` fallback)

---

## ⚡ Quick Start Guide (Step-by-Step)

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation

Install all backend and frontend dependencies:

```bash
# Install root frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

### 2. Database Seeding & Setup

Run the seed script to automatically populate default Admin credentials, Doctors, Departments, Patients, Appointments, Prescriptions, Invoices, and Staff:

```bash
npm run seed
```

---

### 3. Run Application

Start both the backend server (Port 5000) and Vite frontend dev server (Port 3000) concurrently:

```bash
npm run dev:all
```

Or run them individually in separate terminals:

**Terminal 1 (Backend API Server):**
```bash
npm run server
```

**Terminal 2 (Frontend React App):**
```bash
npm run dev
```

Open your browser at: **`http://localhost:3000`**

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@hospital.com` | `admin123` |
| **Staff Member** | `staff@hospital.com` | `staff123` |

*(Quick-fill demo login buttons are also available directly on the Login screen!)*

---

## 🔌 API Endpoints Summary

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | User login & JWT issuance |
| **Auth** | `GET` | `/api/auth/me` | Fetch logged-in user profile |
| **Patients** | `GET / POST` | `/api/patients` | Fetch / Register patient |
| **Patients** | `PUT / DELETE` | `/api/patients/:id` | Update / Remove patient |
| **Doctors** | `GET / POST` | `/api/doctors` | Fetch / Add doctor |
| **Departments** | `GET / POST` | `/api/departments` | Department management |
| **Appointments** | `GET / POST` | `/api/appointments` | Appointment schedule |
| **Prescriptions** | `GET / POST` | `/api/prescriptions` | Issue / view Rx |
| **Billing** | `GET / POST` | `/api/billing` | Invoicing & receipts |
| **Staff** | `GET / POST` | `/api/staff` | Staff directory |
| **Reports** | `GET` | `/api/reports/dashboard` | Aggregated analytics |
| **Settings** | `GET / PUT` | `/api/settings` | Hospital info & config |

---

## 📝 License
This project is open-source and built for commercial hospital management applications.
