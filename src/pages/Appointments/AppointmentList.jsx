import React, { useState, useEffect } from "react";
import { Plus, Search, Calendar, Clock, Check, XCircle, Trash2, Edit } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { appointmentService, patientService, doctorService, departmentService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    department: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "09:30 AM",
    reason: "General Consultation",
    notes: "",
  });

  const fetchAll = async () => {
    try {
      let query = `search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;
      const [aptsData, ptsData, docsData, deptsData] = await Promise.all([
        appointmentService.getAll(query),
        patientService.getAll(),
        doctorService.getAll(),
        departmentService.getAll(),
      ]);
      setAppointments(aptsData);
      setPatients(ptsData);
      setDoctors(docsData);
      setDepartments(deptsData);
    } catch (err) {
      showError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [search, statusFilter]);

  const handleOpenForm = (apt = null) => {
    if (apt) {
      setSelectedApt(apt);
      setFormData({
        patient: apt.patient?._id || "",
        doctor: apt.doctor?._id || "",
        department: apt.department?._id || "",
        appointmentDate: apt.appointmentDate,
        timeSlot: apt.timeSlot,
        reason: apt.reason || "General Consultation",
        notes: apt.notes || "",
      });
    } else {
      setSelectedApt(null);
      setFormData({
        patient: patients[0]?._id || "",
        doctor: doctors[0]?._id || "",
        department: departments[0]?._id || "",
        appointmentDate: new Date().toISOString().split("T")[0],
        timeSlot: "09:30 AM",
        reason: "General Consultation",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedApt) {
        await appointmentService.update(selectedApt._id, formData);
        showSuccess("Appointment updated!");
      } else {
        await appointmentService.create(formData);
        showSuccess("New appointment scheduled!");
      }
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      showError(err.message || "Failed to save appointment");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus });
      showSuccess(`Status updated to ${newStatus}`);
      fetchAll();
    } catch (err) {
      showError("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentService.delete(deleteId);
      showSuccess("Appointment removed");
      fetchAll();
    } catch (err) {
      showError("Failed to delete appointment");
    }
  };

  if (loading) return <SkeletonTable rows={5} cols={6} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Appointments Calendar</h1>
          <p>Book consultation slots, doctor assignments, and appointment tracking</p>
        </div>
        <button className="btn-primary-custom" onClick={() => handleOpenForm()}>
          <Plus size={18} /> Schedule Appointment
        </button>
      </div>

      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search appointment ID or patient name..."
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
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Assigned Doctor</th>
              <th>Date & Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td><span style={{ fontWeight: "700", color: "#0d9488" }}>{apt.appointmentId}</span></td>
                <td>
                  <div className="person-info">
                    <h4>{apt.patient?.name || "Unassigned"}</h4>
                    <p>{apt.patient?.phone}</p>
                  </div>
                </td>
                <td>
                  <div className="person-info">
                    <h4>{apt.doctor?.name || "Unassigned"}</h4>
                    <p style={{ color: "#0284c7" }}>{apt.doctor?.specialization}</p>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px", fontWeight: "600" }}>{apt.appointmentDate}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> {apt.timeSlot}
                  </div>
                </td>
                <td>{apt.reason}</td>
                <td>
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-sm action-btn-edit" onClick={() => handleOpenForm(apt)}>
                      <Edit size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-delete"
                      onClick={() => {
                        setDeleteId(apt._id);
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedApt ? "Edit Appointment" : "Schedule Appointment"}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PATIENT</label>
              <select
                required
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DOCTOR</label>
              <select
                required
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
                ))}
              </select>
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
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DATE</label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>TIME SLOT</label>
              <input
                type="text"
                required
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="10:00 AM"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CONSULTATION REASON</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              {selectedApt ? "Update Appointment" : "Confirm Booking"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment slot?"
      />
    </div>
  );
};

export default AppointmentList;
