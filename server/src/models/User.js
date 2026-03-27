import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "member", "teacher"],
      default: "user",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    // for OTP email auth
    otpCode: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);