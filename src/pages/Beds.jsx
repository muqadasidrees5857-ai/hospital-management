import { useEffect, useState } from "react";

function Beds() {
  const [beds, setBeds] = useState([
    { id: 1, bedId: "B-101", ward: "General Ward", room: "101", type: "General", patient: "Ali Khan", status: "Occupied" },
    { id: 2, bedId: "B-102", ward: "General Ward", room: "102", type: "General", patient: "-", status: "Available" },
    { id: 3, bedId: "B-201", ward: "ICU Ward", room: "201", type: "ICU", patient: "Ahmed Hassan", status: "Occupied" },
    { id: 4, bedId: "B-202", ward: "ICU Ward", room: "202", type: "ICU", patient: "-", status: "Available" },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [wardFilter, setWardFilter] = useState("All");

  // Inline Form State
  const [showForm, setShowForm] = useState(false);
  const [editingBed, setEditingBed] = useState(null);

  const [formData, setFormData] = useState({
    bedId: "",
    ward: "General Ward",
    room: "101",
    type: "General",
    patient: "-",
    status: "Available",
  });

  const fetchBeds = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/beds");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBeds(data);
        }
      }
    } catch (err) {
      console.log("Backend offline, using local state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const openAddForm = () => {
    setEditingBed(null);
    setFormData({
      bedId: `B-${100 + beds.length + 1}`,
      ward: "General Ward",
      room: "101",
      type: "General",
      patient: "-",
      status: "Available",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (bed) => {
    setEditingBed(bed);
    setFormData({
      bedId: bed.bedId || "",
      ward: bed.ward || "General Ward",
      room: bed.room || "",
      type: bed.type || "General",
      patient: bed.patient || "-",
      status: bed.status || "Available",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBed(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingBed) {
      // EDIT MODE
      const updatedItem = { ...formData, id: editingBed.id };

      setBeds((prev) =>
        prev.map((b) => (b.id === editingBed.id ? updatedItem : b))
      );

      try {
        await fetch(`http://localhost:5000/api/beds/${editingBed.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("Bed record updated successfully!");
    } else {
      // ADD MODE
      const newId = beds.length > 0 ? Math.max(...beds.map((b) => Number(b.id) || 0)) + 1 : 1;
      const newItem = { ...formData, id: newId };

      setBeds((prev) => [...prev, newItem]);

      try {
        await fetch("http://localhost:5000/api/beds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log("Backend sync offline, saved locally");
      }

      alert("New bed added successfully!");
    }

    closeForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this bed allocation?")) return;

    setBeds((prev) => prev.filter((b) => b.id !== id));

    try {
      await fetch(`http://localhost:5000/api/beds/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Backend sync offline, deleted locally");
    }
  };

  const filteredBeds = beds.filter((b) => {
    const matchesSearch =
      (b.bedId && b.bedId.toLowerCase().includes(search.toLowerCase())) ||
      (b.patient && b.patient.toLowerCase().includes(search.toLowerCase())) ||
      (b.room && b.room.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesWard = wardFilter === "All" || b.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const availableCount = beds.filter((b) => b.status === "Available").length;
  const occupiedCount = beds.filter((b) => b.status === "Occupied").length;

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Hospital Beds Management</h1>
          <p>Monitor real-time bed availability, ward occupancy, and patient assignments.</p>
        </div>
        <button className="btn-primary-custom" onClick={openAddForm}>
          <span>✚</span> Add New Bed
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
              {editingBed ? `✏️ Update Bed Allocation (#${editingBed.bedId})` : "✚ Add New Hospital Bed"}
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
                <label className="form-label-custom">Bed ID *</label>
                <input
                  type="text"
                  name="bedId"
                  className="form-control-custom"
                  placeholder="e.g. B-105"
                  value={formData.bedId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Ward *</label>
                <select
                  name="ward"
                  className="form-control-custom"
                  value={formData.ward}
                  onChange={handleChange}
                  required
                >
                  <option value="General Ward">General Ward</option>
                  <option value="ICU Ward">ICU Ward</option>
                  <option value="Private Ward">Private Ward</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                </select>
              </div>

              <div>
                <label className="form-label-custom">Room Number *</label>
                <input
                  type="text"
                  name="room"
                  className="form-control-custom"
                  placeholder="e.g. 101"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label-custom">Type</label>
                <select
                  name="type"
                  className="form-control-custom"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Private">Private</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div>
                <label className="form-label-custom">Assigned Patient</label>
                <input
                  type="text"
                  name="patient"
                  className="form-control-custom"
                  placeholder="Patient name or -"
                  value={formData.patient}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label-custom">Bed Status</label>
                <select
                  name="status"
                  className="form-control-custom"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="btn-secondary-custom" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom">
                {editingBed ? "Update Bed" : "Add Bed"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">🛏️</div>
          <div className="stat-details">
            <p>Total Hospital Beds</p>
            <h3>{beds.length}</h3>
            <span className="sub-text">Configured ward beds</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">✓</div>
          <div className="stat-details">
            <p>Available Beds</p>
            <h3>{availableCount}</h3>
            <span className="sub-text">Ready for new admission</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">🔴</div>
          <div className="stat-details">
            <p>Occupied Beds</p>
            <h3>{occupiedCount}</h3>
            <span className="sub-text">Currently assigned</span>
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
              placeholder="Search Bed ID, Room or Patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
            >
              <option value="All">All Wards</option>
              <option value="General Ward">General Ward</option>
              <option value="ICU Ward">ICU Ward</option>
              <option value="Private Ward">Private Ward</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Bed Code</th>
                <th>Ward Name</th>
                <th>Room #</th>
                <th>Type</th>
                <th>Assigned Patient</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    Loading beds status...
                  </td>
                </tr>
              ) : filteredBeds.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                    No beds found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBeds.map((bed) => (
                  <tr key={bed.id}>
                    <td>
                      <strong style={{ color: "var(--primary)" }}>#{bed.bedId}</strong>
                    </td>
                    <td>
                      <strong>{bed.ward}</strong>
                    </td>
                    <td>Room {bed.room}</td>
                    <td>
                      <span className="badge-pill badge-gray">{bed.type}</span>
                    </td>
                    <td>
                      {bed.patient === "-" ? (
                        <span style={{ color: "var(--text-light)", fontStyle: "italic" }}>
                          No Patient
                        </span>
                      ) : (
                        <strong>{bed.patient}</strong>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge-pill ${
                          bed.status === "Available" ? "badge-green" : "badge-red"
                        }`}
                      >
                        ● {bed.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn-sm action-btn-edit"
                          onClick={() => openEditForm(bed)}
                          title="Edit Bed"
                          style={{ fontSize: "14px", cursor: "pointer" }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn-sm action-btn-delete"
                          onClick={() => handleDelete(bed.id)}
                          title="Delete Bed"
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

export default Beds;
