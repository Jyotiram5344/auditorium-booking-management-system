import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Sidebar from "../Component/Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminAllBooking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/allbookings`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      if (!bookingId) return alert("Invalid booking ID");

      const normalizedStatus = newStatus === "Approved" ? "Accepted" : newStatus;
      const res = await fetch(`${API_BASE_URL}/api/updateStatus/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: normalizedStatus }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      alert(data.message || `Booking ${normalizedStatus}`);
      fetchBookings();
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleSeenToggle = async (bookingId, currentSeen) => {
    try {
      if (!bookingId) return alert("Invalid booking ID");

      const newSeen = currentSeen ? 0 : 1;
      const res = await fetch(`${API_BASE_URL}/api/updateSeen/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seen: newSeen }),
      });

      if (!res.ok) throw new Error("Failed to update seen");
      await res.json();

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, seen: !!newSeen } : b))
      );
    } catch (err) {
      console.error("❌ Error updating seen:", err);
      alert("Failed to update seen status.");
    }
  };

  const handleSendMessage = async (booking) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/faculties`);
      const users = await res.json();
      const faculty = users.find((u) => u.username === booking.facultyName);

      if (!faculty || !faculty.email) {
        alert("Faculty email not found.");
        return;
      }

      const message = `
Dear ${booking.facultyName},

Your booking for the event "${booking.eventName}" has been processed.

📍 Hall: ${booking.hallName}
🗓️ Start Date: ${new Date(booking.startDate).toLocaleDateString("en-GB")}
🕓 End Date: ${new Date(booking.endDate).toLocaleDateString("en-GB")}
⏰ Slot: ${booking.slot}
🎤 Speaker: ${booking.speaker}
👥 Attendees: ${booking.attendees}
🤝 Collaboration: ${booking.collaboration}
📄 Status: ${booking.status}

Thank you,
Admin Team
`;

      const emailRes = await fetch(`${API_BASE_URL}/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: faculty.email,
          subject: `Booking Status Update - ${booking.eventName}`,
          message,
        }),
      });

      const result = await emailRes.json();
      alert(result.message || "✅ Message sent successfully!");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f0f5] overflow-hidden">
      {/* Sidebar */}
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
              className="fixed top-0 left-0 z-50 h-full w-64"
            >
              <Sidebar
                user={
                  storedUser || { username: "Admin", email: "admin@example.com" }
                }
                onSignOut={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/signin";
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-pink-200 py-4 px-4 md:px-6 shadow-md sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-md"
            aria-label="Toggle sidebar"
          >
            <Menu className="text-purple-800" size={26} />
          </button>
          <h1 className="text-lg font-semibold text-purple-900 select-none">
            All Bookings (Admin)
          </h1>
          <div className="w-6" />
        </header>

        {/* Booking Section */}
        <main className="p-4 md:p-6 overflow-auto">
          {loading ? (
            <div className="text-center mt-8 text-gray-600">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center mt-8 text-gray-600">
              No bookings found.
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-purple-100 text-purple-900 text-xs font-medium uppercase">
                    <tr>
                      <th className="px-3 py-2 border">Event</th>
                      <th className="px-3 py-2 border">Hall</th>
                      <th className="px-3 py-2 border">Faculty</th>
                      <th className="px-3 py-2 border">Department</th>
                      <th className="px-3 py-2 border">Start</th>
                      <th className="px-3 py-2 border">End</th>
                      <th className="px-3 py-2 border">Slot</th>
                      <th className="px-3 py-2 border">Speaker</th>
                      <th className="px-3 py-2 border">Status</th>
                      <th className="px-3 py-2 border">Seen</th>
                      <th className="px-3 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="hover:bg-purple-50">
                        <td className="px-3 py-2 border">{b.eventName}</td>
                        <td className="px-3 py-2 border">{b.hallName}</td>
                        <td className="px-3 py-2 border">{b.facultyName}</td>
                        <td className="px-3 py-2 border">{b.department}</td>
                        <td className="px-3 py-2 border">
                          {new Date(b.startDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-3 py-2 border">
                          {new Date(b.endDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-3 py-2 border">{b.slot}</td>
                        <td className="px-3 py-2 border">{b.speaker}</td>
                        <td className="px-3 py-2 border">
                          <span
                            className={`px-2 py-1 rounded-full text-white text-xs ${
                              b.status === "Accepted"
                                ? "bg-green-500"
                                : b.status === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 border">
                          <button
                            onClick={() => handleSeenToggle(b._id, b.seen)}
                            className={`px-2 py-1 rounded text-xs ${
                              b.seen
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {b.seen ? "Seen" : "Unseen"}
                          </button>
                        </td>
                        <td className="px-3 py-2 border space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(b._id, "Approved")}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, "Rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleSendMessage(b)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Send Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-lg shadow border p-4 text-sm"
                  >
                    <div className="font-semibold text-purple-800">
                      {b.eventName}
                    </div>
                    <div className="text-gray-700">
                      <p>
                        <b>Hall:</b> {b.hallName}
                      </p>
                      <p>
                        <b>Faculty:</b> {b.facultyName}
                      </p>
                      <p>
                        <b>Slot:</b> {b.slot}
                      </p>
                      <p>
                        <b>Start:</b>{" "}
                        {new Date(b.startDate).toLocaleDateString("en-GB")}
                      </p>
                      <p>
                        <b>End:</b>{" "}
                        {new Date(b.endDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusUpdate(b._id, "Approved")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(b._id, "Rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleSendMessage(b)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Message
                      </button>
                      <button
                        onClick={() => handleSeenToggle(b._id, b.seen)}
                        className={`px-3 py-1 rounded text-xs ${
                          b.seen
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {b.seen ? "Seen" : "Unseen"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminAllBooking;
