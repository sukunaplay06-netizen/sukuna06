// backend/models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // Basic Course Information
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, 
  affiliateCommission: { type: Number, required: true, default: 60, max: 100 },
  discount: { type: mongoose.Schema.Types.Decimal128, default: 0, min: 0, max: 100 },
  category: { type: String, default: "General" },
  slug: { type: String, required: true, unique: true },
  isDefault: { type: Boolean, default: false },

  // Enhanced Course Details
  isActive: { type: Boolean, default: true },
  instructor: { type: String, default: '' },
  instructorBio: { type: String, default: '' },
  duration: { type: String, default: '' },
  totalLessons: { type: Number, default: 0 },
  level: { type: String, default: 'Beginner' },
  thumbnail: { type: String, default: '' },

  // Course Features and Learning Outcomes
  features: [{ type: String }],
  whatYouLearn: [{ type: String }],
  prerequisites: [{ type: String }],

  // 👉 Add Videos Field Here
  videos: [
     {
    title: { type: String },
    description: { type: String, default: '' },
    url: { type: String },
    public_id: { type: String },
    duration: { type: String },
    freePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    module: { type: String, default: 'Module 1' }
  }
  ],

  // Course Metrics
  rating: { type: Number, default: 0, min: 0, max: 5 },
  studentsEnrolled: { type: Number, default: 0 },
  certificateProvided: { type: Boolean, default: true },
  supportIncluded: { type: Boolean, default: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

courseSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.discount) {
      ret.discount = ret.discount.toString(); 
    }
    return ret;
  }
});

module.exports = mongoose.model("Course", courseSchema);
