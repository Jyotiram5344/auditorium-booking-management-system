// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";

// routers
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// connect database
await connectDB();

// use routes (namespaced similar to your previous design)
app.use("/api/auth", authRoutes);        // /api/auth/signup, /api/auth/login
app.use("/api/users", userRoutes);       // /api/users/...
app.use("/api", bookingRoutes);          // /api/book, /api/allbookings, etc.
app.use("/api", emailRoutes);            // /api/sendEmail

// health check
app.get("/", (req, res) => res.send("API running"));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
