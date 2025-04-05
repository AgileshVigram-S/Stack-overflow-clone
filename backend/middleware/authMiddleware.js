const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded; // decoded contains the payload (user info)
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
