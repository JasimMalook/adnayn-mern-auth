const FREE_AI_LIMIT = 20;
const FREE_POST_LIMIT = 10;

// Reset monthly counters if needed
const ensureMonthlyReset = (user) => {
  const now = new Date();
  if (!user.usageResetAt || user.usageResetAt < now) {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    user.aiRequestsThisMonth = 0;
    user.postsSavedThisMonth = 0;
    user.usageResetAt = nextMonth;
  }
};

// Check AI request limit for FREE users
const checkAiLimit = async (req, res, next) => {
  const user = req.user;
  ensureMonthlyReset(user);

  if (user.role === 'FREE' && user.aiRequestsThisMonth >= FREE_AI_LIMIT) {
    return res.status(403).json({
      message: 'FREE plan limit reached. Upgrade to PREMIUM for unlimited AI requests.',
    });
  }

  await user.save();
  next();
};

// Check saved posts limit for FREE users
const checkPostSaveLimit = async (req, res, next) => {
  const user = req.user;
  ensureMonthlyReset(user);

  if (user.role === 'FREE' && user.postsSavedThisMonth >= FREE_POST_LIMIT) {
    return res.status(403).json({
      message: 'FREE plan limit reached. Upgrade to PREMIUM for unlimited saved posts.',
    });
  }

  await user.save();
  next();
};

module.exports = { checkAiLimit, checkPostSaveLimit, ensureMonthlyReset };
