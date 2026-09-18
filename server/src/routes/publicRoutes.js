const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  getPublicSpaceBySlug,
  submitTestimonial,
} = require("../controllers/publicTestimonialController");
const upload = require("../middleware/uploadMiddleware");

const testimonialSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many submissions. Please try again later.",
    });
  },
});

const router = express.Router();

router.get("/spaces/:slug", getPublicSpaceBySlug);
router.post("/spaces/:slug/testimonials", testimonialSubmissionLimiter, upload.single("avatar"), submitTestimonial);

module.exports = router;
