import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PatientList from "./pages/Patients/PatientList";
import DoctorList from "./pages/Doctors/DoctorList";
import DepartmentList from "./pages/Departments/DepartmentList";
import AppointmentList from "./pages/Appointments/AppointmentList";
import PrescriptionList from "./pages/Prescriptions/PrescriptionList";
import InvoiceList from "./pages/Billing/InvoiceList";
import StaffList from "./pages/Staff/StaffList";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Protected Route Guard Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#0d9488",
          fontWeight: "600",
        }}
      >
        Authenticating ApexCare System...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* AUTH ROUTES */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* PROTECTED APP ROUTES */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/prescriptions" element={<PrescriptionList />} />
              <Route path="/billing" element={<InvoiceList />} />
              <Route path="/staff" element={<StaffList />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>

            {/* 404 FALLBACK */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;