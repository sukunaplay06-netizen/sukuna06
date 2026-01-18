// controller/userController.js
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a simple referral code synchronously
function generateSimpleReferralCode(name) {
  const namePart = (name || "user")
    .toLowerCase()
    .replace(/\s+/g, "")
    .slice(0, 3);
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${namePart}${randomDigits}`;
}

// ✅ Signup Controller
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, referredBy } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate unique referral code synchronously
    const myReferralCode = generateSimpleReferralCode(firstName);

    let referredByUserId = null;
    console.log("🔁 ReferredBy received from frontend:", referredBy);
    if (referredBy) {
      const referrer = await User.findOne({
        $or: [{ myReferralCode: referredBy }, { referralCode: referredBy }],
      });
      console.log(
        "✅ [REFERRAL_SIGNUP] Referral code valid. Referrer:",
        referrer?.email
      );

      if (referrer) {
        referredByUserId = referrer._id;
      } else {
        console.log("❌ Invalid referral code entered:", referredBy);
        return res
          .status(400)
          .json({ success: false, message: "Invalid referral code" });
      }
    }

    // Handle profile picture upload during signup (optional)
    let profilePicture = null;
    if (req.files?.profilePicture && req.files.profilePicture.length > 0) {
      const file = req.files.profilePicture[0];
      if (!file.path || !fs.existsSync(file.path)) {
        return res
          .status(500)
          .json({ message: "Uploaded file not found on server" });
      }
      console.log("Uploading file from path:", file.path); // Debug
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "users/profile-pictures",
          public_id: `${uuidv4()}_profile`,
          resource_type: "image",
        });
        profilePicture = uploadResult.secure_url;
      } catch (cloudError) {
        console.error(
          "❌ Cloudinary upload error in signup:",
          cloudError.message,
          cloudError.stack
        );
        return res.status(500).json({
          message: "Failed to upload profile picture to Cloudinary",
          error: cloudError.message,
        });
      }
    } else {
      // Optional: Set a default profile picture
      profilePicture = "https://via.placeholder.com/150";
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      referredBy: referredByUserId,
      myReferralCode,
      profilePicture,
    });

    await newUser.save();
    console.log("✅ New user created:", {
      id: newUser._id,
      email: newUser.email,
      myReferralCode: newUser.myReferralCode,
      referredBy: newUser.referredBy,
      profilePicture: newUser.profilePicture,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        referralCode: newUser.referralCode,
        affiliateId: newUser.affiliateId,
        profilePicture: newUser.profilePicture,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error in signup",
      error: error.message,
    });
  }
};
// Replace exports.updateProfile with this:
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let profilePicture = user.profilePicture;
    if (req.file) { // Changed from req.files?.profilePicture
      console.log("📂 File received:", req.file);

      if (!req.file.path || !fs.existsSync(req.file.path)) {
        return res.status(500).json({ message: "Uploaded file not found on server" });
      }
      if (!req.file.mimetype.startsWith("image/") || req.file.size > 5000000) {
        return res.status(400).json({ message: "Invalid file type or size exceeds 5MB" });
      }

      if (profilePicture) {
        const publicId = profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`users/profile-pictures/${publicId}`);
      }
      console.log("📤 Uploading file from path:", req.file.path);
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "users/profile-pictures",
          public_id: `${req.user._id}_profile`,
          resource_type: "image",
        });
        profilePicture = uploadResult.secure_url;
      } catch (cloudError) {
        console.error("❌ Cloudinary upload error in updateProfile:", cloudError.message, cloudError.stack);
        return res.status(500).json({ message: "Failed to upload profile picture to Cloudinary", error: cloudError.message });
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.profilePicture = profilePicture;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`users/profile-pictures/${publicId}`);
      user.profilePicture = null;
      await user.save();
    }

    res.json({ success: true, message: "Profile picture removed" });
  } catch (error) {
    console.error("❌ Remove profile picture error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id }).populate('course');
    const enrolledCourses = purchases.map(p => p.course);
    res.status(200).json({ enrolledCourses });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

const getUserReferrals = async (req, res) => {
  try {
    const referredPurchases = await Purchase.find({ referredBy: req.user._id }).populate('user');
    const referrals = referredPurchases.map(p => p.user);
    const user = await User.findById(req.user._id);
    const earnings = user.affiliateEarnings || 0;

    res.status(200).json({ referrals, earnings });
  } catch (err) {
    console.error('Error fetching referrals:', err);
    res.status(500).json({ message: 'Failed to fetch referral data' });
  }
};

module.exports = {
  signup,
  updateProfile,
  removeProfilePicture,
  getEnrolledCourses,
  getUserReferrals,
};