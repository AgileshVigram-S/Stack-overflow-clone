// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();

let notificationSettings = {};

// Get user notification status
router.get("/user/notifications", (req, res) => {
  const { userId } = req.query; // Assuming you identify users by userId
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const enabled = notificationSettings[userId] || false;
  res.json({ enabled });
});

// Update user notification status
router.post("/user/notifications", (req, res) => {
  const { userId, enabled } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  notificationSettings[userId] = enabled;
  res.json({ success: true, enabled });
});

module.exports = router;
