// models/Booking.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  hallName: { type: String, required: true },
  facultyName: { type: String, required: true },
  department: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  slot: { type: String },
  speaker: { type: String },
  attendees: { type: String },
  collaboration: { type: String },
  description: { type: String },
  status: { type: String, default: "Pending" }, // Pending/Accepted/Rejected
  seen: { type: Boolean, default: false },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", BookingSchema);
