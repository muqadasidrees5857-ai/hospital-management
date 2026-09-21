const express = require("express");
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getDepartments).post(protect, createDepartment);
router
  .route("/:id")
  .get(protect, getDepartmentById)
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment);

module.exports = router;
