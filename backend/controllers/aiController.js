// controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Post = require("../models/Post");
const { ensureMonthlyReset } = require("../middleware/planMiddleware");

// Initialize Gemini client
let genAI = null;
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env (backend)");
} else {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Generate AI content using Gemini
const generateContent = async (req, res) => {
  try {
    const { type, topic, audience, tone } = req.body;

    if (!topic || !audience || !tone) {
      return res.status(400).json({ message: "Topic, Audience and Tone are required." });
    }

    if (!genAI) {
      return res.status(500).json({ message: "AI is not configured. Please set GEMINI_API_KEY." });
    }

    const model = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash"
});


    const prompt = `
      You are an AI assistant helping a social media manager create content.

      Content type: ${type || "idea"}
      Topic: ${topic}
      Audience: ${audience}
      Tone: ${tone}

      Create structured, ready-to-use content for a social media post dashboard.
      Output:
      1. Headline Ideas
      2. Subheadline Ideas
      3. Short Description
      4. Features / talking points list
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Track usage for the authenticated user
    if (req.user) {
      ensureMonthlyReset(req.user);
      req.user.aiRequestsThisMonth = (req.user.aiRequestsThisMonth || 0) + 1;
      await req.user.save();
    }

    res.status(200).json({ content: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: error.message || "AI generation failed" });
  }
};

// Save a generated post for the current user
const savePost = async (req, res) => {
  try {
    const user = req.user;
    const { type, title, content, metadata } = req.body;

    if (!type || !content) {
      return res.status(400).json({ message: "Type and content are required" });
    }

    const post = await Post.create({
      user: user._id,
      type,
      title,
      content,
      metadata: metadata || {},
    });

    // Track saved posts usage
    ensureMonthlyReset(user);
    user.postsSavedThisMonth = (user.postsSavedThisMonth || 0) + 1;
    await user.save();

    return res.status(201).json(post);
  } catch (error) {
    console.error("savePost error:", error);
    return res.status(500).json({ message: "Failed to save post" });
  }
};

// Get posts saved by the current user
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    console.error("getMyPosts error:", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Update a post owned by the current user
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("updatePost error:", error);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

// Delete a post owned by the current user
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id, user: req.user._id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("deletePost error:", error);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};

module.exports = {
  generateContent,
  savePost,
  getMyPosts,
  updatePost,
  deletePost,
};
