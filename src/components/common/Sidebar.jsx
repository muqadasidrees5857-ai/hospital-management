import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Doctors", path: "/doctors", icon: UserCheck },
    { label: "Departments", path: "/departments", icon: Building2 },
    { label: "Appointments", path: "/appointments", icon: Calendar },
    { label: "Prescriptions", path: "/prescriptions", icon: FileText },
    { label: "Billing & Invoices", path: "/billing", icon: CreditCard },
    { label: "Staff Management", path: "/staff", icon: UserCog },
    { label: "Reports & Analytics", path: "/reports", icon: BarChart3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-badge">
          <Activity size={24} />
        </div>
        <div className="logo-text">
          <h3>ApexCare</h3>
          <p>Hospital SaaS v2.4</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => {
                if (window.innerWidth <= 992) toggleSidebar();
              }}
            >
              <span className="icon">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="user-details">
            <h5>{user?.name || "Admin User"}</h5>
            <p>{user?.role ? user.role.toUpperCase() : "ADMIN"}</p>
          </div>
          <button
            onClick={logout}
            className="action-btn-sm action-btn-delete"
            style={{ marginLeft: "auto" }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
