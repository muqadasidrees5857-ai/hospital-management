import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, UserCheck, Shield } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { staffService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    role: "Nurse",
    department: "General",
    email: "",
    phone: "",
    shift: "Morning",
    status: "Active",
  });

  const fetchStaff = async () => {
    try {
      let query = `search=${encodeURIComponent(search)}`;
      if (roleFilter) query += `&role=${encodeURIComponent(roleFilter)}`;
      const data = await staffService.getAll(query);
      setStaff(data);
    } catch (err) {
      showError("Failed to fetch staff roster");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [search, roleFilter]);

  const handleOpenForm = (member = null) => {
    if (member) {
      setSelectedStaff(member);
      setFormData({
        name: member.name,
        role: member.role,
        department: member.department || "General",
        email: member.email,
        phone: member.phone,
        shift: member.shift || "Morning",
        status: member.status || "Active",
      });
    } else {
      setSelectedStaff(null);
      setFormData({
        name: "",
        role: "Nurse",
        department: "General",
        email: "",
        phone: "",
        shift: "Morning",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStaff) {
        await staffService.update(selectedStaff._id, formData);
        showSuccess("Staff details updated!");
      } else {
        await staffService.create(formData);
        showSuccess("New staff member added!");
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      showError(err.message || "Failed to save staff member");
    }
  };

  const handleDelete = async () => {
    try {
      await staffService.delete(deleteId);
      showSuccess("Staff member deleted");
      fetchStaff();
    } catch (err) {
      showError("Failed to delete staff member");
    }
  };

  if (loading) return <SkeletonTable rows={5} cols={6} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Staff Management</h1>
          <p>Nurses, receptionists, technicians, and administrative team</p>
        </div>
        <button className="btn-primary-custom" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Add Staff Member
        </button>
      </div>

      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search by staff name, ID or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Lab Technician">Lab Technician</option>
            </select>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Department</th>
              <th>Shift</th>
              <th>Contact Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar-circle">{s.name.charAt(0)}</div>
                    <div className="person-info">
                      <h4>{s.name}</h4>
                      <p>{s.staffId} • {s.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className="badge-pill badge-blue">{s.role}</span></td>
                <td>{s.department}</td>
                <td>{s.shift} Shift</td>
                <td>{s.phone}</td>
                <td><Badge status={s.status} /></td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-sm action-btn-edit" onClick={() => handleOpenForm(s)}>
                      <Edit size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-delete"
                      onClick={() => {
                        setDeleteId(s._id);
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedStaff ? "Edit Staff Member" : "Add Staff Member"}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>FULL NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sarah Jenkins"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>ROLE</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Nurse">Nurse</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DEPARTMENT</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
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
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>SHIFT</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>STATUS</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              {selectedStaff ? "Update Staff" : "Add Staff"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to remove this staff member?"
      />
    </div>
  );
};

export default StaffList;
