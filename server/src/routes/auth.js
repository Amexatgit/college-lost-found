import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpEmail } from "../lib/email.js";

const router = express.Router();

// generate a 6 digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// generate JWT
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // upsert user
    await User.findOneAndUpdate(
      { email },
      { email, otpCode: otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (user.otpCode !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "Code has expired" });
    }

    // clear OTP after successful verify
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAnonymous: user.isAnonymous,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// POST /api/auth/guest
router.post("/guest", async (req, res) => {
  try {
    const guestUser = await User.create({
      isAnonymous: true,
      role: "user",
    });

    const token = generateToken(guestUser._id);

    res.json({
      token,
      user: {
        id: guestUser._id,
        isAnonymous: true,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Guest login error:", error);
    res.status(500).json({ message: "Guest login failed" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-otpCode -otpExpiresAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isAnonymous: user.isAnonymous,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;