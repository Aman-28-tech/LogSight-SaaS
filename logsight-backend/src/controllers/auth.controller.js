import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const AUTH_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const signAuthToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: AUTH_TOKEN_EXPIRES_IN,
  });
};

// 🔐 REGISTER
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
    });

    const token = signAuthToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        token,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    next(err); // 🔥 send to middleware
  }
};

// 🔐 LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = signAuthToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err); // 🔥 central handler
  }
};

// 🔐 SOCIAL LOGIN (OAUTH)
export const socialLogin = async (req, res, next) => {
  try {
    const { email, uid } = req.body;

    if (!email || !uid) {
      const error = new Error("Missing OAuth credentials");
      error.statusCode = 400;
      return next(error);
    }

    let user = await User.findOne({ email });

    // If user does not exist, create them
    if (!user) {
      // Securely hash the UID so we still fulfill schema requirements, though it's never used for standard login
      const hashed = await bcrypt.hash(uid, 10);
      user = await User.create({
        email,
        password: hashed,
      });
    }

    const token = signAuthToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

