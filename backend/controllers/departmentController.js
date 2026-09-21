const Department = require("../models/Department");
const Doctor = require("../models/Doctor");

// @desc Get all departments
// @route GET /api/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    
    // Attach doctor count to each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({ department: dept._id });
        return {
          ...dept.toObject(),
          doctorCount,
        };
      })
    );

    res.json(departmentsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single department
// @route GET /api/departments/:id
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    const doctors = await Doctor.find({ department: department._id });
    res.json({ department, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create department
// @route POST /api/departments
const createDepartment = async (req, res) => {
  try {
    const { name, code, description, headOfDepartment, location } = req.body;

    const departmentExists = await Department.findOne({ name });
    if (departmentExists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      code,
      description,
      headOfDepartment: headOfDepartment || "Unassigned",
      location: location || "Main Block",
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update department
// @route PUT /api/departments/:id
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    Object.assign(department, req.body);
    const updatedDepartment = await department.save();

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete department
// @route DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.deleteOne();
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
