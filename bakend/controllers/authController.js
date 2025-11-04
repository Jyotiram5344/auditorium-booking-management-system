// controllers/authController.js
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, department, role } = req.body;
    if (!username || !email || !password || !department || !role)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      department,
      role
    });

    res.json({ message: "Account created successfully!", user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // NOTE: For now return user object. You can add JWT generation here.
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
