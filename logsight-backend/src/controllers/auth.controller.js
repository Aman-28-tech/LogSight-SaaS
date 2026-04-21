import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/email.js";

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
      if (existing.isVerified) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        return next(error);
      } else {
        // If user exists but is not verified, we can overwrite or just resend OTP
        // For simplicity, let's just delete the old unverified user and create new
        await User.deleteOne({ email });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      email,
      password: hashed,
      isVerified: false,
      verificationOTP: otp,
      otpExpiry,
    });

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your LogSight account",
        message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<h1>Welcome to LogSight!</h1><p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr);
      // We don't want to fail signup if email fails, but in production we should
    }

    res.status(201).json({
      success: true,
      message: "Verification OTP sent to email",
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }
    next(err);
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

    if (!user.isVerified) {
      const error = new Error("Please verify your email before logging in");
      error.statusCode = 403;
      return next(error);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      const error = new Error("Incorrect password");
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
        isVerified: true, // Social login users are already verified
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

// 🔐 VERIFY OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      verificationOTP: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired OTP");
      error.statusCode = 400;
      return next(error);
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signAuthToken(user._id);

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 RESEND OTP
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.isVerified) {
      const error = new Error("User already verified");
      error.statusCode = 400;
      return next(error);
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your New Verification Code - LogSight",
      message: `Your new verification code is: ${otp}. It expires in 10 minutes.`,
      html: `<h1>LogSight Account Verification</h1><p>Your new verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
    });

    res.json({
      success: true,
      message: "Verification OTP resent successfully",
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't leak that the user doesn't exist to prevent enumeration
      return res.json({
        success: true,
        message: "If an account with that email exists, we have sent a reset code.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = otpExpiry;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - LogSight",
      message: `Your password reset code is: ${otp}. It expires in 10 minutes. If you didn't request this, you can safely ignore this email.`,
      html: `<h1>LogSight Password Reset</h1><p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>`,
    });

    res.json({
      success: true,
      message: "If an account with that email exists, we have sent a reset code.",
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired reset code");
      error.statusCode = 400;
      return next(error);
    }

    // Check if new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      const error = new Error("You cannot use your previous password.");
      error.statusCode = 400;
      return next(error);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpiry = undefined;
    
    // Automatically verify the user if they were unverified, since they possess the email 
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationOTP = undefined;
      user.otpExpiry = undefined;
    }
    
    await user.save();

    res.json({
      success: true,
      message: "Password has been successfully reset.",
    });
  } catch (err) {
    next(err);
  }
};
