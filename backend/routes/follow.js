// routes/followRoute.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/follow", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const loggedInUserId = req.user._id;

    if (!loggedInUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (userId.toString() === loggedInUserId.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const user = await User.findById(loggedInUserId);
    const targetUser = await User.findById(userId);

    if (!user || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.following.includes(userId)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    user.following.push(userId);
    await user.save();

    res.json({ message: "User followed successfully", following: user.following });
  } catch (error) {
    console.error("Follow Error:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

module.exports = router;
