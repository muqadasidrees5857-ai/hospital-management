import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([
    { id: 1, code: "DEP-01", name: "Cardiology", head: "Dr. Ahmed Khan", doctors: 8, patients: 42, location: "Block A, 2nd Floor", status: "Active" },
    { id: 2, code: "DEP-02", name: "Neurology", head: "Dr. Sarah Malik", doctors: 6, patients: 31, location: "Block B, 1st Floor", status: "Active" },
    { id: 3, code: "DEP-03", name: "Orthopedic", head: "Dr. Usman Ali", doctors: 7, patients: 28, location: "Block A, 1st Floor", status: "Active" },
    { id: 4, code: "DEP-04", name: "Dermatology", head: "Dr. Fatima Noor", doctors: 4, patients: 19, location: "Block C, Ground Floor", status: "Active" },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Inline Form State
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    head: "",
    doctors: 5,
    patients: 20,
    location: "Main Building",
    status: "Active",
  });

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDepartments(data);
        }
      }
    } catch (err) {
      console.log("Backend offline, using local state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddForm = () => {
    setEditingDept(null);
    setFormData({
      code: `DEP-${String(departments.length + 1).padStart(2, "0")}`,
      name: "",
      head: "Dr. Ahmed Khan",
      doctors: 5,
      patients: 20,
      location: "Main Building",
      status: "Active",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (dept) => {
    setEditingDept(dept);
    setFormData({
      code: dept.code || "",
      name: dept.name || "",
      head: dept.head || "",
      doctors: dept.doctors || 0,
      patients: dept.patients || 0,
      location: dept.location || "Main Building",
      status: dept.status || "Active",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDept(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingDept) {
      // EDIT MODE
      const updatedItem = { ...formData, id: editingDept.id };

      setDepartments((prev) =>
        prev.map((d) => (d.id === editingDept.id ? updatedItem : d))
      );

      try {
        await fetch(`http://localhost:5000/api/departments/${editingDept.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("Department updated successfully!");
    } else {
      // ADD MODE
      const newId = departments.length > 0 ? Math.max(...departments.map((d) => Number(d.id) || 0)) + 1 : 1;
      const newItem = { ...formData, id: newId };

      setDepartments((prev) => [...prev, newItem]);

      try {
        await fetch("http://localhost:5000/api/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("Department created successfully!");
    }

    closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    setDepartments((prev) => prev.filter((d) => d.id !== id));

    try {
      await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Backend sync offline, deleted locally");
    }
  };

  const filteredDepts = departments.filter((d) =>
    (d.name && d.name.toLowerCase().includes(search.toLowerCase())) ||
    (d.head && d.head.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Hospital Departments</h1>
          <p>Overview of medical departments, heads of department, and capacity.</p>
        </div>
        <button className="btn-primary-custom" onClick={openAddForm}>
          <span>✚</span> Add Department
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
              {editingDept ? `✏️ Edit Department (${editingDept.name})` : "✚ Create New Department"}
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
              <div>
                <label className="form-label-custom">Dept Code *</label>
                <input
                  type="text"
                  name="code"
                  className="form-control-custom"
                  placeholder="e.g. DEP-07"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Department Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control-custom"
                  placeholder="e.g. Cardiology"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group-full">
                <label className="form-label-custom">Head of Department *</label>
                <input
                  type="text"
                  name="head"
                  className="form-control-custom"
                  placeholder="e.g. Dr. Ahmed Khan"
                  value={formData.head}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Location / Floor</label>
                <input
                  type="text"
                  name="location"
                  className="form-control-custom"
                  placeholder="e.g. Block B, 2nd Floor"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label-custom">Doctors Count</label>
                <input
                  type="number"
                  name="doctors"
                  className="form-control-custom"
                  value={formData.doctors}
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="btn-secondary-custom" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom">
                {editingDept ? "Update Department" : "Create Department"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH TOOLBAR */}
      <div className="table-toolbar" style={{ borderRadius: "var(--radius-lg)", marginBottom: "24px" }}>
        <div className="search-box-custom">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search department or head of department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>
            Total Departments: {filteredDepts.length}
          </span>
        </div>
      </div>

      {/* CARDS GRID */}
      {loading ? (
        <p>Loading departments...</p>
      ) : filteredDepts.length === 0 ? (
        <p>No departments found.</p>
      ) : (
        <div className="cards-grid">
          {filteredDepts.map((dept) => (
            <div className="item-card" key={dept.id}>
              <div>
                <div className="item-card-header">
                  <div className="avatar-circle" style={{ background: "var(--primary-light)" }}>
                    🏥
                  </div>
                  <span className={`badge-pill ${dept.status === "Active" ? "badge-green" : "badge-red"}`}>
                    ● {dept.status}
                  </span>
                </div>

                <div className="item-card-title">
                  <h3>{dept.name}</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Code: <strong>{dept.code}</strong>
                  </p>
                </div>

                <div className="item-card-body" style={{ marginTop: "16px" }}>
                  <div className="item-meta-row">
                    <span className="label">Head of Dept:</span>
                    <span className="value">{dept.head}</span>
                  </div>
                  <div className="item-meta-row">
                    <span className="label">Location:</span>
                    <span className="value">{dept.location || "Block A"}</span>
                  </div>
                  <div className="item-meta-row">
                    <span className="label">Assigned Doctors:</span>
                    <span className="value">{dept.doctors} Doctors</span>
                  </div>
                  <div className="item-meta-row" style={{ borderBottom: "none" }}>
                    <span className="label">Active Patients:</span>
                    <span className="value">{dept.patients} Patients</span>
                  </div>
                </div>
              </div>

              <div className="item-card-footer">
                <span style={{ fontSize: "11px", color: "var(--text-light)" }}>ID: #{dept.id}</span>
                <div className="action-buttons">
                  <button
                    className="action-btn-sm action-btn-edit"
                    onClick={() => openEditForm(dept)}
                    title="Edit Department"
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn-sm action-btn-delete"
                    onClick={() => handleDelete(dept.id)}
                    title="Delete Department"
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Departments;