import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Printer, Trash2, CreditCard, DollarSign } from "lucide-react";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { billingService, patientService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    patient: "",
    items: [
      { description: "Specialist Doctor Consultation", category: "Consultation", amount: 100 },
      { description: "Blood Diagnostic Panel", category: "Lab Test", amount: 80 },
    ],
    tax: 5,
    discount: 10,
    paymentStatus: "Pending",
    paymentMethod: "Cash",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const fetchAll = async () => {
    try {
      let query = `search=${encodeURIComponent(search)}`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;
      const [invData, ptsData] = await Promise.all([
        billingService.getAll(query),
        patientService.getAll(),
      ]);
      setInvoices(invData);
      setPatients(ptsData);
    } catch (err) {
      showError("Failed to fetch billing invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [search, statusFilter]);

  const handleAddItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", category: "Consultation", amount: 0 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const handleRemoveItemRow = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await billingService.create(formData);
      showSuccess("Invoice created successfully!");
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      showError(err.message || "Failed to create invoice");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await billingService.update(id, { paymentStatus: newStatus });
      showSuccess(`Invoice status marked as ${newStatus}`);
      fetchAll();
    } catch (err) {
      showError("Failed to update invoice status");
    }
  };

  const handleDelete = async () => {
    try {
      await billingService.delete(deleteId);
      showSuccess("Invoice removed");
      fetchAll();
    } catch (err) {
      showError("Failed to delete invoice");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <SkeletonTable rows={5} cols={6} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Billing & Invoices</h1>
          <p>Create patient invoices, itemized charges, and payment receipts</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Invoice
        </button>
      </div>

      <div className="table-card-container">
        <div className="table-toolbar">
          <div className="search-box-custom">
            <span className="search-icon"><Search size={16} /></span>
            <input
              type="text"
              placeholder="Search by invoice # or patient name..."
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
              <option value="">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Total Amount</th>
              <th>Method</th>
              <th>Due Date</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td><span style={{ fontWeight: "700", color: "#0d9488" }}>{inv.invoiceNumber}</span></td>
                <td>
                  <div className="person-info">
                    <h4>{inv.patient?.name || "Patient"}</h4>
                    <p>{inv.patient?.phone}</p>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: "800", color: "#0f172a" }}>
                    ${inv.totalAmount.toFixed(2)}
                  </span>
                </td>
                <td>{inv.paymentMethod}</td>
                <td>{inv.dueDate}</td>
                <td>
                  <select
                    value={inv.paymentStatus}
                    onChange={(e) => handleStatusUpdate(inv._id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn-sm"
                      title="View Invoice Slip"
                      onClick={() => {
                        setSelectedInv(inv);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="action-btn-sm action-btn-delete"
                      onClick={() => {
                        setDeleteId(inv._id);
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Patient Invoice" maxWidth="680px">
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

            <div className="form-group-full" style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "13px", color: "#0d9488" }}>Line Items & Services</h4>
                <button type="button" className="btn-secondary-custom" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={handleAddItemRow}>
                  + Add Item
                </button>
              </div>

              {formData.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Description"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    style={{ flex: 2, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Room Charge">Room Charge</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    required
                    value={item.amount}
                    onChange={(e) => handleItemChange(idx, "amount", Number(e.target.value))}
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                  {formData.items.length > 1 && (
                    <button type="button" className="action-btn-sm action-btn-delete" onClick={() => handleRemoveItemRow(idx)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>TAX (%)</label>
              <input
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DISCOUNT ($)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PAYMENT METHOD</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Insurance">Insurance</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PAYMENT STATUS</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE INVOICE MODAL */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Official Billing Statement" maxWidth="640px">
        {selectedInv && (
          <div>
            <div style={{ borderBottom: "2px solid #0d9488", paddingBottom: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>APEXCARE HOSPITAL</h2>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>Medical District • Tel: +1 (800) 555-0199</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h4 style={{ color: "#0d9488", fontSize: "16px" }}>INVOICE</h4>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>Invoice #: {selectedInv.invoiceNumber}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#64748b" }}>BILLED TO</p>
                <h4 style={{ fontSize: "15px", color: "#0f172a" }}>{selectedInv.patient?.name}</h4>
                <p style={{ fontSize: "13px", color: "#475569" }}>Patient ID: {selectedInv.patient?.patientId}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", color: "#64748b" }}>PAYMENT STATUS</p>
                <Badge status={selectedInv.paymentStatus} />
                <p style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>Method: {selectedInv.paymentMethod}</p>
              </div>
            </div>

            <table className="custom-table" style={{ border: "1px solid #e2e8f0", marginBottom: "20px" }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInv.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td><span className="badge-pill badge-blue" style={{ fontSize: "11px" }}>{item.category}</span></td>
                    <td style={{ fontWeight: "600" }}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ width: "240px", marginLeft: "auto", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "#64748b" }}>Subtotal:</span>
                <span>${selectedInv.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "#64748b" }}>Tax ({selectedInv.tax}%):</span>
                <span>+${((selectedInv.subtotal * selectedInv.tax) / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "#64748b" }}>Discount:</span>
                <span>-${selectedInv.discount.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: "2px solid #0f172a",
                  fontWeight: "800",
                  fontSize: "16px",
                  color: "#0f172a",
                }}
              >
                <span>Total Due:</span>
                <span>${selectedInv.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button className="btn-secondary-custom" onClick={handlePrint}>
                <Printer size={16} /> Print Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice record?"
      />
    </div>
  );
};

export default InvoiceList;
