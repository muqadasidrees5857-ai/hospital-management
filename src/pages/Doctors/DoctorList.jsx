import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Calendar, Phone, Award, DollarSign } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { doctorService, departmentService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    department: "",
    qualification: "MBBS, MD",
    experience: "5+ Years",
    consultationFee: 100,
    status: "Available",
  });

  const fetchData = async () => {
    try {
      const [docsData, deptsData] = await Promise.all([
        doctorService.getAll(`search=${encodeURIComponent(search)}`),
        departmentService.getAll(),
      ]);
      setDoctors(docsData);
      setDepartments(deptsData);
    } catch (err) {
      showError("Failed to fetch doctors or departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenForm = (doctor = null) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        department: doctor.department?._id || doctor.department || "",
        qualification: doctor.qualification || "MBBS, MD",
        experience: doctor.experience || "5+ Years",
        consultationFee: doctor.consultationFee || 100,
        status: doctor.status || "Available",
      });
    } else {
      setSelectedDoctor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        department: departments[0]?._id || "",
        qualification: "MBBS, MD",
        experience: "5+ Years",
        consultationFee: 100,
        status: "Available",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        await doctorService.update(selectedDoctor._id, formData);
        showSuccess("Doctor record updated!");
      } else {
        await doctorService.create(formData);
        showSuccess("New doctor added!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showError(err.message || "Failed to save doctor");
    }
  };

  const handleDelete = async () => {
    try {
      await doctorService.delete(deleteId);
      showSuccess("Doctor removed from directory");
      fetchData();
    } catch (err) {
      showError("Failed to delete doctor");
    }
  };

  if (loading) return <SkeletonTable rows={4} cols={4} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Doctors Roster</h1>
          <p>Medical specialists, consultation fees, and schedule availability</p>
        </div>
        <button className="btn-primary-custom" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Add New Doctor
        </button>
      </div>

      <div className="table-toolbar" style={{ borderRadius: "16px", marginBottom: "24px" }}>
        <div className="search-box-custom">
          <span className="search-icon"><Search size={16} /></span>
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {doctors.map((doc) => (
          <div key={doc._id} className="item-card">
            <div className="item-card-header">
              <div className="person-cell">
                <div className="avatar-circle" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                  {doc.name.replace("Dr. ", "").charAt(0)}
                </div>
                <div className="person-info">
                  <h4>{doc.name}</h4>
                  <p style={{ color: "#0d9488", fontWeight: "600" }}>{doc.specialization}</p>
                </div>
              </div>
              <Badge status={doc.status} />
            </div>

            <div className="item-card-body">
              <div className="item-meta-row">
                <span className="label">Department:</span>
                <span className="value">{doc.department?.name || "General"}</span>
              </div>
              <div className="item-meta-row">
                <span className="label">Qualification:</span>
                <span className="value">{doc.qualification}</span>
              </div>
              <div className="item-meta-row">
                <span className="label">Experience:</span>
                <span className="value">{doc.experience}</span>
              </div>
              <div className="item-meta-row">
                <span className="label">Consultation Fee:</span>
                <span className="value" style={{ color: "#16a34a" }}>${doc.consultationFee}</span>
              </div>
            </div>

            <div className="item-card-footer">
              <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <Phone size={14} /> {doc.phone}
              </div>
              <div className="action-buttons">
                <button className="action-btn-sm action-btn-edit" onClick={() => handleOpenForm(doc)}>
                  <Edit size={15} />
                </button>
                <button
                  className="action-btn-sm action-btn-delete"
                  onClick={() => {
                    setDeleteId(doc._id);
                    setIsConfirmDeleteOpen(true);
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDoctor ? "Edit Doctor Profile" : "Add Doctor"}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DOCTOR FULL NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Smith"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>SPECIALIZATION</label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Cardiologist"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DEPARTMENT</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>EMAIL</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
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
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CONSULTATION FEE ($)</label>
              <input
                type="number"
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>STATUS</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
                <option value="Busy">Busy</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              {selectedDoctor ? "Update Doctor" : "Add Doctor"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remove Doctor"
        message="Are you sure you want to remove this doctor from the hospital directory?"
      />
    </div>
  );
};

export default DoctorList;
