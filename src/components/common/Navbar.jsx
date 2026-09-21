import React from "react";
import { Menu, Search, Bell, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar, title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div className="nav-left-toggle">
        <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
          <Menu size={20} />
        </button>
        <div className="nav-page-title">
          <h2>{title || "Dashboard Overview"}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="nav-right-actions">
        <div className="search-input-pill">
          <Search size={16} style={{ color: "#94a3b8" }} />
          <input type="text" placeholder="Search patients, doctors..." />
        </div>

        <button className="icon-btn-round" title="Notifications">
          <Bell size={18} style={{ color: "#475569" }} />
          <span className="badge-dot" />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f1f5f9",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#0f172a",
          }}
        >
          <Shield size={14} style={{ color: "#0d9488" }} />
          <span>{user?.role ? user.role.toUpperCase() : "ADMIN"}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
