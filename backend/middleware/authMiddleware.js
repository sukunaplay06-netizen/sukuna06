// backend/middleware/authMiddleware.js :
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const Purchase = require("../models/Purchase");



exports.protect = async (req, res, next) => {
  console.time("protectMiddleware");
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔍 [authMiddleware.js] Token received:", {
        token: !!token,
        timestamp: new Date().toISOString(),
      });
    }

    if (!token) {
      console.log("🚫 [authMiddleware.js] No token provided", {
        timestamp: new Date().toISOString(),
      });
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    console.time("jwtVerify");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.timeEnd("jwtVerify");

    console.log("✅ [authMiddleware.js] JWT decoded:", {
      timestamp: new Date().toISOString(),
    });

    const user = await User.findById(decoded.id).select(
      "firstName email affiliateId profilePicture isAdmin referralCode"
    );

    if (!user) {
      console.log("🚫 [authMiddleware.js] User not found:", {
        userId: decoded.id,
        timestamp: new Date().toISOString(),
      });
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.user.id = decoded.id;

    console.log("✅ [authMiddleware.js] User fetched:", {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      affiliateId: user.affiliateId,
      timestamp: new Date().toISOString(),
    });

    next();
  } catch (error) {
    console.error("❌ [authMiddleware.js] Authentication error:", {
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
  } finally {
    console.timeEnd("protectMiddleware"); 
  }
};


exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

// New: Validate profile picture upload
exports.validateProfilePicture = (req, res, next) => {
  if (!req.files || !req.files.profilePicture) {
    return res.status(400).json({
      success: false,
      message: "No profile picture file uploaded",
    });
  }
  if (req.files.profilePicture.length > 1) {
    return res.status(400).json({
      success: false,
      message: "Only one profile picture is allowed",
    });
  }
  const file = req.files.profilePicture[0];
  if (!file.mimetype.startsWith("image/") || file.size > 5000000) {
    // 5MB limit
    return res.status(400).json({
      success: false,
      message: "Invalid file type or size exceeds 5MB",
    });
  }
  next();
};

// Validate thumbnail upload
exports.validateThumbnail = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No thumbnail file uploaded",
    });
  }
  if (!req.file.mimetype.startsWith("image/") || req.file.size > 5000000) {
    // 5MB limit
    return res.status(400).json({
      success: false,
      message: "Invalid file type or size exceeds 5MB",
    });
  }
  next();
};

// Optional: Rate limiting for admin actions
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});



// FIX: Check enrolled courses (skip for admins)
exports.checkEnrolledCourses = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {  // ← New: Skip for admins
      console.log('FIX SKIP: [authMiddleware] Admin enrolled check skipped for:', req.user.email);  // ← Debug log
      return next();
    }
    const purchaseCount = await Purchase.countDocuments({ user: req.user._id });
    if (purchaseCount === 0) {
      console.log("🚫 [authMiddleware.js] No enrolled courses for user:", {
        userId: req.user._id,
        timestamp: new Date().toISOString(),
      });
      return res.status(403).json({
        success: false,
        message: "No enrolled courses. Access denied to dashboard features.",
      });
    }
    console.log("✅ [authMiddleware.js] User has enrolled courses:", {
      userId: req.user._id,
      count: purchaseCount,
      timestamp: new Date().toISOString(),
    });
    next();
  } catch (err) {
    console.error("❌ [authMiddleware.js] Error checking enrolled courses:", {
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return res.status(500).json({
      success: false,
      message: "Server error while checking enrolled courses.",
    });
  }
};

exports.adminRateLimit = adminRateLimit;
