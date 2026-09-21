const express = require("express");
const {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getPrescriptions).post(protect, createPrescription);
router
  .route("/:id")
  .get(protect, getPrescriptionById)
  .delete(protect, deletePrescription);

module.exports = router;
