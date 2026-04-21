import rateLimit from "express-rate-limit";

// 🔥 GENERAL API LIMIT
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max 100 requests
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

// 🔐 LOGIN PROTECTION (STRICT)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 login attempts
  message: {
    success: false,
    message: "Too many login attempts, try later",
  },
});

// ✉️ EMAIL RATE LIMITER (PREVENT SPAMMING AND NODEMAILER BAN)
export const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // only 3 emails per 15 minutes
  message: {
    success: false,
    message: "Too many email requests, please wait 15 minutes",
  },
});
