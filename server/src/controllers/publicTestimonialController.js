const fs = require("fs");
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");
const { validateImageSignature } = require("../middleware/uploadMiddleware");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getPublicSpace = (space) => ({
  id: space._id,
  slug: space.slug,
  name: space.name,
  description: space.description || null,
  brandName: space.brandName || null,
  logoUrl: space.logoUrl || null,
  primaryColor: space.primaryColor,
  welcomeTitle: space.welcomeTitle,
  welcomeMessage: space.welcomeMessage || null,
});

const getPublicSpaceBySlug = async (req, res) => {
  const space = await Space.findOne({
    slug: req.params.slug.toLowerCase(),
    status: "active",
  }).select("slug name description brandName logoUrl primaryColor welcomeTitle welcomeMessage");

  if (!space) {
    throw createHttpError(404, "This public space is not available");
  }

  res.status(200).json({
    success: true,
    message: "Public space retrieved successfully",
    data: getPublicSpace(space),
  });
};

const validateSubmission = ({ customerName, customerEmail, rating, review }) => {
  const normalizedName = getTrimmedString(customerName);
  const normalizedEmail = getTrimmedString(customerEmail);
  const normalizedReview = getTrimmedString(review);

  if (!normalizedName || !normalizedEmail || rating === undefined || !normalizedReview) {
    throw createHttpError(400, "Name, email, rating, and review are required");
  }

  if (!emailPattern.test(normalizedEmail)) {
    throw createHttpError(400, "Please provide a valid email address");
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw createHttpError(400, "Rating must be a whole number from 1 to 5");
  }

  return {
    customerName: normalizedName,
    customerEmail: normalizedEmail,
    rating: numericRating,
    review: normalizedReview,
  };
};

const submitTestimonial = async (req, res) => {
  try {
    const body = req.body || {};
    const sanitizedBody = validateSubmission(body);

    if (req.file) {
      await validateImageSignature(req.file);
    }

    const space = await Space.findOne({
      slug: req.params.slug.toLowerCase(),
      status: "active",
    }).select("_id");

    if (!space) {
      throw createHttpError(404, "This public space is not available");
    }

    const recentDuplicate = await Testimonial.exists({
      space: space._id,
      customerEmail: sanitizedBody.customerEmail.toLowerCase(),
      submittedAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    });
    if (recentDuplicate) {
      throw createHttpError(429, "A recent testimonial from this email is already awaiting review");
    }

    const protocol = req.get("x-forwarded-proto")?.split(",")[0] || req.protocol;
    const uploadedAvatarUrl = req.file
      ? `${protocol}://${req.get("host")}/uploads/${encodeURIComponent(req.file.filename)}`
      : undefined;

    const testimonial = await Testimonial.create({
      space: space._id,
      customerName: sanitizedBody.customerName,
      customerEmail: sanitizedBody.customerEmail.toLowerCase(),
      company: getTrimmedString(body.company),
      jobTitle: getTrimmedString(body.jobTitle),
      rating: sanitizedBody.rating,
      review: sanitizedBody.review,
      avatarUrl: uploadedAvatarUrl || getTrimmedString(body.avatarUrl),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Thank you for sharing your experience. Your testimonial is awaiting review.",
      data: {
        testimonialId: testimonial._id,
        status: testimonial.status,
      },
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    throw error;
  }

};

module.exports = {
  getPublicSpaceBySlug,
  submitTestimonial,
};
