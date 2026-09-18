const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.patch("/me/profile", protect, updateProfile);
router.patch("/me/password", protect, changePassword);
router.delete("/me", protect, deleteAccount);

module.exports = router;
