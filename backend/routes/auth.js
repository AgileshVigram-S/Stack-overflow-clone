const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const User = require("../models/User"); // Your user model
const router = express.Router();

const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

router.post("/google-login", async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: "YOUR_GOOGLE_CLIENT_ID" });
        const { email, name } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, password: "" });
        }

        res.status(200).json({ message: "Google login successful", user });
    } catch (error) {
        res.status(400).json({ error: "Google login failed" });
    }
});

module.exports = router;
