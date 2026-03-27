import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TeacherCredential from "../models/TeacherCredential.js";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/teachers/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    let teacher = await TeacherCredential.findOne({
      username: username.toLowerCase(),
    });

    // auto create demo teacher if not exists
    if (!teacher && username === "teacher1" && password === "password123") {
      const hash = await bcrypt.hash("password123", 10);
      teacher = await TeacherCredential.create({
        username: "teacher1",
        passwordHash: hash,
        name: "Demo Teacher",
        email: "demo.teacher@college.edu",
      });
    }

    if (!teacher) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, teacher.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // find or create a User record for this teacher
    let user = await User.findOne({ email: teacher.email });
    if (!user) {
      user = await User.create({
        name: teacher.name,
        email: teacher.email,
        role: "teacher",
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      teacher: {
        id: teacher._id,
        username: teacher.username,
        name: teacher.name,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error("Teacher login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// POST /api/teachers/create
router.post("/create", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    const existing = await TeacherCredential.findOne({
      username: username.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await TeacherCredential.create({
      username: username.toLowerCase(),
      passwordHash,
      name,
      email,
    });

    res.status(201).json({
      id: teacher._id,
      username: teacher.username,
      name: teacher.name,
      email: teacher.email,
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

export default router;