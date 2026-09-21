import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Patients() {
  const [patients, setPatients] = useState([
    { id: 1, name: "Ali Khan", age: 35, gender: "Male", phone: "0300-1234567", disease: "Fever", bloodGroup: "B+" },
    { id: 2, name: "Sarah Malik", age: 28, gender: "Female", phone: "0312-7654321", disease: "Migraine", bloodGroup: "O+" },
    { id: 3, name: "Ahmed Hassan", age: 42, gender: "Male", phone: "0321-4567890", disease: "Diabetes", bloodGroup: "A+" },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("All");

  // Form State (For both Add and Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    disease: "",
    bloodGroup: "B+",
  });

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        }
      }
    } catch (err) {
      console.log("Backend offline, using fallback state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const openAddForm = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      disease: "",
      bloodGroup: "B+",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      disease: patient.disease || "",
      bloodGroup: patient.bloodGroup || "B+",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPatient) {
      // EDIT MODE
      const updatedItem = { ...formData, id: editingPatient.id };
      
      // Update local state immediately
      setPatients((prev) =>
        prev.map((p) => (p.id === editingPatient.id ? updatedItem : p))
      );

      // Backend sync
      try {
        await fetch(`http://localhost:5000/api/patients/${editingPatient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync failed, updated locally.");
      }

      alert("Patient updated successfully!");
    } else {
      // ADD MODE
      const newId = patients.length > 0 ? Math.max(...patients.map((p) => Number(p.id) || 0)) + 1 : 1;
      const newItem = { ...formData, id: newId };

      setPatients((prev) => [...prev, newItem]);

      try {
        await fetch("http://localhost:5000/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync failed, added locally.");
      }

      alert("Patient added successfully!");
    }

    closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;

    setPatients((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Backend sync failed, deleted locally.");
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.disease && p.disease.toLowerCase().includes(search.toLowerCase())) ||
      (p.phone && p.phone.includes(search));
    const matchesBlood = bloodFilter === "All" || p.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Patients Registry</h1>
          <p>Manage, search, edit, and add patient healthcare records.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary-custom" onClick={openAddForm}>
            <span>✚</span> Add Patient (Quick)
          </button>
          <Link to="/add-patient" className="btn-secondary-custom">
            Full Registration Form →
          </Link>
        </div>
      </div>

      {/* INLINE ADD / EDIT FORM CARD */}
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
              {editingPatient ? `✏️ Edit Patient Record (#P-${editingPatient.id})` : "✚ Register New Patient"}
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
                  placeholder="Enter patient full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Age *</label>
                <input
                  type="number"
                  name="age"
                  className="form-control-custom"
                  placeholder="e.g. 35"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Gender *</label>
                <select
                  name="gender"
                  className="form-control-custom"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
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
                <label className="form-label-custom">Blood Group *</label>
                <select
                  name="bloodGroup"
                  className="form-control-custom"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group-full">
                <label className="form-label-custom">Disease / Condition *</label>
                <input
                  type="text"
                  name="disease"
                  className="form-control-custom"
                  placeholder="e.g. Fever, Hypertension"
                  value={formData.disease}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="btn-secondary-custom" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom">
                {editingPatient ? "Save Changes" : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">👥</div>
          <div className="stat-details">
            <p>Total Patients</p>
            <h3>{patients.length}</h3>
            <span className="sub-text">Registered Patients</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-teal">🩸</div>
          <div className="stat-details">
            <p>Blood Groups</p>
            <h3>8 Types</h3>
            <span className="sub-text">A+, B+, O+, AB+ & Negative</span>
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
              placeholder="Search patient name, disease, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
            >
              <option value="All">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone Number</th>
                <th>Disease / Condition</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    Loading patient list...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    No patient records found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="person-cell">
                        <div className="avatar-circle">
                          {p.name ? p.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="person-info">
                          <h4>{p.name}</h4>
                          <p>#P-{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{p.age} Yrs</td>
                    <td>{p.gender}</td>
                    <td>📞 {p.phone}</td>
                    <td>
                      <span className="badge-pill badge-gray">{p.disease}</span>
                    </td>
                    <td>
                      <span className="badge-pill badge-red" style={{ fontWeight: "700" }}>
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-sm action-btn-edit"
                          onClick={() => openEditForm(p)}
                          title="Edit Patient"
                          style={{ fontSize: "15px", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn-sm action-btn-delete"
                          onClick={() => handleDelete(p.id)}
                          title="Delete Patient"
                          style={{ fontSize: "15px", cursor: "pointer" }}
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

export default Patients;
