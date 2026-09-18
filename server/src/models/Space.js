const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/generateSlug");

const urlSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const spaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Space owner is required"],
    },
    name: {
      type: String,
      required: [true, "Space name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Space slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [urlSlugPattern, "Slug must contain only lowercase letters, numbers, and hyphens"],
    },
    description: {
      type: String,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: "#7c3aed",
      trim: true,
    },
    welcomeTitle: {
      type: String,
      default: "Share your experience",
      trim: true,
    },
    welcomeMessage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

spaceSchema.index({ owner: 1 });

spaceSchema.pre("validate", async function generateSlug() {
  if (this.isNew || this.isModified("name") || this.isModified("slug")) {
    this.slug = await generateUniqueSlug(this.constructor, this.slug || this.name, this.isNew ? undefined : this._id);
  }
});

module.exports = mongoose.model("Space", spaceSchema);
