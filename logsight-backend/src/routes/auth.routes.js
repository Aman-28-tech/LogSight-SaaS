import express from "express";
import { register, login, socialLogin } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { loginLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/register",validate(registerSchema), register);
router.post("/login",loginLimiter,validate(loginSchema), login);
router.post("/social", socialLogin);

export default router;