const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to the User model
  videoKey: { type: String, required: true }, // S3 key of the video being watched
  timestamp: { type: Date, default: Date.now }, // When the view occurred
  durationViewed: { type: Number, default: 0 }, // Optional: seconds watched for billing
  status: { type: String, enum: ["pending", "billed"], default: "pending" } // Payment status
});

module.exports = mongoose.model("View", viewSchema);