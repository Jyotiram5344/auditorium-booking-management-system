// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, default: "Faculty" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
