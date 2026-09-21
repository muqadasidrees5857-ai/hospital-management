const Patient = require("../models/Patient");

// Helper to generate sequential patient ID
const generatePatientId = async () => {
  const count = await Patient.countDocuments();
  return `PAT-${String(count + 101).padStart(4, "0")}`;
};

// @desc Get all patients
// @route GET /api/patients
const getPatients = async (req, res) => {
  try {
    const { search, gender, bloodGroup, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { disease: { $regex: search, $options: "i" } },
      ];
    }

    if (gender) query.gender = gender;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.status = status;

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single patient by ID
// @route GET /api/patients/:id
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create patient
// @route POST /api/patients
const createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      disease,
      emergencyContact,
      medicalHistory,
      status,
    } = req.body;

    const patientId = await generatePatientId();

    const patient = await Patient.create({
      patientId,
      name,
      age,
      gender,
      phone,
      email: email || "",
      address: address || "",
      bloodGroup: bloodGroup || "O+",
      disease: disease || "General Checkup",
      emergencyContact: emergencyContact || { name: "", relationship: "", phone: "" },
      medicalHistory: medicalHistory || [],
      status: status || "Outpatient",
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update patient
// @route PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    Object.assign(patient, req.body);
    const updatedPatient = await patient.save();

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete patient
// @route DELETE /api/patients/:id
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patient.deleteOne();
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
