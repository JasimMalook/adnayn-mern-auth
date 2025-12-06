const jwt = require("jsonwebtoken");
const User = require("../models/User");

//
// AUTH MIDDLEWARE (FIXED)
//
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET is missing in your .env file!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found or deleted" });
    }

    // Attach user to req
    req.user = user;

    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

//
// ROLE PROTECTION
//
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, requireRole };
