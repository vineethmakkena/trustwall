const express = require("express");
const { uploadAvatar } = require("../controllers/uploadController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const uploadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 30,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: { success: false, message: "Too many uploads. Please try again later." },
});

router.post("/avatar", protect, uploadLimiter, upload.single("avatar"), uploadAvatar);

module.exports = router;
