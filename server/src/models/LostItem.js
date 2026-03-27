import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    foundLocation: {
      type: String,
      required: true,
      trim: true,
    },
    collectLocation: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    imageFilename: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "collected", "archived"],
      default: "active",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collectedAt: {
      type: Date,
    },
    archivedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// indexes for faster queries
lostItemSchema.index({ status: 1 });
lostItemSchema.index({ uploadedBy: 1 });

export default mongoose.model("LostItem", lostItemSchema);