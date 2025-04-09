const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Question = require('./models/Question'); // Import the Question model
const router = express.Router();
const app = express();
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const http = require('http'); // Import http module
const { Server } = require("socket.io");
const notificationRoutes = require("./routes/notificationRoutes");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { OAuth2Client } = require("google-auth-library");
const useragent = require("useragent");
const otpGenerator = require("otp-generator");


const server = http.createServer(app); // Create an HTTP server
//const io = socketIo(server, { cors: { origin: "*" } }); // Pass server to Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://stack-overflow-clone-kpa7.vercel.app/", // Frontend URL
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;
// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/test1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
// app.use(cors());
app.use(cors({
  origin: "https://stack-overflow-clone-kpa7.vercel.app/", // ✅ Allow only your frontend URL
  methods:["POST","GET"],
  credentials: true, // ✅ Allow credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", notificationRoutes);

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: { type: String, default: null }, // Will be empty for Google-authenticated users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth users
  profilePic: String, // Store Google profile picture if needed
});

const User = mongoose.model('User', userSchema, 'users');

// Sign-up route
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    return res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
});



// API endpoint to save a question
app.post('/api/questions', async (req, res) => {
  const { title, details, attempts, tags } = req.body;

  try {
    const question = new Question({ title, details, attempts, tags, answers: [] }); // Initialize answers as empty array
    await question.save();
    res.status(201).json({ message: 'Question saved successfully!', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save question.', error });
  }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions from the database
    res.status(200).json(questions); // Respond with the questions
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions.', error });
  }
});

// Get a single question by `id_no`
router.get('/questions/:id', async (req, res) => {
  console.log("Received request for question ID:", req.params.id);  // Debugging

  try {
    const question = await Question.findOne({ id_no: parseInt(req.params.id) }); // Fetch question by id_no field
    console.log("Fetched question:", question);  // Display the question

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    res.json(question); // Return the question with answers
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Server error while fetching question.' });
  }
});

// API endpoint to submit an answer to a question
app.post('/api/questions/:id/answers', async (req, res) => {
  const questionId = req.params.id;
  const { content, author } = req.body;

  try {
    const question = await Question.findOne({ id_no: parseInt(questionId) }); // Fetch question by id_no
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Add the new answer to the answers array
    question.answers.push({ content, author, time: new Date() });
    await question.save();

    res.status(201).json({ message: 'Answer submitted successfully!', question });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer.' });
  }
});

// Use the router for routes starting with /api
app.use('/api', router); // Add this line to link the router to the app

// const otpStore = {};

// const sendEmailOTP = async (email) => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[email] = otp;

//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: { user: 'agileshvigram@gmail.com', pass: 'lrem vgfe xxlh rejq' },
//   });

//   await transporter.sendMail({
//     from: 'agileshvigram@gmail.com',
//     to: email,
//     subject: 'Language Change OTP',
//     text: `Your OTP is ${otp}`,
//   });

//   return otp;
// };

// const sendSMSOTP = async (phone) => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[phone] = otp;

//   const client = twilio('TWILIO_SID', 'TWILIO_AUTH_TOKEN');
//   await client.messages.create({
//     body: `Your OTP is ${otp}`,
//     from: 'your-twilio-number',
//     to: phone,
//   });

//   return otp;
// };

// app.post('/api/send-email-otp', async (req, res) => {
//   const { email } = req.body;
//   await sendEmailOTP(email);
//   res.json({ message: 'Email OTP sent' });
// });

// app.post('/api/send-sms-otp', async (req, res) => {
//   const { phone } = req.body;
//   await sendSMSOTP(phone);
//   res.json({ message: 'SMS OTP sent' });
// });

// app.post('/api/verify-otp', (req, res) => {
//   const { otp, identifier } = req.body;
//   if (otpStore[identifier] == otp) {
//     delete otpStore[identifier];
//     return res.json({ success: true });
//   }
//   res.json({ success: false });
// });
const OTP = mongoose.model('OTP', new mongoose.Schema({
  identifier: String,  // Email or Mobile Number
  otp: String,
  expiresAt: Date
}));

const otp = mongoose.model('otp', userSchema, 'otp_verification');
// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send Email OTP function
const sendEmailOTP = async (email, otp) => {
    const mailOptions = {
        from: 'agileshvigram@gmail.com',
        to: email,
        subject: 'Your OTP for Authentication',
        text: `Your OTP is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};

// Send Mobile OTP function
const sendMobileOTP = async (phone, otp) => {
    await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: '+917708440769',
        to: phone
    });
};

// API to send OTP (Email or Mobile)
app.post('/send-otp', async (req, res) => {
    const { identifier, type } = req.body;  // identifier = email or phone, type = 'email' or 'mobile'

    if (!identifier || !type) {
        return res.status(400).json({ message: "Identifier and type are required!" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    await OTP.findOneAndUpdate({ identifier }, { otp, expiresAt }, { upsert: true });

    try {
        if (type === 'email') {
            await sendEmailOTP(identifier, otp);
        } else if (type === 'mobile') {
            await sendMobileOTP(identifier, otp);
        }
        res.json({ message: `OTP sent successfully to ${identifier}` });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
    }
});

// API to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { identifier, otp } = req.body;
    const record = await OTP.findOne({ identifier });

    if (!record) {
        return res.status(400).json({ message: "OTP not found, please request a new one." });
    }

    if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
    }

    await OTP.deleteOne({ identifier });
    res.json({ message: "OTP verified successfully" });
});

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// app.post("/api/auth/google", async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({ message: "Token is missing" });
//     }

//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     console.log("Google payload: ", payload);

//     res.status(200).json({
//       message: "Google login successful",
//       user: {
//         name: payload.name,
//         email: payload.email,
//         picture: payload.picture,
//       },
//     });
//   } catch (error) {
//     console.error("Google login error: ", error);
//     res.status(500).json({ message: "Google login failed", error: error.message });
//   }
// });


app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email: email,
        password: null, // Password not required for Google users
      });
      await user.save(); // Save new user
    }

    res.status(200).json({
      message: "Google login successful",
      user: { name: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Google login error: ", error);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
});


// Middleware for Express session
app.use(session({
  secret: "your-secret-key", // Used to sign session cookies
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Create new user if not found
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: null, // Password will be null for Google users
      });
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));


// Serialize and Deserialize User (for sessions)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Auth Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
app.get("/auth/google/callback",
  passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "/dashboard",
  })
);

// Dashboard (Protected Route)
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
      return res.redirect("/login");
  }
  res.send(`<h1>Welcome, ${req.user.displayName}</h1>`);
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

// Home
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});


// Notification Route
app.post("/api/user/notifications", (req, res) => {
  console.log("Received Data:", req.body);
  res.status(200).json({ message: "Notification status updated" });
});

app.get("/api/user/notifications", async (req, res) => {
  const { userId } = req.query; // Get user ID from query
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ notificationsEnabled: user.notificationsEnabled });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err });
  }
});

// ✅ Update Notification Preference
app.post("/api/user/notifications", async (req, res) => {
  const { userId, enabled } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { notificationsEnabled: enabled },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Notification status updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating notifications", error: err });
  }
});

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("answer-added", async ({ userId, questionTitle }) => {
//     const user = await User.findById(userId);
//     if (user.notificationsEnabled) {
//       io.to(userId).emit("new-notification", {
//         title: "New Answer",
//         message: `Someone answered your question: ${questionTitle}`,
//       });
//     }
//   });

//   socket.on("answer-upvoted", async ({ userId, questionTitle }) => {
//     const user = await User.findById(userId);
//     if (user.notificationsEnabled) {
//       io.to(userId).emit("new-notification", {
//         title: "Answer Upvoted",
//         message: `Someone upvoted your answer on: ${questionTitle}`,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

let userNotificationPreference = { enabled: false };

router.get("/user/notifications", (req, res) => {
  res.json(userNotificationPreference);
});

router.post("/user/notifications", (req, res) => {
  userNotificationPreference.enabled = req.body.enabled;
  res.json({ success: true, enabled: req.body.enabled });
});

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Send a test notification when connected
//   socket.emit("test-notification", { message: "Welcome to the Socket.IO server!" });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

const userSockets = new Map(); // Map userId to socket.id

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Store userId and socketId when user connects
  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User registered: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    userSockets.forEach((id, key) => {
      if (id === socket.id) userSockets.delete(key);
    });
  });
});

// Emit event when someone answers a question
const notifyAnswer = (userId, questionTitle) => {
  const userSocket = userSockets.get(userId);
  if (userSocket) {
    io.to(userSocket).emit("new-answer", {
      message: `Someone answered your question: "${questionTitle}"`,
    });
  }
};

// Emit event when someone upvotes a question
const notifyUpvote = (userId, questionTitle) => {
  const userSocket = userSockets.get(userId);
  if (userSocket) {
    io.to(userSocket).emit("new-upvote", {
      message: `Your question "${questionTitle}" received an upvote!`,
    });
  }
};

// Example routes to trigger notifications
app.post("/api/answer", (req, res) => {
  const { userId, questionTitle } = req.body;
  notifyAnswer(userId, questionTitle);
  res.json({ success: true });
});

app.post("/api/upvote", (req, res) => {
  const { userId, questionTitle } = req.body;
  notifyUpvote(userId, questionTitle);
  res.json({ success: true });
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "agileshvigram@gmail.com",
    pass: "lrem vgfe xxlh rejq",
  },
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Extract system details
  const agent = useragent.parse(req.headers["user-agent"]);
  const browser = agent.family;
  const os = agent.os.toString();
  const device = agent.device.toString();
  const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Check if the device is mobile
  const isMobile = device.toLowerCase().includes("mobile");

  // Restrict Mobile Access (Only allow 10 AM - 1 PM)
  const currentHour = new Date().getHours();
  if (isMobile && (currentHour < 10 || currentHour >= 13)) {
    return res.status(403).json({ message: "Mobile access is only allowed from 10 AM to 1 PM" });
  }

  // Enforce OTP for Google Chrome users
  if (browser.includes("Chrome")) {
    const otpCode = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Store OTP in database
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    };
    await user.save();

    // Send OTP to user's email
    await transporter.sendMail({
      from: "agileshvigram@gmail.com",
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpCode}`,
    });

    return res.status(401).json({ message: "OTP sent to email. Please verify." });
  }

  // Allow Microsoft Edge & Internet Explorer without authentication
  if (browser.includes("Edge") || browser.includes("IE")) {
    console.log("Microsoft browser detected, skipping authentication");
  }

  // Ensure loginHistory exists
  if (!user.loginHistory) {
    user.loginHistory = [];
  }

  // Store login history
  user.loginHistory.push({ browser, os, device, ipAddress });
  await user.save();

  res.status(200).json({ message: "Login successful" });
});

module.exports = router;

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.otp || user.otp.code !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // Check OTP expiration
  if (user.otp.expiresAt < new Date()) {
    return res.status(401).json({ message: "OTP expired" });
  }

  // Clear OTP after successful verification
  user.otp = null;
  await user.save();

  res.status(200).json({ message: "OTP verified. Login successful" });
});

router.get("/api/user/login-history", async (req, res) => {
  const { email } = req.query; // Get email from frontend request
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user.loginHistory);
});

app.get("/api/user/login-history", (req, res) => {
  res.json({ message: "Login history data" });
});

const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/follow");
const authRoutes = require("./routes/authRoutes");
const followRoute = require("./routes/followRoutes");
app.use("/api", followRoute)

app.use("/api/users1", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/auth1", authRoutes);

const questionSchema= new mongoose.Schema({
  text: String,
  videoUrl: String,
  answers: [{ text: String }]
});

// ✅ Import the correct model
const Question1 = mongoose.model('Question1', questionSchema);


// ✅ Get all questions
app.get('/questions1', async (req, res) => {
  try {
    const questions = await Question1.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// ✅ Ask a new question (with YouTube URL processing)
app.post('/ask-question1', async (req, res) => {
  try {
    let { text, videoUrl } = req.body;

    // Convert YouTube link to embeddable format
    if (videoUrl && videoUrl.includes("youtube.com")) {
      videoUrl = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl && videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.split("/").pop();
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const newQuestion = new Question1({ text, videoUrl, answers: [] });
    await newQuestion.save();

    res.status(201).json({ message: "Question added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding question" });
  }
});

// ✅ Answer a question
app.post('/answer-question1', async (req, res) => {
  try {
    const { questionId, text } = req.body;

    await Question1.findByIdAndUpdate(questionId, {
      $push: { answers: { text } }
    });

    res.status(201).json({ message: "Answer added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding answer" });
  }
});



// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
