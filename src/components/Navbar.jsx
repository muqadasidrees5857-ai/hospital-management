import { useLocation } from "react-router-dom";

function Navbar({ toggleMobile }) {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
        return { title: "Dashboard Overview", desc: "Welcome back, Administrator!" };
      case "/patients":
        return { title: "Patient Records", desc: "View, manage, and register hospital patients" };
      case "/add-patient":
        return { title: "Add Patient", desc: "Register a new patient into the hospital registry" };
      case "/doctors":
        return { title: "Medical Staff & Doctors", desc: "Manage doctors, specialties, and schedules" };
      case "/appointments":
        return { title: "Appointments Schedule", desc: "Manage patient appointments and bookings" };
      case "/departments":
        return { title: "Hospital Departments", desc: "Medical units, heads, and staff distribution" };
      case "/beds":
        return { title: "Bed Management", desc: "Monitor ward availability and room occupancy" };
      default:
        return { title: "Hospital Management", desc: "MediCare Control Panel" };
    }
  };

  const info = getPageInfo();

  return (
    <header className="top-navbar">
      <div className="nav-left-toggle">
        <button className="menu-toggle-btn" onClick={toggleMobile} title="Toggle Navigation">
          ☰
        </button>
        <div className="nav-page-title">
          <h2>{info.title}</h2>
          <p>{info.desc}</p>
        </div>
      </div>

      <div className="nav-right-actions">
        <div className="search-input-pill">
          <span>🔍</span>
          <input type="text" placeholder="Search system..." />
        </div>

        <button className="icon-btn-round" title="Notifications">
          🔔
          <span className="badge-dot"></span>
        </button>

        <div className="user-avatar" style={{ cursor: 'pointer', background: 'var(--primary)', color: '#fff' }}>
          A
        </div>
      </div>
    </header>
  );
}

export default Navbar;