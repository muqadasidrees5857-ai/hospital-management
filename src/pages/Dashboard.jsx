import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [patRes, docRes, appRes, bedRes] = await Promise.all([
          fetch("http://localhost:5000/api/patients"),
          fetch("http://localhost:5000/api/doctors"),
          fetch("http://localhost:5000/api/appointments"),
          fetch("http://localhost:5000/api/beds"),
        ]);

        const patData = await patRes.json();
        const docData = await docRes.json();
        const appData = await appRes.json();
        const bedData = await bedRes.json();

        setPatients(patData);
        setDoctors(docData);
        setAppointments(appData);
        setBeds(bedData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const availableBeds = beds.filter((b) => b.status === "Available").length;

  return (
    <div>
      {/* WELCOME BANNER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Welcome back, Admin 👋</h1>
          <p>Here's real-time information about MediCare operations today.</p>
        </div>
        <Link to="/add-patient" className="btn-primary-custom">
          <span>✚</span> Add New Patient
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">👥</div>
          <div className="stat-details">
            <p>Total Patients</p>
            <h3>{loading ? "..." : patients.length}</h3>
            <span className="sub-text">Registered Patients</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🩺</div>
          <div className="stat-details">
            <p>Total Doctors</p>
            <h3>{loading ? "..." : doctors.length}</h3>
            <span className="sub-text">Active Medical Staff</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">📅</div>
          <div className="stat-details">
            <p>Appointments</p>
            <h3>{loading ? "..." : appointments.length}</h3>
            <span className="sub-text">Scheduled Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">🛏️</div>
          <div className="stat-details">
            <p>Available Beds</p>
            <h3>{loading ? "..." : availableBeds}</h3>
            <span className="sub-text">Out of {beds.length} Ward Beds</span>
          </div>
        </div>
      </div>

      {/* RECENT LISTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
        }}
      >
        {/* RECENT PATIENTS */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Recent Patients</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Latest patient entries
              </p>
            </div>
            <Link
              to="/patients"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--primary)",
              }}
            >
              View All →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {patients.slice(0, 4).map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#f8fafc",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="person-cell">
                  <div className="avatar-circle" style={{ width: "36px", height: "36px", fontSize: "12px" }}>
                    {p.name ? p.name.charAt(0) : "P"}
                  </div>
                  <div className="person-info">
                    <h4 style={{ fontSize: "13px" }}>{p.name}</h4>
                    <p>Condition: {p.disease}</p>
                  </div>
                </div>
                <span className="badge-pill badge-red" style={{ fontSize: "11px" }}>
                  {p.bloodGroup}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Upcoming Appointments</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Scheduled visits</p>
            </div>
            <Link
              to="/appointments"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--primary)",
              }}
            >
              View All →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {appointments.slice(0, 4).map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#f8fafc",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-dark)" }}>
                    {a.patient}
                  </h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    With {a.doctor} ({a.department})
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>
                    {a.time}
                  </div>
                  <span
                    className={`badge-pill ${
                      a.status === "Confirmed" ? "badge-green" : "badge-amber"
                    }`}
                    style={{ fontSize: "10px", padding: "2px 8px" }}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;