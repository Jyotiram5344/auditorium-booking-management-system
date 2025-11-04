import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Sidebar from "../Component/Sidebar";

const MyBooking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const facultyName = storedUser?.username || storedUser?.facultyName || null;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!facultyName) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/mybookings/${facultyName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setBookings(sortedData);
      })
      .catch((err) => console.error("❌ Error fetching bookings:", err))
      .finally(() => setLoading(false));
  }, [facultyName, API_BASE_URL]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden">
      {/* Sidebar Animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 z-50 h-full"
            >
              <Sidebar
                user={storedUser || { username: "Guest", email: "guest@example.com" }}
                onSignOut={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col backdrop-blur-sm bg-white/30">
        {/* Header */}
        <header className="flex items-center justify-between bg-gradient-to-r from-purple-400 to-pink-400 py-4 px-6 shadow-lg">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-white" size={28} />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
            My Bookings
          </h1>
          <div className="w-6" />
        </header>

        {/* Booking List */}
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center col-span-full mt-20 text-purple-700 font-medium text-lg">
              Loading your bookings...
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <motion.div
                key={booking.id || booking._id}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative bg-white/70 backdrop-blur-md border border-purple-200 rounded-2xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      booking.status === "Approved"
                        ? "bg-green-500 text-white"
                        : booking.status === "Rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-gray-800"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-purple-800 mb-2">
                  {booking.eventName || "Untitled Event"}
                </h2>
                <p className="text-sm text-gray-700">
                  <strong>Hall:</strong> {booking.hallName || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Department:</strong> {booking.department || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Start:</strong>{" "}
                  {new Date(booking.startDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>End:</strong>{" "}
                  {new Date(booking.endDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Slot:</strong> {booking.slot || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Speaker:</strong> {booking.speaker || "N/A"}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-purple-700 font-medium text-lg col-span-full mt-20">
              No bookings found under your name.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyBooking;
