const express = require("express");
const {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getStaffList).post(protect, authorize("admin"), createStaff);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateStaff)
  .delete(protect, authorize("admin"), deleteStaff);

module.exports = router;
