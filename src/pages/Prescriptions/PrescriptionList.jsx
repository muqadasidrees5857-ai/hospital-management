import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Printer, Trash2, Pill } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { prescriptionService, patientService, doctorService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    notes: "",
    medicines: [{ name: "", dosage: "", frequency: "1-0-1", duration: "5 Days", instructions: "Take after food" }],
  });

  const fetchAll = async () => {
    try {
      const [rxData, ptsData, docsData] = await Promise.all([
        prescriptionService.getAll(`search=${encodeURIComponent(search)}`),
        patientService.getAll(),
        doctorService.getAll(),
      ]);
      setPrescriptions(rxData);
      setPatients(ptsData);
      setDoctors(docsData);
    } catch (err) {
      showError("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [search]);

  const handleAddMedicineRow = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: "", dosage: "", frequency: "1-0-1", duration: "5 Days", instructions: "Take after food" },
      ],
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const handleRemoveMedicineRow = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await prescriptionService.create(formData);
      showSuccess("Prescription issued!");
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      showError(err.message || "Failed to create prescription");
    }
  };

  const handleDelete = async () => {
    try {
      await prescriptionService.delete(deleteId);
      showSuccess("Prescription removed");
      fetchAll();
    } catch (err) {
      showError("Failed to delete prescription");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <SkeletonTable rows={5} cols={5} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Prescriptions Register</h1>
          <p>Issue medical prescriptions, dosage details, and print official slips</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Issue Prescription
        </button>
      </div>

      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search by Rx ID, patient name or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Rx ID</th>
              <th>Patient</th>
              <th>Prescribing Doctor</th>
              <th>Diagnosis</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((rx) => (
              <tr key={rx._id}>
                <td><span style={{ fontWeight: "700", color: "#0d9488" }}>{rx.prescriptionId}</span></td>
                <td>
                  <div className="person-info">
                    <h4>{rx.patient?.name || "Patient"}</h4>
                    <p>ID: {rx.patient?.patientId}</p>
                  </div>
                </td>
                <td>
                  <div className="person-info">
                    <h4>{rx.doctor?.name || "Doctor"}</h4>
                    <p>{rx.doctor?.specialization}</p>
                  </div>
                </td>
                <td>{rx.diagnosis}</td>
                <td>{rx.date}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn-sm"
                      title="View & Print"
                      onClick={() => {
                        setSelectedRx(rx);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-delete"
                      onClick={() => {
                        setDeleteId(rx._id);
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

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue New Prescription" maxWidth="680px">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
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
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DIAGNOSIS</label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Essential Hypertension"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>

            <div className="form-group-full" style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "13px", color: "#0d9488" }}>Prescribed Medicines</h4>
                <button type="button" className="btn-secondary-custom" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={handleAddMedicineRow}>
                  + Add Medicine Row
                </button>
              </div>

              {formData.medicines.map((med, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    required
                    value={med.name}
                    onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                    style={{ flex: 2, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    required
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    type="text"
                    placeholder="Freq (1-0-1)"
                    required
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  {formData.medicines.length > 1 && (
                    <button type="button" className="action-btn-sm action-btn-delete" onClick={() => handleRemoveMedicineRow(idx)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              Save & Issue Rx
            </button>
          </div>
        </form>
      </Modal>

      {/* PREVIEW / PRINT MODAL */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Official Prescription Document" maxWidth="640px">
        {selectedRx && (
          <div>
            <div style={{ borderBottom: "2px solid #0d9488", paddingBottom: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>APEXCARE HOSPITAL</h2>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>742 Evergreen Terrace, NY • Tel: +1 (800) 555-0199</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h4 style={{ color: "#0d9488", fontSize: "16px" }}>PRESCRIPTION</h4>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>Rx #: {selectedRx.prescriptionId}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>PATIENT INFORMATION</p>
                <h4 style={{ fontSize: "15px", color: "#0f172a" }}>{selectedRx.patient?.name}</h4>
                <p style={{ fontSize: "13px", color: "#475569" }}>Age: {selectedRx.patient?.age} • Blood: {selectedRx.patient?.bloodGroup}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", color: "#64748b" }}>PRESCRIBING DOCTOR</p>
                <h4 style={{ fontSize: "15px", color: "#0f172a" }}>{selectedRx.doctor?.name}</h4>
                <p style={{ fontSize: "13px", color: "#475569" }}>{selectedRx.doctor?.qualification}</p>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14px", color: "#0d9488", marginBottom: "8px" }}>Diagnosis: {selectedRx.diagnosis}</h4>
              <table className="custom-table" style={{ border: "1px solid #e2e8f0" }}>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRx.medicines.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: "600" }}>{m.name}</td>
                      <td>{m.dosage}</td>
                      <td>{m.frequency}</td>
                      <td>{m.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button className="btn-secondary-custom" onClick={handlePrint}>
                <Printer size={16} /> Print Prescription
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription?"
      />
    </div>
  );
};

export default PrescriptionList;
