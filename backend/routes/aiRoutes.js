const express = require('express');
const router = express.Router();
const {
  generateContent,
  savePost,
  getMyPosts,
  updatePost,
  deletePost,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { checkAiLimit, checkPostSaveLimit } = require('../middleware/planMiddleware');

// AI generation
router.post('/generate', protect, checkAiLimit, generateContent);

// Post CRUD
router.post('/posts', protect, checkPostSaveLimit, savePost);
router.get('/posts', protect, getMyPosts);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);

module.exports = router;
