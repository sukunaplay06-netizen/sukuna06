const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  commissionEarned: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
}, { timestamps: true });
referralSchema.index({ referredBy: 1, referredUser: 1, course: 1 }, { unique: true });
referralSchema.index({ referredBy: 1 });
referralSchema.index({ referredUser: 1 });

module.exports = mongoose.model('Referral', referralSchema);
