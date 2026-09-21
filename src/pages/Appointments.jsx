import { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Ali Khan", doctor: "Dr. Ahmed Khan", department: "Cardiology", date: "2026-08-12", time: "10:00 AM", reason: "Routine Checkup", status: "Confirmed" },
    { id: 2, patient: "Sarah Malik", doctor: "Dr. Sarah Malik", department: "Neurology", date: "2026-08-12", time: "11:30 AM", reason: "Migraine Consultation", status: "Pending" },
    { id: 3, patient: "Ahmed Hassan", doctor: "Dr. Usman Ali", department: "Orthopedic", date: "2026-08-13", time: "09:00 AM", reason: "Joint Pain", status: "Confirmed" },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Inline Form State
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "Dr. Ahmed Khan",
    department: "Cardiology",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    reason: "",
    status: "Confirmed",
  });

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
        }
      }
    } catch (err) {
      console.log("Backend offline, using local state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openAddForm = () => {
    setEditingAppointment(null);
    setFormData({
      patient: "",
      doctor: "Dr. Ahmed Khan",
      department: "Cardiology",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
      reason: "",
      status: "Confirmed",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (app) => {
    setEditingAppointment(app);
    setFormData({
      patient: app.patient || "",
      doctor: app.doctor || "Dr. Ahmed Khan",
      department: app.department || "Cardiology",
      date: app.date || new Date().toISOString().split("T")[0],
      time: app.time || "10:00 AM",
      reason: app.reason || "",
      status: app.status || "Pending",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingAppointment) {
      // EDIT MODE
      const updatedItem = { ...formData, id: editingAppointment.id };

      setAppointments((prev) =>
        prev.map((a) => (a.id === editingAppointment.id ? updatedItem : a))
      );

      try {
        await fetch(`http://localhost:5000/api/appointments/${editingAppointment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("Appointment updated successfully!");
    } else {
      // ADD MODE
      const newId = appointments.length > 0 ? Math.max(...appointments.map((a) => Number(a.id) || 0)) + 1 : 1;
      const newItem = { ...formData, id: newId };

      setAppointments((prev) => [...prev, newItem]);

      try {
        await fetch("http://localhost:5000/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("New appointment booked successfully!");
    }

    closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel/delete this appointment?")) return;

    setAppointments((prev) => prev.filter((a) => a.id !== id));

    try {
      await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Backend sync offline, deleted locally");
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      (app.patient && app.patient.toLowerCase().includes(search.toLowerCase())) ||
      (app.doctor && app.doctor.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Appointments Schedule</h1>
          <p>Book and schedule patient consultations with doctors.</p>
        </div>
        <button className="btn-primary-custom" onClick={openAddForm}>
          <span>✚</span> New Appointment
        </button>
      </div>

      {/* INLINE FORM CARD */}
      {showForm && (
        <div
          style={{
            background: "#ffffff",
            border: "2px solid var(--primary)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            marginBottom: "28px",
            boxShadow: "var(--shadow-md)",
            animation: "slideUp 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>
              {editingAppointment ? `✏️ Edit Booking (#A-${editingAppointment.id})` : "✚ Book New Appointment"}
            </h3>
            <button
              onClick={closeForm}
              style={{
                background: "#f1f5f9",
                border: "none",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ✕ Close
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group-full">
                <label className="form-label-custom">Patient Name *</label>
                <input
                  type="text"
                  name="patient"
                  className="form-control-custom"
                  placeholder="Enter patient full name"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Assigned Doctor *</label>
                <input
                  type="text"
                  name="doctor"
                  className="form-control-custom"
                  placeholder="e.g. Dr. Ahmed Khan"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Department *</label>
                <select
                  name="department"
                  className="form-control-custom"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              <div>
                <label className="form-label-custom">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control-custom"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Time Slot *</label>
                <input
                  type="text"
                  name="time"
                  className="form-control-custom"
                  placeholder="e.g. 10:30 AM"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-full">
                <label className="form-label-custom">Reason for Visit</label>
                <input
                  type="text"
                  name="reason"
                  className="form-control-custom"
                  placeholder="e.g. Follow-up consultation, Fever"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label-custom">Status</label>
                <select
                  name="status"
                  className="form-control-custom"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="btn-secondary-custom" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom">
                {editingAppointment ? "Update Booking" : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">📅</div>
          <div className="stat-details">
            <p>Total Bookings</p>
            <h3>{appointments.length}</h3>
            <span className="sub-text">Overall scheduled</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">✓</div>
          <div className="stat-details">
            <p>Confirmed</p>
            <h3>{confirmedCount}</h3>
            <span className="sub-text">Confirmed appointments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">◷</div>
          <div className="stat-details">
            <p>Pending Approval</p>
            <h3>{pendingCount}</h3>
            <span className="sub-text">Awaiting doctor review</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">🚫</div>
          <div className="stat-details">
            <p>Cancelled</p>
            <h3>{cancelledCount}</h3>
            <span className="sub-text">Cancelled or postponed</span>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                    Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                    No appointments found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong style={{ color: "var(--primary)" }}>#A-{app.id}</strong>
                    </td>
                    <td>
                      <strong>{app.patient}</strong>
                    </td>
                    <td>{app.doctor}</td>
                    <td>
                      <span className="badge-pill badge-gray">{app.department}</span>
                    </td>
                    <td>
                      <div>🗓 {app.date}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600" }}>
                        ⏰ {app.time}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {app.reason || "General Checkup"}
                    </td>
                    <td>
                      <span
                        className={`badge-pill ${
                          app.status === "Confirmed"
                            ? "badge-green"
                            : app.status === "Pending"
                            ? "badge-amber"
                            : "badge-red"
                        }`}
                      >
                        ● {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-sm action-btn-edit"
                          onClick={() => openEditForm(app)}
                          title="Edit Appointment"
                          style={{ fontSize: "14px", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn-sm action-btn-delete"
                          onClick={() => handleDelete(app.id)}
                          title="Delete Appointment"
                          style={{ fontSize: "14px", cursor: "pointer" }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Appointments;