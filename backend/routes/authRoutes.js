const express = require("express");
const {
  loginUser,
  registerUser,
  getMe,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);

module.exports = router;
