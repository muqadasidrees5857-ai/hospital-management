const Prescription = require("../models/Prescription");

const generatePrescriptionId = async () => {
  const count = await Prescription.countDocuments();
  return `RX-${String(count + 501).padStart(4, "0")}`;
};

// @desc Get all prescriptions
// @route GET /api/prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const { patient, doctor, search } = req.query;
    let query = {};

    if (patient) query.patient = patient;
    if (doctor) query.doctor = doctor;

    const prescriptions = await Prescription.find(query)
      .populate("patient", "name patientId age gender bloodGroup")
      .populate("doctor", "name specialization qualification")
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      const filtered = prescriptions.filter(
        (rx) =>
          rx.prescriptionId.toLowerCase().includes(s) ||
          rx.diagnosis.toLowerCase().includes(s) ||
          (rx.patient && rx.patient.name.toLowerCase().includes(s)) ||
          (rx.doctor && rx.doctor.name.toLowerCase().includes(s))
      );
      return res.json(filtered);
    }

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get prescription by ID
// @route GET /api/prescriptions/:id
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient")
      .populate("doctor");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create prescription
// @route POST /api/prescriptions
const createPrescription = async (req, res) => {
  try {
    const { patient, doctor, diagnosis, medicines, notes, date } = req.body;

    const prescriptionId = await generatePrescriptionId();

    const prescription = await Prescription.create({
      prescriptionId,
      patient,
      doctor,
      diagnosis,
      medicines: medicines || [],
      notes: notes || "",
      date: date || new Date().toISOString().split("T")[0],
    });

    const populated = await prescription.populate([
      { path: "patient", select: "name patientId age gender" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete prescription
// @route DELETE /api/prescriptions/:id
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await prescription.deleteOne();
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  deletePrescription,
};
