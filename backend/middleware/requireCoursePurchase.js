// middleware/requireCoursePurchase.js
const Purchase = require('../models/Purchase');

module.exports = async function requireCoursePurchase(req, res, next) {
  try {
    const userId = req.user._id;         // set by your auth middleware
    const { courseSlug } = req.params;

    const has = await Purchase.exists({ userId, courseSlug, status: 'PAID' });
    if (!has) return res.status(403).json({ message: 'Course not purchased' });

    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
