const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET missing in .env");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ------------------------
// Signup
// ------------------------
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ email, password });
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------
// Login
// ------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ------------------------
// Get Authenticated User
// ------------------------
exports.getMe = async (req, res) => {
  return res.json({ user: req.user });
};

// ------------------------
// Usage Stats
// ------------------------
exports.getUsage = async (req, res) => {
  const user = req.user;

  return res.json({
    role: user.role,
    aiRequestsThisMonth: user.aiRequestsThisMonth,
    postsSavedThisMonth: user.postsSavedThisMonth,
    usageResetAt: user.usageResetAt,
  });
};
