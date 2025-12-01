const User = require('../models/User');
const Post = require('../models/Post');
const Template = require('../models/Template');

// Get all users with basic usage stats
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error('Admin getUsers error', err.message);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get AI usage per user (simple aggregation)
exports.getUsageStats = async (req, res) => {
  try {
    const users = await User.find().select('email role aiRequestsThisMonth postsSavedThisMonth');
    return res.json(users);
  } catch (err) {
    console.error('Admin getUsageStats error', err.message);
    return res.status(500).json({ message: 'Failed to fetch usage stats' });
  }
};

// Get all posts (for moderation)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'email role').sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error('Admin getAllPosts error', err.message);
    return res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Delete a post (inappropriate content)
exports.deletePostAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.json({ message: 'Post deleted by admin' });
  } catch (err) {
    console.error('Admin deletePost error', err.message);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
};

// Manage templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    return res.json(templates);
  } catch (err) {
    console.error('Get templates error', err.message);
    return res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, description, prompt, type } = req.body;
    const template = await Template.create({
      name,
      description,
      prompt,
      type,
      createdBy: req.user._id,
    });
    return res.status(201).json(template);
  } catch (err) {
    console.error('Create template error', err.message);
    return res.status(500).json({ message: 'Failed to create template' });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await Template.findByIdAndDelete(id);
    return res.json({ message: 'Template deleted' });
  } catch (err) {
    console.error('Delete template error', err.message);
    return res.status(500).json({ message: 'Failed to delete template' });
  }
};
