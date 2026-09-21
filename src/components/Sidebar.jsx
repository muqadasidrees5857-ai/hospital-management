import { Link, useLocation } from "react-router-dom";

function Sidebar({ mobileOpen, closeMobile }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊", category: "MAIN MENU" },
    { path: "/patients", label: "Patients", icon: "👥", category: "MAIN MENU" },
    { path: "/doctors", label: "Doctors", icon: "🩺", category: "MAIN MENU" },
    { path: "/appointments", label: "Appointments", icon: "📅", category: "MAIN MENU" },
    { path: "/departments", label: "Departments", icon: "🏥", category: "MANAGEMENT" },
    { path: "/beds", label: "Beds Management", icon: "🛏️", category: "MANAGEMENT" },
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          onClick={closeMobile} 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 99
          }} 
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-badge">✚</div>
          <div className="logo-text">
            <h3>MediCare</h3>
            <p>Hospital System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN MENU</div>
          {navItems.filter(i => i.category === "MAIN MENU").map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="nav-section-label" style={{ marginTop: "16px" }}>MANAGEMENT</div>
          {navItems.filter(i => i.category === "MANAGEMENT").map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">A</div>
            <div className="user-details">
              <h5>Dr. Admin</h5>
              <p>Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;