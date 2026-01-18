// backend/controllers/purchaseController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const Referral = require("../models/Referral");
const Commission = require("../models/Commission");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");  

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/purchase/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_order_" + Math.random(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// POST /api/purchase/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount,
    } = req.body;

    const userId = req.user._id;

    console.log("🧾 Payment Verification Request:");
    console.log(`🛒 NEW PURCHASE PROCESSING:`);
    console.log(`   - User: ${userId}`);
    console.log(`   - Course: ${courseId}`);
    console.log(`   - Amount: ₹${amount}`);

    // Step 1: Signature validation
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Prevent duplicate purchase
    const alreadyPurchased = await Purchase.findOne({
      user: userId,
      course: courseId,
      razorpay_payment_id,
    });
    if (alreadyPurchased) {
      console.log(
        `⚠️ Duplicate purchase: User ${userId} already bought course ${courseId} with payment ${razorpay_payment_id}`
      );
      return res
        .status(400)
        .json({ success: false, message: "Course already purchased." });
    }

    // Step 3: Validate course
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Step 4: Get user and referrer
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const referrerId = req.referrer || user.referredBy;
    const referredByUser = referrerId ? await User.findById(referrerId) : null;

    // Step 5: Calculate commission (using original price)
    let commission = 0;
    let commissionDetails = {
      applied: false,
      reason: "No valid referrer found",
    };

    if (
      referredByUser &&
      referredByUser._id.toString() !== user._id.toString()
    ) {
      const COMMISSION_RATE = course.affiliateCommission || 60;
      commission = Math.trunc((course.price * COMMISSION_RATE) / 100);
      const discountedPrice = course.price * (1 - (course.discount || 0) / 100);

      console.log(
        `💸 Commission: ₹${commission} (${COMMISSION_RATE}% of ₹${course.price})`
      );

      commissionDetails = {
        applied: true,
        originalPrice: course.price,
        discountedPrice,
        commissionRate: COMMISSION_RATE,
        commissionAmount: commission,
        referrerEmail: referredByUser.email,
        reason: `${COMMISSION_RATE}% of original price ₹${course.price}`,
      };
    } else if (referredByUser) {
      commissionDetails.reason = "Self-referral not allowed";
    }

    console.log("🟢 Commission Details:", commissionDetails);

    // Step 6: Save purchase
    const newPurchase = new Purchase({
      user: userId,
      course: courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      affiliateId: referredByUser ? referredByUser.affiliateId : null,
      affiliate: referredByUser ? referredByUser._id : null,
      referredBy: referredByUser ? referredByUser._id : null,
      commissionEarned: commission,
      status: "completed",
    });
    await newPurchase.save();
    console.log(`✅ Purchase record saved with ₹${commission} commission`);

    // Step 7: Enroll user and set hasPurchased rohan
    // Check if already enrolled in this course
    const isAlreadyEnrolled = user.enrolledCourses.some(
      (c) => c.courseId.toString() === courseId
    );
    if (!isAlreadyEnrolled) {
      user.enrolledCourses.push({
        courseId: courseId,
        courseName: course.name,
        progress: 0,
      });
    }
    // Set hasPurchased true only on first purchase (if not already set)
    if (!user.hasPurchased) {
      user.hasPurchased = true;
    }
    await user.save();
    console.log(
      `📚 User enrolled/updated for course: ${course.name}, hasPurchased: ${user.hasPurchased}`
    );

    // Step 8: Process referral and commission
    if (referredByUser && commission > 0) {
      const existingReferral = await Referral.findOne({
        referredBy: referredByUser._id,
        referredUser: userId,
        course: courseId,
      });

      if (!existingReferral) {
        // Update affiliate earnings
        referredByUser.affiliateEarnings =
          (referredByUser.affiliateEarnings || 0) + commission;
        if (!referredByUser.referralHistory) {
          referredByUser.referralHistory = [];
        }
        if (!referredByUser.referralHistory.includes(userId)) {
          referredByUser.referralHistory.push(userId);
        }
        await referredByUser.save();

        // Save referral record
        const referral = new Referral({
          referredBy: referredByUser._id,
          referredUser: userId,
          course: courseId,
          commissionEarned: commission,
          status: "completed",
        });
        await referral.save();
        console.log(`✅ Referral Record Created: ${referral._id}`);

        // Save commission record
        const newCommission = new Commission({
          user: referredByUser._id,
          course: courseId,
          amount: commission,
          referredUser: userId,
          purchaseDate: new Date(),
        });
        await newCommission.save();
        console.log(`✅ Commission Record Created: ${newCommission._id}`);

        console.log(`🎉 COMMISSION AWARDED SUCCESSFULLY:
   - Referrer: ${referredByUser.email}
   - Previous Earnings: ₹${referredByUser.affiliateEarnings - commission}
   - New Commission: ₹${commission}
   - Total Earnings: ₹${referredByUser.affiliateEarnings}
   - Referral Record Created: ${referral._id}
   - Commission Record Created: ${newCommission._id}`);
      } else {
        console.log(
          `⚠️ Duplicate referral prevented for ${referredByUser.email}`
        );
      }
    } else if (referredByUser && commission === 0) {
      console.log(`⚠️ Commission is 0, skipping referral processing`);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and course purchased successfully.",
      commission: commissionDetails,
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// ADD YE FUNCTION purchaseController.js mein (verifyPayment ke neeche)

// GET /api/enrollment/status/:courseId
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    // Check if purchase record exists with status "completed"
    const purchase = await Purchase.findOne({
      user: userId,
      course: courseId,
      status: "completed"
    });

    if (purchase) {
      return res.json({
        success: true,
        isEnrolled: true,
        status: "Active", 
        message: "Course is active"
      });
    } else {
      return res.json({
        success: true,
        isEnrolled: false,
        status: "Pending",
        message: "Course not purchased yet"
      });
    }

  } catch (error) {
    console.error("Enrollment status check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// GET /api/purchase/course/:slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const course = await Course.findOne({ slug });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ success: false, message: "Failed to get course" });
  }
};

// POST /api/purchase
exports.handlePurchase = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "Purchase handled successfully" });
  } catch (error) {
    console.error("Error in handlePurchase:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateCourseThumbnail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    let thumbnailUrl = course.thumbnail;
    if (req.file) {
      console.log("📂 Thumbnail file received:", req.file);
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "courses",
      });
      console.log("🌐 Cloudinary Thumbnail URL:", uploadResult.secure_url);

      if (thumbnailUrl && thumbnailUrl.startsWith("public/")) {
        const oldPath = path.join(__dirname, "..", thumbnailUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      thumbnailUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
      console.log("🗑️ Removed local thumbnail file:", req.file.path);
    }

    course.thumbnail = thumbnailUrl;
    await course.save();
    res.json({
      success: true,
      message: "Thumbnail updated successfully",
      thumbnail: course.thumbnail,
    });
  } catch (error) {
    console.error("❌ Thumbnail upload error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update thumbnail",
      error: error.message,
    });
  }
};
