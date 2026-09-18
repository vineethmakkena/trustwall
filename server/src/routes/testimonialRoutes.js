const express = require("express");
const {
  getTestimonials,
  getTestimonial,
  approveTestimonial,
  rejectTestimonial,
  archiveTestimonial,
  featureTestimonial,
  likeTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/spaces/:spaceId/testimonials", getTestimonials);
router.get("/testimonials/:id", getTestimonial);
router.patch("/testimonials/:id/approve", approveTestimonial);
router.patch("/testimonials/:id/reject", rejectTestimonial);
router.patch("/testimonials/:id/archive", archiveTestimonial);
router.patch("/testimonials/:id/feature", featureTestimonial);
router.patch("/testimonials/:id/like", likeTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

module.exports = router;
