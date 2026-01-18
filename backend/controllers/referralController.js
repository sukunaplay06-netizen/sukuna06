// backend/controllers/referralController.js
const Referral = require("../models/Referral");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Commission = require("../models/Commission");

// Track referral link clicks
exports.trackReferralClick = async (req, res) => {
  try {
    const { affiliateId, linkType, utm_source, utm_medium, utm_campaign } =
      req.body;

    console.log("🔗 Referral link clicked:", {
      affiliateId,
      linkType,
      utm_source,
      utm_medium,
      utm_campaign,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    const referrer = await User.findOne({ affiliateId });
    if (!referrer) {
      return res
        .status(404)
        .json({ success: false, message: "Referrer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Referral click tracked",
      referrer: {
        name: `${referrer.firstName} ${referrer.lastName}`,
        email: referrer.email,
      },
    });
  } catch (error) {
    console.error("❌ Error tracking referral click:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to track referral click" });
  }
};

// Get referral link analytics
exports.getReferralAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("📊 Referral Analytics Final Data:", {
      affiliateId: user.affiliateId,
      referralCode: user.referralCode,
      totalEarnings: user.affiliateEarnings || 0,
      totalReferrals: user.referralHistory?.length || 0,
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000"; // Default for testing
    const referralCode = user.referralCode;

    const referralLinks = {
      signup: `${baseUrl}/auth/signup?ref=${referralCode}&utm_source=referral&utm_medium=link&utm_campaign=signup`,
      courses: `${baseUrl}/courses?ref=${referralCode}&utm_source=referral&utm_medium=link&utm_campaign=courses`,
      direct: `${baseUrl}?ref=${referralCode}&utm_source=referral&utm_medium=direct&utm_campaign=homepage`,
    };

    console.log("🔗 Generated referral links for:", user.email);

    res.status(200).json({
      success: true,
      data: {
        affiliateId: user.affiliateId,
        referralCode: user.referralCode,
        links: referralLinks,
        totalEarnings: user.affiliateEarnings || 0,
        totalReferrals: user.referralHistory?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Error getting referral analytics:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get referral analytics" });
  }
};

// Validate referral code as middleware
exports.validateReferralCode = async (req, res, next) => {
  try {
    const { affiliateId } = req.body;

    if (!affiliateId) {
      req.referrer = null;
      return next();
    }

    const referrer = await User.findOne({
      $or: [{ affiliateId: affiliateId }, { referralCode: affiliateId }],
    });

    if (!referrer) {
      console.log("🆔 Validating Referral Code:", affiliateId);
      req.referrer = null;
      return next();
    }

    console.log(
      "✅ Valid referral code:",
      affiliateId,
      "for user:",
      referrer.email
    );
    req.referrer = referrer._id;
    next();
  } catch (error) {
    console.error("❌ Error validating referral code:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to validate referral code" });
  }
};

// Updated getReferralDownline (Main Addition - Signup + Purchase combine)
exports.getReferralDownline = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch signup-referred users
    const signupReferredUsers = await User.find({ referredBy: userId }).select(
      "firstName lastName email mobile isActive createdAt enrolledCourses"
    );

    // Fetch purchase-referred users (distinct to avoid dupes)
    const purchaseReferredUserIds = await Purchase.distinct("user", {
      affiliate: userId,
    });

    // Combine unique user IDs
    const allReferredUserIds = [
      ...signupReferredUsers.map((u) => u._id.toString()),
      ...purchaseReferredUserIds.map((id) => id.toString()),
    ];
    const uniqueUserIds = [...new Set(allReferredUserIds)];

    // Fetch full details for unique users
    const allUsers = await User.find({ _id: { $in: uniqueUserIds } })
      .select(
        "firstName lastName email mobile isActive createdAt enrolledCourses"
      )
      .sort({ createdAt: -1 });

    if (allUsers.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const downline = allUsers.map((user) => ({
      _id: user._id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
      email: user.email || "N/A",
      mobile: user.mobile || "N/A",
      course:
        user.enrolledCourses.length > 0
          ? { name: user.enrolledCourses[0].courseName } // First course as Plan
          : null, // No Plan for signup-only
      status:
        user.isActive && (user.enrolledCourses.length > 0 || user.hasPurchased)
          ? "Active"
          : "Pending",
      createdAt: user.createdAt,
    }));

    res.status(200).json({ success: true, data: downline });
  } catch (error) {
    console.error("Error fetching referral downline:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getReferralMetrics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("❌ User not found with ID:", req.user._id);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("👤 User found:", user.email);

    const referredUsers = await User.find({ referredBy: user._id });

    // const activeReferrals = referredUsers.filter((u) => u.hasPurchased);
    const activeReferrals = referredUsers.filter(
      (u) =>
        (u.enrolledCourses && u.enrolledCourses.length > 0) ||
        u.hasPurchased ||
        false
    );

    // ✅ Step 1: Date ranges FIRST
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // Step 2: Helper function only ONCE
    const calcEarnings = (purchases) =>
      purchases.reduce((total, purchase) => {
        if (!purchase.course) return total;
        const commissionRate =
          purchase.course.affiliateCommission ??
          parseFloat(process.env.COMMISSION_RATE) ??
          60;

        // ✅ Ensure price is always a number
        const price = Number(purchase.course.price) || 0;

        const commission = Math.floor((price * commissionRate) / 100);

        console.log(
          `💰 Commission for course "${purchase.course.title}": ₹${commission}`
        );
        return total + commission;
      }, 0);

    // Step 3: Fetch purchases
    const purchases = await Purchase.find({ affiliate: user._id }).populate(
      "course"
    );

    const todayPurchases = purchases.filter(
      (p) => new Date(p.createdAt) >= startOfToday
    );
    const purchases7Days = purchases.filter(
      (p) => new Date(p.createdAt) >= last7Days
    );
    const purchases30Days = purchases.filter(
      (p) => new Date(p.createdAt) >= last30Days
    );

    // Correct usage of purchases instead of allPurchases
    const allTimeEarningsFromPurchases = calcEarnings(purchases);

    const referrals = await Referral.find({ referredBy: user._id });
    // Filter referrals by date range
    const todayReferrals = referrals.filter(
      (r) => new Date(r.createdAt) >= startOfToday
    );
    const last7Referrals = referrals.filter(
      (r) => new Date(r.createdAt) >= last7Days
    );
    const last30Referrals = referrals.filter(
      (r) => new Date(r.createdAt) >= last30Days
    );

    // Calculate total commission from a referral list
    const calcReferralEarnings = (refList) =>
      refList.reduce((sum, r) => sum + (r.commissionEarned || 0), 0);

    const allTimeEarningsFromReferrals = referrals.reduce(
      (sum, r) => sum + (r.commissionEarned || 0),
      0
    );
    const todayReferralEarnings = calcReferralEarnings(todayReferrals);
    const last7ReferralEarnings = calcReferralEarnings(last7Referrals);
    const last30ReferralEarnings = calcReferralEarnings(last30Referrals);
    const allTimeEarnings =
      allTimeEarningsFromPurchases + allTimeEarningsFromReferrals;

    const todayEarnings = calcEarnings(todayPurchases) + todayReferralEarnings;

    const last7DaysEarnings =
      calcEarnings(purchases7Days) + last7ReferralEarnings;

    const last30DaysEarnings =
      calcEarnings(purchases30Days) + last30ReferralEarnings;

    console.log(
      `🧾 Earnings: AllTime: ₹${allTimeEarnings}, Today: ₹${todayEarnings}, Last 7 Days: ₹${last7DaysEarnings}, Last 30 Days: ₹${last30DaysEarnings}`
    );

    // 📊 Final response
    const metrics = {
      success: true,
      affiliateId: user.affiliateId,
      referralCode: user.referralCode,

      status: user.isActive ? "active" : "pending",

      // From Purchases
      allTimeEarnings,
      todayEarnings,
      last7DaysEarnings,
      last30DaysEarnings,
      accountBalance: user.affiliateEarnings || allTimeEarnings,
      commissionPaid: 0,
      totalCommission: allTimeEarnings,
      totalReferrals: referredUsers.length,
      totalActiveReferrals: activeReferrals.length,

      // From Referrals
      allTimeEarningsFromReferrals,
      todayReferralEarnings,
      last7ReferralEarnings,
      last30ReferralEarnings,
    };

    console.log(`✅ Final metrics for ${user.email}:`);

    res.json(metrics);
  } catch (error) {
    console.error("❌ Error in getReferralMetrics:", error);
    res.status(500).json({
      success: false,
      message: "Server error in referral metrics",
      error: error.message,
    });
  }
};
