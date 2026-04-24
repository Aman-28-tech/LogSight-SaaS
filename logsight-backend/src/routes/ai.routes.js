import express from "express";
import Joi from "joi";
import { analyzeLogs, formatInsight } from "../services/ai.service.js";
import { auth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { enforceAILimits } from "../middleware/plan.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();
const aiAnalysisSchema = Joi.object({
  logs: Joi.array().required(),
}).unknown(false);

router.post("/", auth, enforceAILimits, validate(aiAnalysisSchema), async (req, res, next) => {
  try {
    const logs = req.body.logs;
    const result = await analyzeLogs(logs);

    if (!result.ok) {
      return res.status(result.statusCode || 500).json({
        success: false,
        message: result.error.message,
      });
    }

    // Increment usage count for non-pro users
    await User.findByIdAndUpdate(req.user.id, { $inc: { aiUsageCount: 1 } });

    res.json({
      success: true,
      data: {
        insight: formatInsight(result.data),
        analysis: result.data,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
