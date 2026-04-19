import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    service: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["info", "error", "warning"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

logSchema.index({ user: 1, createdAt: -1 });
logSchema.index({ user: 1, service: 1, createdAt: -1 });
logSchema.index({ user: 1, level: 1, createdAt: -1 });
logSchema.index({ user: 1, service: 1, level: 1, createdAt: -1 });
// TTL index for automated data cleanup after 7 days (604800 seconds)
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const Log = mongoose.model("Log", logSchema);

export default Log;
