// middleware/referrerCaptureMiddleware.js
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const referralCode = req.body.ref || req.body.referralCode || req.query.ref || req.query.referralCode;
console.log("✅ Referral code received:", referralCode);

if (referralCode) {
  // Use correct field: 'referralCode' or 'affiliateId' depending on your DB schema
  const referrerUser = await User.findOne({ referralCode: referralCode });
  if (referrerUser) {
    console.log("✅ Referrer user found:", referrerUser.email);
    req.referrer = referrerUser._id;
  } else {
    console.log("⚠️ No user found with referral code:", referralCode);
  }
}
    next();
  } catch (error) {
    console.error("❌ Error in referrerCaptureMiddleware:", error);
    next();
  }
};
