const Invoice = require("../models/Invoice");

const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${String(count + 2001).padStart(5, "0")}`;
};

// @desc Get all invoices
// @route GET /api/billing
const getInvoices = async (req, res) => {
  try {
    const { status, patient, search } = req.query;
    let query = {};

    if (status) query.paymentStatus = status;
    if (patient) query.patient = patient;

    const invoices = await Invoice.find(query)
      .populate("patient", "name patientId phone email address")
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      const filtered = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(s) ||
          (inv.patient && inv.patient.name.toLowerCase().includes(s))
      );
      return res.json(filtered);
    }

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single invoice
// @route GET /api/billing/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("patient");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create invoice
// @route POST /api/billing
const createInvoice = async (req, res) => {
  try {
    const { patient, items, tax, discount, paymentStatus, paymentMethod, dueDate } = req.body;

    const invoiceNumber = await generateInvoiceNumber();

    const subtotal = items.reduce((acc, item) => acc + Number(item.amount), 0);
    const taxAmount = (subtotal * (Number(tax) || 0)) / 100;
    const totalAmount = subtotal + taxAmount - (Number(discount) || 0);

    const invoice = await Invoice.create({
      invoiceNumber,
      patient,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      totalAmount,
      paymentStatus: paymentStatus || "Pending",
      paymentMethod: paymentMethod || "Cash",
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    const populated = await invoice.populate("patient", "name patientId phone email address");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update invoice status / payment details
// @route PUT /api/billing/:id
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    Object.assign(invoice, req.body);
    
    // Recalculate subtotal and total if items modified
    if (req.body.items) {
      const subtotal = req.body.items.reduce((acc, item) => acc + Number(item.amount), 0);
      const taxAmount = (subtotal * (Number(invoice.tax) || 0)) / 100;
      invoice.subtotal = subtotal;
      invoice.totalAmount = subtotal + taxAmount - (Number(invoice.discount) || 0);
    }

    const updated = await invoice.save();
    const populated = await updated.populate("patient", "name patientId phone email address");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete invoice
// @route DELETE /api/billing/:id
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.deleteOne();
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
