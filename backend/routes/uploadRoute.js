const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware"); // Add authentication

// Storage setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "course_videos",       // Cloudinary folder name
    resource_type: "video",        // Important for videos
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
  },
});

// File size limit (e.g., 100MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Upload video route
router.post("/upload", protect, upload.single("video"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No video file uploaded" });
    }
    return res.json({
      success: true,
      url: req.file.path,       // Cloudinary video URL
      public_id: req.file.public_id, // Use public_id from Cloudinary
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;