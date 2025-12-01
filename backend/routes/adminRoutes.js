const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUsageStats,
  getAllPosts,
  deletePostAdmin,
  getTemplates,
  createTemplate,
  deleteTemplate,
} = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// All admin routes require ADMIN role
router.use(protect, requireRole('ADMIN'));

router.get('/users', getUsers);
router.get('/usage', getUsageStats);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePostAdmin);

router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.delete('/templates/:id', deleteTemplate);

module.exports = router;
