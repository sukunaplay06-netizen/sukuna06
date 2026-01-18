// backend/routes/video.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Course = require("../models/Course");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-videos", upload.array("videos", 50), async (req, res) => {
  const { courseSlug } = req.body;
  if (!courseSlug) return res.status(400).json({ message: "courseSlug is required" });

  try {
    const results = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const orderNum = String(i + 1).padStart(2, "0"); // 01, 02, 03...
      const public_id = `video-${orderNum}`;

      const uploaded = await cloudinary.uploader.upload_large(file.path, {
        resource_type: "video",
        folder: `courses/${courseSlug}`,
        public_id,
        chunk_size: 6000000,
      });

      results.push({
        order: i + 1,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        duration: uploaded.duration,
      });

      fs.unlinkSync(file.path); // Clean up temporary file
    }

    // Update the Course document with the new videos
    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $push: { videos: { $each: results } } },
      { new: true, upsert: true }
    );

    res.json({ success: true, uploaded: results, course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;