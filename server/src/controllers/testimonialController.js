const mongoose = require("mongoose");
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");

const allowedStatuses = ["pending", "approved", "rejected", "archived"];

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const assertValidId = (id, label) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, `Invalid ${label} ID`);
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (query) => {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 20;

  if (page < 1 || limit < 1 || limit > 100) {
    throw createHttpError(400, "Page must be at least 1 and limit must be between 1 and 100");
  }

  return { page, limit, skip: (page - 1) * limit };
};

const serializeTestimonial = (testimonial) => {
  const value = testimonial.toObject ? testimonial.toObject() : testimonial;

  return {
    id: value._id,
    space: value.space,
    customerName: value.customerName,
    company: value.company || null,
    jobTitle: value.jobTitle || null,
    rating: value.rating,
    review: value.review,
    avatarUrl: value.avatarUrl || null,
    status: value.status,
    isFeatured: value.isFeatured,
    isLiked: value.isLiked,
    submittedAt: value.submittedAt,
    approvedAt: value.approvedAt || null,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
};

const getOwnedSpace = async (spaceId, userId) => {
  assertValidId(spaceId, "space");

  const space = await Space.findById(spaceId).select("_id owner");
  if (!space) {
    throw createHttpError(404, "Space not found");
  }

  if (String(space.owner) !== String(userId)) {
    throw createHttpError(403, "You are not authorized to access this space");
  }

  return space;
};

const getOwnedTestimonial = async (testimonialId, userId) => {
  assertValidId(testimonialId, "testimonial");

  const testimonial = await Testimonial.findById(testimonialId).select("-customerEmail -__v");
  if (!testimonial) {
    throw createHttpError(404, "Testimonial not found");
  }

  await getOwnedSpace(testimonial.space, userId);
  return testimonial;
};

const getTestimonials = async (req, res) => {
  const space = await getOwnedSpace(req.params.spaceId, req.user._id);
  const { page, limit, skip } = parsePagination(req.query);
  const status = req.query.status || "all";
  const search = req.query.search?.trim();

  if (status !== "all" && !allowedStatuses.includes(status)) {
    throw createHttpError(400, "Invalid testimonial status filter");
  }

  const filter = { space: space._id };
  if (status !== "all") filter.status = status;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { customerName: pattern },
      { company: pattern },
      { review: pattern },
    ];
  }

  const [testimonials, total] = await Promise.all([
    Testimonial.find(filter)
      .select("-customerEmail -__v")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit),
    Testimonial.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Testimonials retrieved successfully",
    data: {
      testimonials: testimonials.map(serializeTestimonial),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

const getTestimonial = async (req, res) => {
  const testimonial = await getOwnedTestimonial(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "Testimonial retrieved successfully",
    data: serializeTestimonial(testimonial),
  });
};

const updateStatus = async (req, res, status, message) => {
  const testimonial = await getOwnedTestimonial(req.params.id, req.user._id);
  testimonial.status = status;
  if (status === "approved") testimonial.approvedAt = new Date();
  await testimonial.save();

  res.status(200).json({
    success: true,
    message,
    data: serializeTestimonial(testimonial),
  });
};

const approveTestimonial = (req, res) => updateStatus(req, res, "approved", "Testimonial approved successfully");
const rejectTestimonial = (req, res) => updateStatus(req, res, "rejected", "Testimonial rejected successfully");
const archiveTestimonial = (req, res) => updateStatus(req, res, "archived", "Testimonial archived successfully");

const updateBoolean = async (req, res, field, message) => {
  const value = req.body?.[field];
  if (typeof value !== "boolean") {
    throw createHttpError(400, `${field} must be a boolean`);
  }

  const testimonial = await getOwnedTestimonial(req.params.id, req.user._id);
  testimonial[field] = value;
  await testimonial.save();

  res.status(200).json({
    success: true,
    message,
    data: serializeTestimonial(testimonial),
  });
};

const featureTestimonial = (req, res) => updateBoolean(req, res, "isFeatured", "Testimonial feature status updated successfully");
const likeTestimonial = (req, res) => updateBoolean(req, res, "isLiked", "Testimonial like status updated successfully");

const deleteTestimonial = async (req, res) => {
  const testimonial = await getOwnedTestimonial(req.params.id, req.user._id);
  await testimonial.deleteOne();

  res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
    data: { id: testimonial._id },
  });
};

module.exports = {
  getTestimonials,
  getTestimonial,
  approveTestimonial,
  rejectTestimonial,
  archiveTestimonial,
  featureTestimonial,
  likeTestimonial,
  deleteTestimonial,
};
