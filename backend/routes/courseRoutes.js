// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authenticate = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Commission = require('../models/Commission');
const { getCourseBySlug } = require('../controllers/courseController');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
});

// ✅ Get course by slug using controller
// backend/routes/courseRoutes.js
router.get("/slug/:slug", protect, async (req, res) => {
  try {
    console.log(`[GET /slug/:slug] Fetching course for slug: ${req.params.slug}, User ID: ${req.user._id}`);
    const course = await Course.findOne({ slug: req.params.slug }).lean();
    if (!course) {
      console.log(`[GET /slug/:slug] Course not found for slug: ${req.params.slug}`);
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if the user has purchased the course
    const purchase = await Purchase.findOne({
      user: req.user._id,
      course: course._id,
      status: "completed",
    });
    console.log(`[GET /slug/:slug] Purchase check for user ${req.user._id}: ${purchase ? 'Purchased' : 'Not purchased'}`);

    // Filter videos: Only include URLs for freePreview videos or if user has purchased
    const videos = course.videos.map((video) => {
      const videoData = {
        ...video,
        url: purchase || video.freePreview ? video.url : null,
      };
      console.log(`[GET /slug/:slug] Video "${video.title}": freePreview=${video.freePreview}, hasPurchased=${!!purchase}, URL=${videoData.url ? 'Included' : 'Hidden'}`);
      return videoData;
    });

    // Add hasPurchased flag to the response
    const response = {
      ...course,
      videos,
      hasPurchased: !!purchase,
    };
    console.log(`[GET /slug/:slug] Sending response:`, {
      courseId: course._id,
      courseName: course.name,
      hasPurchased: response.hasPurchased,
      videoCount: videos.length,
      videos: videos.map((v) => ({ title: v.title, url: v.url ? 'Included' : 'Hidden', freePreview: v.freePreview })),
    });

    res.json(response);
  } catch (err) {
    console.error(`[GET /slug/:slug] Error:`, err.message, err.stack);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ✅ Log all requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});



// ✅ Delete course by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ success: false, message: "Failed to delete course" });
  }
});
// ✅ Add video to a course
router.post("/:id/videos", async (req, res) => {
  try {
    const { title, url, freePreview } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.videos.push({ title, url, freePreview: freePreview || false });
    await course.save();

    res.json({ success: true, message: "Video added successfully", course });
  } catch (err) {
    console.error("Error adding video:", err);
    res.status(500).json({ success: false, message: "Error adding video", error: err.message });
  }
});

// ✅ Get all videos of a course
router.get("/:id/videos", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select("name videos");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, videos: course.videos });
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ success: false, message: "Error fetching videos", error: err.message });
  }
});


// ✅ Update video inside a course
router.put("/:courseId/videos/:videoId", async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const { title, url, freePreview } = req.body;  // yaha freePreview le lo

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const video = course.videos.id(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Update fields
    if (title !== undefined) video.title = title;
    if (url !== undefined) video.url = url;
    if (freePreview !== undefined) video.freePreview = freePreview;

    await course.save();

    res.json({
      success: true,
      message: "Video updated successfully",
      video, // sirf updated video bhejna better hai
    });
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ message: "Server error" });
  }
});




// ✅ Create Razorpay Order for single course
router.post('/purchase/create-order', authenticate.protect, async (req, res) => {
  try {
    const { courseId, amount, affiliateId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}_${req.user._id}`,
      notes: {
        userId: req.user._id.toString(),
        courseId,
        affiliateId: affiliateId || '',
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ success: false, message: 'Order creation failed', error: err.message });
  }
});

// ✅ Verify Razorpay Payment for single course
router.post('/purchase/verify', authenticate.protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount,
      affiliateId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const commission = affiliateId
      ? (course.price * (1 - course.discount / 100) * (course.affiliateCommission || 10)) / 100
      : 0;

    const purchase = new Purchase({
      user: req.user._id,
      course: courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: amount / 100,
      affiliateId: affiliateId || null,
      commissionEarned: commission,
      status: 'completed',
    });
    await purchase.save();

    if (affiliateId) {
      await User.findOneAndUpdate(
        { affiliateId },
        { $inc: { affiliateEarnings: commission } }
      );

      // Create Commission record
      const affiliateUser = await User.findOne({ affiliateId });
      if (affiliateUser) {
        const newCommission = new Commission({
          user: affiliateUser._id,
          course: courseId,
          amount: commission,
          purchaseDate: new Date(),
          referredUser: req.user._id,
        });
        await newCommission.save();
        console.log(`💰 Commission record created for ${affiliateUser.email}: ₹${commission}`);
      }
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        enrolledCourses: {
          courseId: course._id,
          courseName: course.name,
          progress: 0,
        },
      },
    });

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      message: 'Payment verified successfully',
      enrolledCourses: updatedUser.enrolledCourses,
    });
  } catch (err) {
    console.error('Payment verification failed:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
  }
});

// ✅ Get enrolled courses for user
router.get('/enrolled-courses', authenticate.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get courseIds from enrolledCourses array
    const courseIds = user.enrolledCourses.map(ec => ec.courseId);
    // Fetch full course details
    const courses = await Course.find({ _id: { $in: courseIds } });

    // Merge progress info from enrolledCourses
    const enrolledCourses = courses.map(course => {
      const userCourse = user.enrolledCourses.find(ec => String(ec.courseId) === String(course._id));
      return {
        ...course.toObject(),
        progress: userCourse ? userCourse.progress : 0
      };
    });

    res.json({
      success: true,
      name: user.name,
      enrolledCourses,
      affiliateId: user.affiliateId || '',
      affiliateEarnings: user.affiliateEarnings || 0,
    });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch enrolled courses', error: err.message });
  }
});

// ✅ Create Razorpay Order for all courses
router.post('/purchase-all/create-order', authenticate.protect, async (req, res) => {
  try {
    const { affiliateId } = req.body;
    const courses = await Course.find();

    if (!courses.length) {
      return res.status(404).json({ success: false, message: 'No courses available' });
    }

    const totalAmount = courses.reduce((sum, course) => {
      const discountedPrice = course.price * (1 - course.discount / 100);
      return sum + discountedPrice;
    }, 0);

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_all_${Date.now()}_${req.user._id}`,
      notes: {
        userId: req.user._id.toString(),
        courseIds: courses.map((c) => c._id.toString()),
        affiliateId: affiliateId || '',
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Order creation failed for all courses:', err);
    res.status(500).json({ success: false, message: 'Order creation failed', error: err.message });
  }
});

// ✅ Verify Razorpay Payment for all courses
router.post('/purchase-all/verify', authenticate.protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseIds,
      amount,
      affiliateId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (!courses.length) {
      return res.status(404).json({ success: false, message: 'No courses found' });
    }

    const purchases = courses.map(course => ({
      user: req.user._id,
      course: course._id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: course.price * (1 - course.discount / 100),
      affiliateId: affiliateId || null,
      commissionEarned: affiliateId
        ? (course.price * (1 - course.discount / 100) * (course.affiliateCommission || 10)) / 100
        : 0,
      status: 'completed',
    }));

    await Purchase.insertMany(purchases);

    if (affiliateId) {
      const totalCommission = courses.reduce((sum, course) => {
        return sum + (course.price * (1 - course.discount / 100) * (course.affiliateCommission || 10) / 100);
      }, 0);
      await User.findOneAndUpdate(
        { affiliateId },
        { $inc: { affiliateEarnings: totalCommission } }
      );

      // Create Commission records for each course
      const affiliateUser = await User.findOne({ affiliateId });
      if (affiliateUser) {
        const commissionRecords = courses.map(course => ({
          user: affiliateUser._id,
          course: course._id,
          amount: (course.price * (1 - course.discount / 100) * (course.affiliateCommission || 10)) / 100,
          purchaseDate: new Date(),
          referredUser: req.user._id,
        }));
        
        await Commission.insertMany(commissionRecords);
        console.log(`💰 Commission records created for ${affiliateUser.email}: ${commissionRecords.length} records, total ₹${totalCommission}`);
      }
    }

    const newEnrolledCourses = courses.map(course => ({
      courseId: course._id,
      courseName: course.name,
      progress: 0,
    }));

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        enrolledCourses: { $each: newEnrolledCourses },
      },
    });

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      message: 'Payment verified successfully for all courses',
      enrolledCourses: updatedUser.enrolledCourses,
    });
  } catch (err) {
    console.error('Payment verification failed for all courses:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
  }
});



module.exports = router;
