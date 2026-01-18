// ✅ Corrected imports (match actual model files)
const User = require('../models/User');
const Referral = require('../models/Referral');



const referralMiddleware = async (req, res, next) => {
  try {
    if (req.referrer && req.body.courseId) {
      const referrer = await User.findById(req.referrer);
      if (!referrer) return res.status(404).json({ message: 'Referrer not found' });
     // ✅ Prevent duplicate referral for same user and course
      const existingReferral = await Referral.findOne({
        referredUser: req.user._id,
        course: req.body.courseId,
      });

      if (existingReferral) return next(); // Already tracked

      const referral = new Referral({
        referredBy: req.referrer,
        referredUser: req.user._id,
        course: req.body.courseId,
        commissionEarned: 0 // To be updated by purchaseController
      });
      await referral.save();
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = referralMiddleware;