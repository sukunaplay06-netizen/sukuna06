// backend/routes/leaderboard.js
const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboard");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getLeaderboard);
module.exports = router;
