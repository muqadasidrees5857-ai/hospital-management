import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, Phone, HeartPulse, User } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { patientService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    bloodGroup: "O+",
    disease: "",
    status: "Outpatient",
    emergencyName: "",
    emergencyRel: "",
    emergencyPhone: "",
  });

  const fetchPatients = async () => {
    try {
      let query = `search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;
      const data = await patientService.getAll(query);
      setPatients(data);
    } catch (err) {
      showError("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, statusFilter]);

  const handleOpenForm = (patient = null) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || "",
        bloodGroup: patient.bloodGroup || "O+",
        disease: patient.disease || "",
        status: patient.status || "Outpatient",
        emergencyName: patient.emergencyContact?.name || "",
        emergencyRel: patient.emergencyContact?.relationship || "",
        emergencyPhone: patient.emergencyContact?.phone || "",
      });
    } else {
      setSelectedPatient(null);
      setFormData({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        email: "",
        bloodGroup: "O+",
        disease: "General Checkup",
        status: "Outpatient",
        emergencyName: "",
        emergencyRel: "",
        emergencyPhone: "",
      });
    }
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        disease: formData.disease,
        status: formData.status,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRel,
          phone: formData.emergencyPhone,
        },
      };

      if (selectedPatient) {
        await patientService.update(selectedPatient._id, payload);
        showSuccess("Patient record updated successfully!");
      } else {
        await patientService.create(payload);
        showSuccess("New patient registered successfully!");
      }
      setIsFormModalOpen(false);
      fetchPatients();
    } catch (err) {
      showError(err.message || "Failed to save patient record");
    }
  };

  const handleDelete = async () => {
    try {
      await patientService.delete(deleteId);
      showSuccess("Patient record deleted");
      fetchPatients();
    } catch (err) {
      showError("Failed to delete patient");
    }
  };

  if (loading) return <SkeletonTable rows={6} cols={6} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Patients Directory</h1>
          <p>Register, track medical profiles, and manage patient admissions</p>
        </div>
        <button className="btn-primary-custom" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Register Patient
        </button>
      </div>

      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search by name, ID, disease..."
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
              <option value="">All Statuses</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age/Gender</th>
              <th>Contact Phone</th>
              <th>Blood</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar-circle">{p.name.charAt(0)}</div>
                    <div className="person-info">
                      <h4>{p.name}</h4>
                      <p>{p.patientId}</p>
                    </div>
                  </div>
                </td>
                <td>{p.age} Yrs / {p.gender}</td>
                <td>{p.phone}</td>
                <td><span className="badge-pill badge-blue">{p.bloodGroup}</span></td>
                <td>{p.disease}</td>
                <td><Badge status={p.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn-sm"
                      title="View Details"
                      onClick={() => {
                        setSelectedPatient(p);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-edit"
                      title="Edit Patient"
                      onClick={() => handleOpenForm(p)}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-delete"
                      title="Delete Patient"
                      onClick={() => {
                        setDeleteId(p._id);
                        setIsConfirmDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPatient ? "Edit Patient Record" : "Register New Patient"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>FULL NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>AGE</label>
              <input
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>GENDER</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PHONE</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>BLOOD GROUP</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PRIMARY DIAGNOSIS / CONDITION</label>
              <input
                type="text"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full" style={{ marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
              <h4 style={{ fontSize: "13px", color: "#0d9488", marginBottom: "8px" }}>Emergency Contact Info</h4>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CONTACT NAME</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>RELATIONSHIP</label>
              <input
                type="text"
                value={formData.emergencyRel}
                onChange={(e) => setFormData({ ...formData, emergencyRel: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              {selectedPatient ? "Update Patient" : "Register Patient"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAIL VIEW MODAL */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Patient Medical Profile"
      >
        {selectedPatient && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div className="avatar-circle" style={{ width: "56px", height: "56px", fontSize: "20px" }}>
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{selectedPatient.name}</h3>
                <p style={{ fontSize: "13px", color: "#64748b" }}>ID: {selectedPatient.patientId} • Blood: {selectedPatient.bloodGroup}</p>
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "13px", color: "#0d9488", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <HeartPulse size={16} /> Clinical Background
              </h4>
              <p style={{ fontSize: "13px", color: "#334155" }}><strong>Condition:</strong> {selectedPatient.disease}</p>
              <p style={{ fontSize: "13px", color: "#334155", marginTop: "4px" }}><strong>Status:</strong> {selectedPatient.status}</p>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
              <h4 style={{ fontSize: "13px", color: "#0d9488", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={16} /> Emergency Contact
              </h4>
              <p style={{ fontSize: "13px", color: "#334155" }}>
                <strong>{selectedPatient.emergencyContact?.name || "N/A"}</strong> ({selectedPatient.emergencyContact?.relationship || "Relative"})
              </p>
              <p style={{ fontSize: "13px", color: "#64748b" }}>{selectedPatient.emergencyContact?.phone || "No phone recorded"}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Patient Record"
        message="Are you sure you want to permanently delete this patient record?"
      />
    </div>
  );
};

export default PatientList;
