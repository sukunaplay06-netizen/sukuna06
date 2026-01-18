// controllers/paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/Course");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Referral = require("../models/Referral");
const Commission = require("../models/Commission");
const mongoose = require("mongoose");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Order creation failed", error });
  }
};

// ✅ Full logic to verify and process payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       courseId,
//     } = req.body;

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(sign)
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;
//     if (!isValid) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const userId = req.user.id;

//     // Get user from DB
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const alreadyPurchased = await Purchase.findOne({ user: userId, course: courseId });
//     if (alreadyPurchased) {
//       return res.status(400).json({ success: false, message: "Course already purchased" });
//     }

//     // Save purchase
//     const newPurchase = new Purchase({
//       user: userId,
//       course: courseId,
//       amountPaid: course.price,
//       razorpayPaymentId: razorpay_payment_id,
//     });
//     await newPurchase.save();

//     let commissionAmount = 0;

//     if (user.referredBy) {
//       // Calculate commission
//       const originalPrice = course.price;
//       const commissionRate = course.commissionRate || 0.6; // default 60%
//       commissionAmount = Math.trunc(originalPrice * commissionRate);

//       // Save commission
//       const newCommission = new Commission({
//         user: user.referredBy,
//         course: courseId,
//         amount: commissionAmount,
//         purchaseDate: new Date(),
//         referredUser: userId,
//       });
//       await newCommission.save();

//       // Update referrer
//       const referrer = await User.findById(user.referredBy);
//       if (referrer) {
//         referrer.affiliateEarnings = (referrer.affiliateEarnings || 0) + commissionAmount;

//         if (!Array.isArray(referrer.referralHistory)) {
//           referrer.referralHistory = [];
//         }
//         if (!referrer.referralHistory.map(String).includes(String(userId))) {
//           referrer.referralHistory.push(userId);
//         }

//         await referrer.save();
//         console.log(`💸 Referrer ${referrer.email} earned ₹${commissionAmount} from ${user.email}`);
//       }
//     }

//     // ✅ Respond to client
//     res.json({
//       success: true,
//       message: "Payment verified and course purchased",
//       data: {
//         courseId: course._id,
//         amountPaid: newPurchase.amountPaid,
//         commissionEarned: commissionAmount,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Error in verifyPayment:", err);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };


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

    if (referredByUser && referredByUser._id.toString() !== user._id.toString()) {
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

    // NEW ADDITION: Update user's enrolled courses
    user.enrolledCourses = user.enrolledCourses || [];
    if (!user.enrolledCourses.some(c => c.toString() === courseId.toString())) {
      user.enrolledCourses.push(new mongoose.Types.ObjectId(courseId));
    }
    await user.save();
    console.log(`✅ [purchaseController.js] User ${user.email} enrolled in course ${courseId}`, { timestamp: new Date().toISOString() });

    // Step 7: Enroll user and set hasPurchased
    if (!user.enrolledCourses.some((c) => c.courseId.toString() === courseId)) {
      user.enrolledCourses.push({ courseId: courseId, courseName: course.name, progress: 0 });
      user.hasPurchased = true;
      await user.save();
      console.log(`📚 User enrolled in course: ${course.name}`);
    }

    // Step 8: Process referral and commission
    if (referredByUser && commission > 0) {
      const existingReferral = await Referral.findOne({
        referredBy: referredByUser._id,
        referredUser: userId,
        course: courseId,
      });

      if (!existingReferral) {
        // Update affiliate earnings
        referredByUser.affiliateEarnings = (referredByUser.affiliateEarnings || 0) + commission;
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
        console.log(`⚠️ Duplicate referral prevented for ${referredByUser.email}`);
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