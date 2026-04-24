import Log from '../models/log.model.js';
import User from '../models/user.model.js';

export const enforceLogLimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.plan === 'pro' || user.plan === 'enterprise') {
      return next(); // Unlimited (or higher limits)
    }

    // Default to free limits
    const currentMonth = new Date();
    currentMonth.setDate(1); // Start of month

    const logCount = await Log.countDocuments({
      userId: user._id,
      timestamp: { $gte: currentMonth }
    });

    if (logCount >= 1000) {
      return res.status(403).json({
        error: 'Free plan limit reached',
        message: 'You have exhausted your 1,000 logs per month on the free tier. Please upgrade to Pro.'
      });
    }

    next();
  } catch (error) {
    console.error('Limit Check Error:', error);
    res.status(500).json({ error: 'Internal server error while checking limits' });
  }
};

export const enforceAILimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.plan === 'pro' || user.plan === 'enterprise') {
      return next(); 
    }

    // Weekly Reset Logic
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const lastReset = user.aiUsageResetDate || new Date(0);

    if (now - lastReset > oneWeekInMs) {
      // It's been more than a week, reset the counter
      user.aiUsageCount = 0;
      user.aiUsageResetDate = now;
      await user.save();
    }

    // Updated Limit: 10 insights per week
    if (user.aiUsageCount >= 10) {
      return res.status(403).json({
        error: 'Weekly AI Limit Reached',
        message: 'You have used your 10 free AI insights for this week. Upgrade to Pro for unlimited access!'
      });
    }

    next();
  } catch (error) {
    console.error('AI Limit Check Error:', error);
    res.status(500).json({ error: 'Internal server error while checking AI limits' });
  }
};
