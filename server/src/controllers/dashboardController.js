const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");

const getDashboardOverview = async (req, res) => {
  const spaces = await Space.find({ owner: req.user._id }).select("_id").lean();
  const spaceIds = spaces.map((space) => space._id);

  const [result] = await Testimonial.aggregate([
    { $match: { space: { $in: spaceIds } } },
    {
      $facet: {
        moderation: [
          {
            $group: {
              _id: null,
              totalTestimonials: { $sum: 1 },
              pendingTestimonials: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
              approvedTestimonials: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
              rejectedTestimonials: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
            },
          },
        ],
        approvedSummary: [
          { $match: { status: "approved" } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              featuredTestimonials: { $sum: { $cond: ["$isFeatured", 1, 0] } },
            },
          },
        ],
        ratingDistribution: [
          { $match: { status: "approved" } },
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        recentTestimonials: [
          { $sort: { submittedAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 0,
              id: { $toString: "$_id" },
              customerName: 1,
              company: 1,
              rating: 1,
              review: 1,
              status: 1,
              submittedAt: 1,
            },
          },
        ],
      },
    },
  ]);

  const moderation = result?.moderation?.[0] || {};
  const approvedSummary = result?.approvedSummary?.[0] || {};
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  (result?.ratingDistribution || []).forEach(({ _id, count }) => {
    ratingDistribution[_id] = count;
  });

  res.status(200).json({
    success: true,
    message: "Dashboard overview retrieved successfully",
    data: {
      totalSpaces: spaces.length,
      totalTestimonials: moderation.totalTestimonials || 0,
      pendingTestimonials: moderation.pendingTestimonials || 0,
      approvedTestimonials: moderation.approvedTestimonials || 0,
      rejectedTestimonials: moderation.rejectedTestimonials || 0,
      averageRating: Number((approvedSummary.averageRating || 0).toFixed(2)),
      featuredTestimonials: approvedSummary.featuredTestimonials || 0,
      ratingDistribution,
      recentTestimonials: result?.recentTestimonials || [],
    },
  });
};

module.exports = {
  getDashboardOverview,
};
