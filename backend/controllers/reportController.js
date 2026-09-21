const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Invoice = require("../models/Invoice");
const Department = require("../models/Department");

// @desc Get main summary dashboard metrics and charts data
// @route GET /api/reports/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalDepartments = await Department.countDocuments();
    
    // Appointments stats
    const todayStr = new Date().toISOString().split("T")[0];
    const todaysAppointments = await Appointment.countDocuments({ appointmentDate: todayStr });
    const pendingAppointments = await Appointment.countDocuments({ status: "Scheduled" });
    const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "Cancelled" });

    // Revenue calculations
    const paidInvoices = await Invoice.find({ paymentStatus: "Paid" });
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

    const pendingInvoices = await Invoice.find({ paymentStatus: "Pending" });
    const pendingRevenue = pendingInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

    // Recent activity feeds
    const recentPatients = await Patient.find().sort({ createdAt: -1 }).limit(5);
    const upcomingAppointments = await Appointment.find({ status: "Scheduled" })
      .populate("patient", "name patientId phone")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: 1 })
      .limit(5);

    // Monthly revenue mock/aggregate for charts
    const monthlyRevenue = [
      { month: "Jan", revenue: 42000, appointments: 120 },
      { month: "Feb", revenue: 58000, appointments: 155 },
      { month: "Mar", revenue: 64000, appointments: 178 },
      { month: "Apr", revenue: 72000, appointments: 210 },
      { month: "May", revenue: 85000, appointments: 240 },
      { month: "Jun", revenue: 98000, appointments: 285 },
      { month: "Jul", revenue: 110000, appointments: 310 },
    ];

    // Department distribution chart data
    const departments = await Department.find();
    const departmentDistribution = await Promise.all(
      departments.map(async (dept) => {
        const count = await Doctor.countDocuments({ department: dept._id });
        return {
          name: dept.name,
          doctors: count,
        };
      })
    );

    res.json({
      summary: {
        totalPatients,
        totalDoctors,
        totalDepartments,
        todaysAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        pendingRevenue,
      },
      recentPatients,
      upcomingAppointments,
      monthlyRevenue,
      departmentDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
