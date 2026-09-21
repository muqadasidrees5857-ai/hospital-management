const Doctor = require("../models/Doctor");

// @desc Get all doctors
// @route GET /api/doctors
const getDoctors = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single doctor
// @route GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "department",
      "name code location"
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create doctor
// @route POST /api/doctors
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      department,
      qualification,
      experience,
      consultationFee,
      availability,
    } = req.body;

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      department,
      qualification: qualification || "MBBS, MD",
      experience: experience || "5+ Years",
      consultationFee: consultationFee || 50,
      availability: availability || {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: "09:00 AM - 05:00 PM",
      },
    });

    const populatedDoctor = await doctor.populate("department", "name code");
    res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update doctor
// @route PUT /api/doctors/:id
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    Object.assign(doctor, req.body);
    const updatedDoctor = await doctor.save();
    const populated = await updatedDoctor.populate("department", "name code");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete doctor
// @route DELETE /api/doctors/:id
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.deleteOne();
    res.json({ message: "Doctor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
