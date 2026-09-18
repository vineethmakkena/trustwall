const mongoose = require("mongoose");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_REVIEW_LENGTH = 10;
const MAX_REVIEW_LENGTH = 2000;

const testimonialSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: [true, "Testimonial space is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
      match: [emailPattern, "Please provide a valid customer email address"],
    },
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be greater than 5"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      trim: true,
      minlength: [MIN_REVIEW_LENGTH, `Review must be at least ${MIN_REVIEW_LENGTH} characters`],
      maxlength: [MAX_REVIEW_LENGTH, `Review cannot exceed ${MAX_REVIEW_LENGTH} characters`],
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "pending",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returned) => {
        returned.id = returned._id;
        delete returned._id;
        delete returned.__v;
        return returned;
      },
    },
  }
);

testimonialSchema.index({ space: 1 });
testimonialSchema.index({ status: 1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
