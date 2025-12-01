const express = require('express');
const router = express.Router();
const { signup, login, getMe, getUsage } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/usage', protect, getUsage);

module.exports = router;
