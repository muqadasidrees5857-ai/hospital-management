import React, { useState, useEffect } from "react";
import { Plus, Building2, UserCheck, MapPin, Edit, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { departmentService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headOfDepartment: "",
    location: "Main Block",
  });

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      showError("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenForm = (dept = null) => {
    if (dept) {
      setSelectedDept(dept);
      setFormData({
        name: dept.name,
        code: dept.code,
        description: dept.description || "",
        headOfDepartment: dept.headOfDepartment || "",
        location: dept.location || "Main Block",
      });
    } else {
      setSelectedDept(null);
      setFormData({
        name: "",
        code: "",
        description: "",
        headOfDepartment: "",
        location: "Main Block",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDept) {
        await departmentService.update(selectedDept._id, formData);
        showSuccess("Department updated successfully!");
      } else {
        await departmentService.create(formData);
        showSuccess("Department created!");
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showError(err.message || "Failed to save department");
    }
  };

  const handleDelete = async () => {
    try {
      await departmentService.delete(deleteId);
      showSuccess("Department deleted");
      fetchDepartments();
    } catch (err) {
      showError("Failed to delete department");
    }
  };

  if (loading) return <SkeletonTable rows={4} cols={4} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Hospital Departments</h1>
          <p>Clinical divisions, department heads, and doctor capacity</p>
        </div>
        <button className="btn-primary-custom" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Add Department
        </button>
      </div>

      <div className="cards-grid">
        {departments.map((dept) => (
          <div key={dept._id} className="item-card">
            <div>
              <div className="item-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#e6f4f1",
                      color: "#0f766e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "17px", fontWeight: "700" }}>{dept.name}</h3>
                    <span className="badge-pill badge-blue" style={{ fontSize: "11px" }}>{dept.code}</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "12px 0 16px" }}>
                {dept.description || "No description provided."}
              </p>

              <div className="item-meta-row">
                <span className="label">Head of Dept:</span>
                <span className="value">{dept.headOfDepartment || "Unassigned"}</span>
              </div>
              <div className="item-meta-row">
                <span className="label">Assigned Doctors:</span>
                <span className="value" style={{ color: "#0d9488", fontWeight: "700" }}>
                  {dept.doctorCount || 0} Specialists
                </span>
              </div>
              <div className="item-meta-row">
                <span className="label">Location:</span>
                <span className="value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={13} /> {dept.location}
                </span>
              </div>
            </div>

            <div className="item-card-footer" style={{ marginTop: "16px" }}>
              <div className="action-buttons" style={{ marginLeft: "auto" }}>
                <button className="action-btn-sm action-btn-edit" onClick={() => handleOpenForm(dept)}>
                  <Edit size={15} />
                </button>
                <button
                  className="action-btn-sm action-btn-delete"
                  onClick={() => {
                    setDeleteId(dept._id);
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDept ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DEPARTMENT NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Cardiology"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CODE</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="CARD"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>HEAD OF DEPARTMENT</label>
              <input
                type="text"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                placeholder="Dr. Robert Vance"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>LOCATION</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Building A, Floor 3"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DESCRIPTION</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              {selectedDept ? "Update Department" : "Save Department"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
      />
    </div>
  );
};

export default DepartmentList;
