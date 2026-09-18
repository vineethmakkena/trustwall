const mongoose = require("mongoose");
const Space = require("../models/Space");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, "Invalid space ID");
  }
};

const validateName = (name) => {
  if (typeof name !== "string" || !name.trim()) {
    throw createHttpError(400, "Space name is required");
  }

  if (name.trim().length > 120) {
    throw createHttpError(400, "Space name cannot exceed 120 characters");
  }
};

const getSpaceFields = (body) => ({
  name: body.name,
  slug: body.slug,
  description: body.description,
  brandName: body.brandName,
  logoUrl: body.logoUrl,
  primaryColor: body.primaryColor,
  welcomeTitle: body.welcomeTitle,
  welcomeMessage: body.welcomeMessage,
  status: body.status,
});

const createSpace = async (req, res) => {
  const body = req.body || {};
  validateName(body.name);

  const space = await Space.create({
    ...getSpaceFields(body),
    owner: req.user._id,
    name: body.name.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Space created successfully",
    data: space,
  });
};

const getSpaces = async (req, res) => {
  const spaces = await Space.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Spaces retrieved successfully",
    data: spaces,
  });
};

const getSpace = async (req, res) => {
  assertValidId(req.params.id);

  const space = await Space.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!space) {
    throw createHttpError(404, "Space not found");
  }

  res.status(200).json({
    success: true,
    message: "Space retrieved successfully",
    data: space,
  });
};

const updateSpace = async (req, res) => {
  assertValidId(req.params.id);

  const body = req.body || {};
  const space = await Space.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!space) {
    throw createHttpError(404, "Space not found");
  }

  if (body.name !== undefined) {
    validateName(body.name);
    space.name = body.name.trim();
    space.slug = undefined;
  }

  const fields = getSpaceFields(body);
  Object.keys(fields).forEach((field) => {
    if (field !== "name" && fields[field] !== undefined) {
      space[field] = fields[field];
    }
  });

  await space.save();

  res.status(200).json({
    success: true,
    message: "Space updated successfully",
    data: space,
  });
};

const deleteSpace = async (req, res) => {
  assertValidId(req.params.id);

  const space = await Space.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!space) {
    throw createHttpError(404, "Space not found");
  }

  res.status(200).json({
    success: true,
    message: "Space deleted successfully",
    data: { id: space._id },
  });
};

module.exports = {
  createSpace,
  getSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
};
