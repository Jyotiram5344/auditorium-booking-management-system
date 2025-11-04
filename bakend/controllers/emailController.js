// controllers/emailController.js
import nodemailer from "nodemailer";
import User from "../models/User.js";

export const getAllFaculties = async (req, res) => {
  try {
    // If your model has a "role" or "userType" field to identify faculty
    // use: const faculties = await User.find({ role: "faculty" });
    const faculties = await User.find();

    res.status(200).json(faculties);
  } catch (err) {
    console.error("Error fetching faculties:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    console.log(" email route called");
    
    if (!to || !subject || !message) return res.status(400).json({ message: "Missing required fields" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message
    });
    console.log("Email sent:", info.messageId);
    console.log(" email route called");
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send email" });
    console.log(" email route called");
  }
};
