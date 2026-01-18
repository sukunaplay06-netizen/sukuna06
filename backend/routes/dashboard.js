// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const Purchase = require("../models/Purchase");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware is used
    // Use referredBy instead of referrer
    const referrals = await Referral.find({ referredBy: userId });
    const purchases = await Purchase.find({ referredBy: userId });
    console.log("User ID:", userId);

    // Counts
    const referralsCount = referrals.length;
    const purchasesCount = purchases.length;

    // Total commission
    const totalCommission =
      referrals.reduce((sum, r) => sum + (r.commissionEarned || 0), 0) +
      purchases.reduce((sum, p) => sum + (p.commissionEarned || 0), 0);

    // Date filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    // Helper to filter and sum
    const calcSum = (arr, date) =>
      arr
        .filter((item) => item.createdAt >= date)
        .reduce((sum, r) => sum + (r.commissionEarned || 0), 0);

    const todayCommission = calcSum(referrals, today) + calcSum(purchases, today);
    const last7DaysCommission = calcSum(referrals, last7Days) + calcSum(purchases, last7Days);
    const last30DaysCommission = calcSum(referrals, last30Days) + calcSum(purchases, last30Days);

    res.json({
      success: true,
      data: {
        totalReferrals: referralsCount,
        totalPurchases: purchasesCount,
        totalCommission: totalCommission,
        todayEarnings: todayCommission,
        last7DaysEarnings: last7DaysCommission,
        last30DaysEarnings: last30DaysCommission,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;