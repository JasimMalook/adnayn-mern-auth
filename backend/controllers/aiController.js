const axios = require('axios');
const Post = require('../models/Post');
const { checkPostSaveLimit } = require('../middleware/planMiddleware');

// Helper to call OpenAI Chat Completion (gpt-3.5/4 or compatible endpoint)
const callOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
};

// Generate generic content by type
exports.generateContent = async (req, res) => {
  const { type, topic, audience, tone } = req.body;
  const user = req.user;

  try {
    let instruction = '';
    switch (type) {
      case 'idea':
        instruction = 'Generate 10 social media post ideas';
        break;
      case 'caption':
        instruction = 'Generate 5 engaging social media captions';
        break;
      case 'product_description':
        instruction = 'Write a compelling product description';
        break;
      case 'content_plan':
        instruction = 'Create a detailed 30-day social media content plan';
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    const prompt = `${instruction} for topic: "${topic || 'your business'}". Audience: ${
      audience || 'general'
    }. Tone: ${tone || 'friendly and professional'}.`;

    const content = await callOpenAI(prompt);

    // Increment AI usage counter
    user.aiRequestsThisMonth += 1;
    await user.save();

    return res.json({ content });
  } catch (err) {
    console.error('AI generate error', err.message);
    return res.status(500).json({ message: 'Failed to generate content' });
  }
};

// Save generated content as a post
exports.savePost = async (req, res) => {
  const user = req.user;
  const { type, title, content, metadata } = req.body;

  try {
    // Reuse middleware logic directly
    const { ensureMonthlyReset } = require('../middleware/planMiddleware');
    ensureMonthlyReset(user);

    if (user.role === 'FREE' && user.postsSavedThisMonth >= 10) {
      return res.status(403).json({
        message: 'FREE plan limit reached. Upgrade to PREMIUM for unlimited saved posts.',
      });
    }

    const post = await Post.create({
      user: user._id,
      type,
      title,
      content,
      metadata,
    });

    user.postsSavedThisMonth += 1;
    await user.save();

    return res.status(201).json(post);
  } catch (err) {
    console.error('Save post error', err.message);
    return res.status(500).json({ message: 'Failed to save post' });
  }
};

// List current user's posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error('Get posts error', err.message);
    return res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, metadata } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, metadata },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(post);
  } catch (err) {
    console.error('Update post error', err.message);
    return res.status(500).json({ message: 'Failed to update post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id, user: req.user._id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error', err.message);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
};
