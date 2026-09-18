const mongoose = require("mongoose");
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getPublicSpace = (space) => ({
  id: String(space._id),
  slug: space.slug,
  name: space.name,
  description: space.description || null,
  brandName: space.brandName || null,
  logoUrl: space.logoUrl || null,
  primaryColor: space.primaryColor,
  welcomeTitle: space.welcomeTitle,
  welcomeMessage: space.welcomeMessage || null,
});

const getSort = (sort) => {
  if (!sort || sort === "newest") return { submittedAt: -1 };
  if (sort === "highest") return { rating: -1, submittedAt: -1 };

  throw createHttpError(400, "Sort must be newest or highest");
};

const getRatingFilter = (rating) => {
  if (rating === undefined) return null;

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw createHttpError(400, "Rating must be a whole number from 1 to 5");
  }

  return numericRating;
};

const getPublicWall = async (req, res) => {
  const space = await Space.findOne({
    slug: req.params.slug.toLowerCase(),
    status: "active",
  })
    .select("slug name description brandName logoUrl primaryColor welcomeTitle welcomeMessage")
    .lean();

  if (!space) {
    throw createHttpError(404, "This public space is not available");
  }

  const rating = getRatingFilter(req.query.rating);
  const sort = getSort(req.query.sort);
  const reviewMatch = {};

  if (req.query.featured === "true") reviewMatch.isFeatured = true;
  if (rating !== null) reviewMatch.rating = rating;

  const [result] = await Testimonial.aggregate([
    {
      $match: {
        space: new mongoose.Types.ObjectId(space._id),
        status: "approved",
      },
    },
    {
      $facet: {
        testimonials: [
          { $match: reviewMatch },
          { $sort: sort },
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              customerName: 1,
              company: 1,
              jobTitle: 1,
              rating: 1,
              review: 1,
              avatarUrl: 1,
              isFeatured: 1,
              submittedAt: 1,
            },
          },
        ],
        statistics: [
          {
            $group: {
              _id: null,
              totalApprovedReviews: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ],
        ratingDistribution: [
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const statisticsResult = result.statistics[0] || { totalApprovedReviews: 0, averageRating: 0 };
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result.ratingDistribution.forEach(({ _id, count }) => {
    ratingDistribution[_id] = count;
  });

  res.status(200).json({
    success: true,
    message: "Public Wall of Love retrieved successfully",
    data: {
      space: getPublicSpace(space),
      testimonials: result.testimonials,
      statistics: {
        totalApprovedReviews: statisticsResult.totalApprovedReviews,
        averageRating: Number((statisticsResult.averageRating || 0).toFixed(2)),
        ratingDistribution,
      },
    },
  });
};

module.exports = {
  getPublicWall,
};
