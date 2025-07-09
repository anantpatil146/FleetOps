// routes/auth.js
import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
// routes/auth.js
router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/login", loginAdmin);

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Registering user:", email);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    const token = jwt.sign({ _id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // ✅ Send token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
   res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: false, // true if HTTPS
    
  });
  res.status(200).json({ message: "Logged out successfully" });
});
// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});


export default router;
