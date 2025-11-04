// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsForReport,
  getByFaculty,
  updateStatus,
  updateSeen,
  bookingsByHall
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", createBooking);
router.get("/allbookings", getAllBookings);
router.get("/bookings", getBookingsForReport);
router.get("/mybookings/:facultyName", getByFaculty);
router.put("/updateStatus/:id", updateStatus);
router.put("/updateSeen/:id", updateSeen);
router.get("/bookingsByHall/:hallName", bookingsByHall);

export default router;
