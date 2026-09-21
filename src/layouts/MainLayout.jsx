import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const titleMap = {
  "/dashboard": { title: "Dashboard Overview", subtitle: "Real-time hospital statistics & active overview" },
  "/patients": { title: "Patient Directory", subtitle: "Manage patient records, admissions, and history" },
  "/doctors": { title: "Doctors Roster", subtitle: "Specialist profiles, departments, and consultation fees" },
  "/departments": { title: "Hospital Departments", subtitle: "Clinical divisions & staff allocation" },
  "/appointments": { title: "Appointments Schedule", subtitle: "Book, track, and update patient appointments" },
  "/prescriptions": { title: "Prescriptions Register", subtitle: "Issue digital prescriptions & dosages" },
  "/billing": { title: "Billing & Invoices", subtitle: "Patient invoicing, payments, and printable statements" },
  "/staff": { title: "Staff Directory", subtitle: "Nurses, technicians, and administrative team" },
  "/reports": { title: "Analytics & Reports", subtitle: "Revenue trends, patient growth, and department stats" },
  "/settings": { title: "System Settings", subtitle: "Hospital info, security, and preferences" },
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentInfo = titleMap[location.pathname] || { title: "Hospital SaaS", subtitle: "Apex Care System" };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-wrapper">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={currentInfo.title}
          subtitle={currentInfo.subtitle}
        />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
