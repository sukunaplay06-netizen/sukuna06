const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getReferralMetrics } = require("../controllers/referralController");
const {
  trackReferralClick,
  getReferralAnalytics,
  validateReferralCode,
} = require("../controllers/referralLinkController");
const Commission = require("../models/Commission");
const User = require("../models/User");
const Referral = require("../models/Referral");
const Purchase = require("../models/Purchase"); 

// In referral.js
router.get("/metrics", protect, async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return getReferralMetrics(req, res);
});



// GET /api/referral/downline
router.get("/downline", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const referredUsers = await User.find({
      referredBy: user._id, 
    }).select(
      "firstName lastName email mobile createdAt activatedAt isActive"  
    );
    const downlineData = [];
    for (const refUser of referredUsers) {
      const latestPurchase = await Purchase.findOne({ 
        user: refUser._id 
      })
        .sort({ createdAt: -1 })  
        .populate('course', 'name'); 

      downlineData.push({
        _id: refUser._id,
        name: `${refUser.firstName} ${refUser.lastName}`,
        email: refUser.email,
        mobile: refUser.mobile || "N/A",        
        course: latestPurchase?.course || null, 
        createdAt: refUser.createdAt,
        activatedAt: refUser.activatedAt,
        isActive: refUser.isActive,
        status: refUser.activatedAt || refUser.isActive ? "Active" : "Pending",
      });
    }

    res.json({ success: true, data: downlineData, total: downlineData.length });
  } catch (error) {
    console.error("❌ Error fetching referral downline:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching referral downline",
    });
  }
});



// In referral.js
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log("👤 Referral Route: Logged-in user:", user?.email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const referrals = await Purchase.find({
      referredBy: req.user._id,
    }).populate("user course");

    console.log(
      `🔎 Found ${referrals.length} referrals for user ${req.user.email}`
    );

    const mappedReferrals = referrals.map((r) => ({
      referredUser: {
        name: r.user
          ? `${r.user.firstName} ${r.user.lastName || ""}`.trim()
          : "N/A",
        email: r.user?.email || "N/A",
      },
      course: r.course?.name || "N/A",
      commissionEarned: r.commissionEarned || 0,
    }));

    res.json({
      referralCode: user.referralCode,
      referrals: mappedReferrals,
      earnings: user.affiliateEarnings || 0,
    });
  } catch (err) {
    console.error("Error fetching referral details:", err.message);
    res
      .status(500)
      .json({ message: "Server error while fetching referral details" });
  }
});

// POST /api/referral/track-click
router.post("/track-click", trackReferralClick);

// GET /api/referral/analytics
router.get("/analytics", protect, getReferralAnalytics);

// GET /api/referral/validate
router.get("/validate", validateReferralCode);

// GET /api/referral/debug - Debug endpoint to check referral data
router.get("/debug", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    console.log("👤 Logged-in user:", {
      id: user._id,
      email: user.email,
      referralCode: user.referralCode,
      affiliateId: user.affiliateId,
      affiliateEarnings: user.affiliateEarnings,
    });
    const referrals = await Referral.find({
      referredBy: req.user._id,
    }).populate("user course");

    const purchases = await Purchase.find({
      referredBy: req.user._id,
    }).populate("user course");
    const referredUsers = await User.find({ referredBy: req.user._id });
    console.log("📊 Referral count:", referrals.length);
    console.log("🛒 Purchase count:", purchases.length);
    console.log("👥 Referred user count:", referredUsers.length);

    // 🔁 Loop through referrals and log each one
    referrals.forEach((r, i) => {
      console.log(`➡️ Referral #${i + 1}:`, {
        id: r._id,
        referredUser: r.referredUser?.email || "N/A",
        course: r.coursePurchased?.name || "N/A",
        commissionEarned: r.commissionEarned,
        status: r.status,
      });
    });

    console.log("💸 Total commission earned:", totalCommission);

    const debugData = {
      user: {
        id: user._id,
        email: user.email,
        referralCode: user.referralCode,
        affiliateId: user.affiliateId,
        affiliateEarnings: user.affiliateEarnings,
        referralHistory: user.referralHistory,
        isActive: user.isActive,
        activatedAt: user.activatedAt,
      },
      referrals: referrals.map((r) => ({
        id: r._id,
        referredUser: r.referredUser?.email || "N/A",
        course: r.coursePurchased?.name || "N/A",
        commissionEarned: r.commissionEarned,
        status: r.status,
        createdAt: r.createdAt,
      })),
      purchases: purchases.map((p) => ({
        id: p._id,
        user: p.user?.email || "N/A",
        course: p.course?.name || "N/A",
        commissionEarned: p.commissionEarned,
        status: p.status,
        createdAt: p.createdAt,
      })),
      referredUsers: referredUsers.map((u) => ({
        id: u._id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        createdAt: u.createdAt,
      })),
      counts: {
        referrals: referrals.length,
        purchases: purchases.length,
        referredUsers: referredUsers.length,
        totalCommission:
          referrals.reduce((sum, r) => sum + (r.commissionEarned || 0), 0) +
          purchases.reduce((sum, p) => sum + (p.commissionEarned || 0), 0),
      },
    };
    console.log("🐞 Debug data generated:", debugData); 
    res.json({ success: true, data: debugData });
  } catch (error) {
    console.error("❌ Debug endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in debug endpoint",
      error: error.message,
    });
  }
});

// POST /api/referral/auto-refresh
router.post("/auto-refresh", protect, async (req, res) => {
  try {
    console.log("🔄 Auto-refresh triggered by user:", req.user.email);
    res.status(200).json({
      success: true,
      message: "Auto-refresh initiated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Auto-refresh endpoint error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to initiate auto-refresh" });
  }
});
// backend/routes/referral.js
router.get("/commissions", protect, async (req, res) => {
  try {
    const commissions = await Commission.find({
      user: req.user._id, 
    }).sort({ createdAt: -1 });
    const totalCommission = commissions.reduce(
      (sum, c) => sum + (c.amount || 0), 
      0
    );
    console.log("💸 Total commission earned:", totalCommission);
    res.json({ success: true, commissions, totalCommission });
  } catch (err) {
    console.error("❌ Error fetching commissions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Referral API is working" });
});

module.exports = router;
