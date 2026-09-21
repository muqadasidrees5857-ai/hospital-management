import { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Ahmed Khan", specialty: "Cardiologist", phone: "0300-1234567", email: "ahmed@medicare.com", experience: "12 Years", department: "Cardiology", status: "Available" },
    { id: 2, name: "Dr. Sarah Malik", specialty: "Neurologist", phone: "0312-7654321", email: "sarah@medicare.com", experience: "9 Years", department: "Neurology", status: "Available" },
    { id: 3, name: "Dr. Usman Ali", specialty: "Orthopedic", phone: "0321-4567890", email: "usman@medicare.com", experience: "15 Years", department: "Orthopedic", status: "Busy" },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // Inline Form State
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    experience: "5 Years",
    department: "Cardiology",
    status: "Available",
  });

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      }
    } catch (err) {
      console.log("Backend offline, using local state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openAddForm = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      specialty: "",
      phone: "",
      email: "",
      experience: "5 Years",
      department: "Cardiology",
      status: "Available",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name || "",
      specialty: doc.specialty || "",
      phone: doc.phone || "",
      email: doc.email || "",
      experience: doc.experience || "1 Year",
      department: doc.department || "Cardiology",
      status: doc.status || "Available",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingDoctor) {
      // EDIT MODE
      const updatedItem = { ...formData, id: editingDoctor.id };

      setDoctors((prev) =>
        prev.map((d) => (d.id === editingDoctor.id ? updatedItem : d))
      );

      try {
        await fetch(`http://localhost:5000/api/doctors/${editingDoctor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("Doctor details updated successfully!");
    } else {
      // ADD MODE
      const newId = doctors.length > 0 ? Math.max(...doctors.map((d) => Number(d.id) || 0)) + 1 : 1;
      const newItem = { ...formData, id: newId };

      setDoctors((prev) => [...prev, newItem]);

      try {
        await fetch("http://localhost:5000/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("New doctor added successfully!");
    }

    closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor record?")) return;

    setDoctors((prev) => prev.filter((d) => d.id !== id));

    try {
      await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Backend sync offline, deleted locally");
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      (doc.name && doc.name.toLowerCase().includes(search.toLowerCase())) ||
      (doc.specialty && doc.specialty.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = deptFilter === "All" || doc.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const availableCount = doctors.filter((d) => d.status === "Available").length;
  const busyCount = doctors.filter((d) => d.status === "Busy").length;

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Medical Staff & Doctors</h1>
          <p>Manage hospital doctors, specialties, and schedule availability.</p>
        </div>
        <button className="btn-primary-custom" onClick={openAddForm}>
          <span>✚</span> Add New Doctor
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
              {editingDoctor ? `✏️ Edit Doctor Details (${editingDoctor.name})` : "✚ Add New Doctor"}
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
                <label className="form-label-custom">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control-custom"
                  placeholder="e.g. Dr. Ahmed Khan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Specialty *</label>
                <input
                  type="text"
                  name="specialty"
                  className="form-control-custom"
                  placeholder="e.g. Cardiologist"
                  value={formData.specialty}
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
                <label className="form-label-custom">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control-custom"
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control-custom"
                  placeholder="doctor@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label-custom">Experience</label>
                <input
                  type="text"
                  name="experience"
                  className="form-control-custom"
                  placeholder="e.g. 8 Years"
                  value={formData.experience}
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
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="btn-secondary-custom" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom">
                {editingDoctor ? "Update Doctor" : "Save Doctor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-teal">🩺</div>
          <div className="stat-details">
            <p>Total Doctors</p>
            <h3>{doctors.length}</h3>
            <span className="sub-text">Registered Medical Staff</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">✓</div>
          <div className="stat-details">
            <p>Available Now</p>
            <h3>{availableCount}</h3>
            <span className="sub-text">Ready for consultation</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">⏳</div>
          <div className="stat-details">
            <p>On Duty / Busy</p>
            <h3>{busyCount}</h3>
            <span className="sub-text">In surgery or appointments</span>
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
              placeholder="Search by doctor name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    Loading doctors...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    No doctors found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="person-cell">
                        <div className="avatar-circle">
                          {doc.name.replace("Dr. ", "").charAt(0)}
                        </div>
                        <div className="person-info">
                          <h4>{doc.name}</h4>
                          <p>#D-{doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialty}</td>
                    <td>
                      <span className="badge-pill badge-gray">{doc.department}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: "13px" }}>
                        <div>📱 {doc.phone}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{doc.email}</div>
                      </div>
                    </td>
                    <td>{doc.experience}</td>
                    <td>
                      <span
                        className={`badge-pill ${
                          doc.status === "Available"
                            ? "badge-green"
                            : doc.status === "Busy"
                            ? "badge-amber"
                            : "badge-red"
                        }`}
                      >
                        ● {doc.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-sm action-btn-edit"
                          onClick={() => openEditForm(doc)}
                          title="Edit Doctor"
                          style={{ fontSize: "14px", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn-sm action-btn-delete"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete Doctor"
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

export default Doctors;