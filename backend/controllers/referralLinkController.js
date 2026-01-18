// backend/controllers/referralLinkController.js
const User = require("../models/User");
const Referral = require("../models/Referral");

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

// GET /referral/metrics
exports.getReferralMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🔍 Incoming request to /referral/metrics for User ID:", userId);

    // 🔹 Fetch referrals
    const referrals = await Referral.find({ referredBy: userId });
    console.log("📄 Referrals found:", referrals.length);

    // 🔹 Time ranges
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    

    // 🔹 All Time Earnings
    const allTimeEarnings = referrals.reduce((sum, r) => sum + r.commissionEarned, 0);
    console.log("💰 All Time Earnings:", allTimeEarnings);

    // 🔹 Today's Earnings
    const todayEarnings = referrals
      .filter((r) => r.createdAt >= startOfToday)
      .reduce((sum, r) => sum + r.commissionEarned, 0);
    console.log("📅 Today's Earnings:", todayEarnings);

    // 🔹 Last 7 Days Earnings
    const last7DaysEarnings = referrals
      .filter((r) => r.createdAt >= last7Days)
      .reduce((sum, r) => sum + r.commissionEarned, 0);
    console.log("🗓 Last 7 Days Earnings:", last7DaysEarnings);

    // 🔹 Last 30 Days Earnings
    const last30DaysEarnings = referrals
      .filter((r) => r.createdAt >= last30Days)
      .reduce((sum, r) => sum + r.commissionEarned, 0);
    console.log("📆 Last 30 Days Earnings:", last30DaysEarnings);

    // 🔹 User info
    const user = await User.findById(userId);
    const totalReferrals = await User.countDocuments({ referredBy: userId });
    console.log("🔢 Total Referred Users:", totalReferrals);

    const activeReferrals = await Referral.distinct("referredUser", { referredBy: userId });
    const totalActiveReferrals = activeReferrals.length;
    console.log("✅ Active Referred Users:", totalActiveReferrals);

    const commissionPaid = user.commissionPaid || 0;
    const accountBalance = (user.affiliateEarnings || 0) - commissionPaid;
    console.log("💼 Commission Paid:", commissionPaid);
    console.log("💳 Account Balance:", accountBalance);

    // 🔹 Response
    res.status(200).json({
      success: true,
      allTimeEarnings,
      todayEarnings,
      last7DaysEarnings,
      last30DaysEarnings,
      accountBalance,
      totalReferrals,
      totalActiveReferrals,
      commissionPaid,
    });

    console.log("✅ Metrics response sent for user:", user.email);
  } catch (error) {
    console.error("❌ Error fetching referral metrics:", error);
    res.status(500).json({ success: false, message: "Failed to get referral metrics" });
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
    }); // 🔢 Add before Line 90

    const baseUrl = process.env.FRONTEND_URL || "[invalid url, do not cite]";
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
      // Allow purchase without referral code
      req.referrer = null;
      return next();
    }

    const referrer = await User.findOne({
      $or: [{ affiliateId: affiliateId }, { referralCode: affiliateId }],
    });

    if (!referrer) {
      console.log("🆔 Validating Referral Code:", affiliateId);
      // Allow purchase with invalid referral code (no commission)
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

exports.getReferralDownline = async (req, res) => {
  try {
    const userId = req.user._id;
    const referredUsers = await User.find({ referredBy: userId }).select('name email phone plan status createdAt');

    if (!referredUsers) {
      return res.status(200).json({ success: true, data: [] });
    }

    const downline = referredUsers.map(user => ({
      _id: user._id,
      name: user.name || 'N/A',
      email: user.email,
      mobile: user.mobile || 'N/A',
      plan: user.plan || 'No Plan',
      status: user.isActive ? 'Active' : 'Pending',
      createdAt: user.createdAt,
    }));

    res.status(200).json({ success: true, data: downline });
  } catch (error) {
    console.error('Error fetching referral downline:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};