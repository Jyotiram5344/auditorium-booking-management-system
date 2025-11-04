// controllers/bookingController.js
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    const payload = req.body;
    const booking = await Booking.create(payload);
    res.json({ message: "Booking submitted successfully!", booking });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingsForReport = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.startDate = {};
      if (start) filter.startDate.$gte = new Date(start);
      if (end) filter.startDate.$lte = new Date(end);
    }
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getByFaculty = async (req, res) => {
  try {
    const facultyName = req.params.facultyName;
    const bookings = await Booking.find({ facultyName }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!bookingId || bookingId === "undefined") {
      return res.status(400).json({ message: "Booking ID is missing or invalid" });
    }

    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Status updated successfully", booking });
  } catch (err) {
    console.error("❌ updateStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSeen = async (req, res) => {
  try {
    const bookingId = req.params.id;

    if (!bookingId || bookingId === "undefined") {
      return res.status(400).json({ message: "Booking ID is missing or invalid" });
    }

    const { seen } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { seen }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: `Booking marked as ${seen ? "Seen" : "Unseen"}`, booking });
  } catch (err) {
    console.error("❌ updateSeen error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const bookingsByHall = async (req, res) => {
  try {
    const hallName = req.params.hallName;
    const bookings = await Booking.find({ hallName, status: "Accepted" }, "hallName startDate endDate slot status");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
