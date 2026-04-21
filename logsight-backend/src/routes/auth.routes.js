import express from "express";
import { register, login, socialLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { loginLimiter, emailLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/register",validate(registerSchema), register);
router.post("/login",loginLimiter,validate(loginSchema), login);
router.post("/social", socialLogin);
router.post("/verify", verifyOTP);
router.post("/resend-otp", emailLimiter, resendOTP);
router.post("/forgot-password", emailLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;