const express = require("express");
const { getDashboardStats } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);

module.exports = router;
