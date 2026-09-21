const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getSettings)
  .put(protect, authorize("admin"), updateSettings);

module.exports = router;
