const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    razorpay_order_id: { type: String, required: true, index: true },
    razorpay_payment_id: { type: String, required: true, index: true },
    razorpay_signature: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    affiliateId: { type: String, index: true },
    affiliate: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    commissionEarned: { type: Number, default: 0, min: 0 },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
