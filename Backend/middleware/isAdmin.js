// middleware/isAdmin.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token; // ✅ Read from cookie

    if (!token) {
      return res.status(403).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default isAdmin;
