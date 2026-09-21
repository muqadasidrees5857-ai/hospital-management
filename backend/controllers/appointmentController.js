const Appointment = require("../models/Appointment");

const generateAppointmentId = async () => {
  const count = await Appointment.countDocuments();
  return `APT-${String(count + 1001).padStart(5, "0")}`;
};

// @desc Get all appointments
// @route GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const { status, doctor, patient, date, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (date) query.appointmentDate = date;

    const appointments = await Appointment.find(query)
      .populate("patient", "name patientId phone age gender")
      .populate("doctor", "name specialization consultationFee")
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = appointments.filter(
        (apt) =>
          apt.appointmentId.toLowerCase().includes(searchLower) ||
          (apt.patient && apt.patient.name.toLowerCase().includes(searchLower)) ||
          (apt.doctor && apt.doctor.name.toLowerCase().includes(searchLower))
      );
      return res.json(filtered);
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single appointment
// @route GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient")
      .populate("doctor")
      .populate("department");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create appointment
// @route POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, department, appointmentDate, timeSlot, reason, notes } = req.body;

    const appointmentId = await generateAppointmentId();

    const appointment = await Appointment.create({
      appointmentId,
      patient,
      doctor,
      department,
      appointmentDate,
      timeSlot,
      reason: reason || "General Checkup",
      notes: notes || "",
      status: "Scheduled",
    });

    const populated = await appointment.populate([
      { path: "patient", select: "name patientId phone" },
      { path: "doctor", select: "name specialization" },
      { path: "department", select: "name code" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    Object.assign(appointment, req.body);
    const updated = await appointment.save();

    const populated = await updated.populate([
      { path: "patient", select: "name patientId phone" },
      { path: "doctor", select: "name specialization" },
      { path: "department", select: "name code" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel appointment
// @route PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete appointment
// @route DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
};
