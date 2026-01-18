// backend/controllers/courseController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const User = require('../models/User');
const cloudinary = require("../config/cloudinary");
const View = require('../models/View');
const fs = require('fs');
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ GET COURSE BY SLUG
// exports.getCourseBySlug = async (req, res) => {
//   try {
//     const course = await Course.findOne({ slug: req.params.slug });
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json(course);
//   } catch (err) {
//     console.error('Error getting course by slug:', err);
//     res.status(500).json({ message: err.message });
//   }
// };
// ✅ GET COURSE BY SLUG (Updated with discount sanitization)
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // 🆕 ADD ये: Sanitize discount for this course
    let safeDiscount = 0;
    if (course.discount) {
      if (typeof course.discount === 'object' && course.discount.$numberDecimal) {
        safeDiscount = parseFloat(course.discount.$numberDecimal);
      } else {
        safeDiscount = parseFloat(course.discount.toString() || '0');
      }
    }
    console.log(`Sanitized ${course.name} discount: ${safeDiscount} (was: ${course.discount})`);  // Log
    
    const sanitizedCourse = {
      ...course.toObject(),
      discount: safeDiscount  // Number
    };
    
    res.json(sanitizedCourse);
  } catch (err) {
    console.error('Error getting course by slug:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE ORDER (WITH PRICE SWITCH CASE)
exports.createOrder = async (req, res) => {
  const { courseName } = req.body;

  try {
    if (!courseName) {
      return res.status(400).json({ message: 'Course name is required' });
    }

   
    // ✅ Create Razorpay order
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

// ✅ VERIFY PAYMENT & ENROLL COURSE
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseName,
  } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyEnrolled = user.enrolledCourses.some(
      (course) => course.courseName === courseName
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push({ courseName, progress: 0 });
      await user.save();
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      enrolledCourses: user.enrolledCourses,
    });

  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// NEW: Upload Course to Cloudinary and MongoDB
exports.uploadCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnail = req.files.thumbnail[0];
    const content = req.files.content[0];

    if (!title || !thumbnail || !content) {
      return res.status(400).json({ message: "Title, thumbnail, and content are required" });
    }

    // Upload thumbnail to Cloudinary
    const thumbnailUpload = await cloudinary.uploader.upload(thumbnail.path, {
      folder: "courses/thumbnails",
      public_id: `${title}_thumbnail`,
      resource_type: "image",
    });

    // Upload content (auto detect type)
    const contentUpload = await cloudinary.uploader.upload(content.path, {
      folder: "courses/content",
      public_id: `${title}_content`,
      resource_type: "auto", // Handles image, video, raw (PDF)
    });

    // Save to MongoDB
    const course = new Course({
      title,
      description,
      thumbnail: thumbnailUpload.secure_url,
      contentUrl: contentUpload.secure_url,
      uploadedBy: req.user._id,
    });
    await course.save();

    res.json({ success: true, message: "Course uploaded successfully", course });
  } catch (error) {
    console.error("❌ Upload course error:", error.message);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

// NEW: Get Courses from Cloudinary (updated to fetch all types)
exports.getCoursesFromCloudinary = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: "all", // Fetches image, video, raw
      prefix: "courses/", // Folder where courses are stored
      max_results: 500,
    });
    res.json({ success: true, courses: result.resources.map(r => ({ url: r.secure_url, public_id: r.public_id, type: r.resource_type })) });
  } catch (error) {
    console.error("❌ Get courses from Cloudinary error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.logVideoView = async (req, res) => {
  try {
    const { videoKey } = req.params;
    const view = new View({ userId: req.user._id, videoKey, timestamp: new Date() });
    await view.save();
    // Trigger payment logic (e.g., via Stripe webhook)
    res.json({ message: 'View logged' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging view' });
  }
};


// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    // const course = await Course.findById(req.params.id);
    const course = await Course.findById(req.params.id).select('thumbnail title description contentUrl uploadedBy');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/videos/url/:key
exports.getSignedVideoUrl = async (req, res) => {
  try {
    const { key } = req.params; // Expecting public_id from Cloudinary
    const url = cloudinary.url(key, {
      resource_type: "video", // Specify video resource
      type: "upload", // Direct upload
      secure: true, // HTTPS URL
    });
    res.json({ url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateThumbnail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.file) {
      console.log('📂 File received:', req.file);
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'courses' });
      console.log('🌐 Cloudinary URL:', uploadResult.secure_url);

      // Old image cleanup (if from /public)
      if (course.thumbnail && course.thumbnail.startsWith('public/')) {
        fs.unlinkSync(path.join(__dirname, '..', course.thumbnail)); // Remove old file
      }

      course.thumbnail = uploadResult.secure_url;
      await course.save();
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Removed local file:', req.file.path);
    }

    res.json({ success: true, thumbnail: course.thumbnail });
  } catch (error) {
    console.error('❌ Update thumbnail error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};