const Staff = require("../models/Staff");

const generateStaffId = async () => {
  const count = await Staff.countDocuments();
  return `STF-${String(count + 301).padStart(4, "0")}`;
};

// @desc Get all staff
// @route GET /api/staff
const getStaffList = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { staffId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const staffList = await Staff.find(query).sort({ createdAt: -1 });
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create staff member
// @route POST /api/staff
const createStaff = async (req, res) => {
  try {
    const { name, role, department, email, phone, shift, status } = req.body;

    const staffId = await generateStaffId();

    const staff = await Staff.create({
      staffId,
      name,
      role,
      department: department || "General",
      email,
      phone,
      shift: shift || "Morning",
      status: status || "Active",
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update staff member
// @route PUT /api/staff/:id
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    Object.assign(staff, req.body);
    const updated = await staff.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete staff member
// @route DELETE /api/staff/:id
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    await staff.deleteOne();
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
};
