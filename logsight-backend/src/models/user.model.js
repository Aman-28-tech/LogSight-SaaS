import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationOTP: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
  plan: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free",
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "canceled", "past_due", "none"],
    default: "none",
  },
  stripeCustomerId: {
    type: String,
  },
  aiUsageCount: {
    type: Number,
    default: 0,
  },
  aiUsageResetDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);