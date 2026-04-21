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
});

export default mongoose.model("User", userSchema);