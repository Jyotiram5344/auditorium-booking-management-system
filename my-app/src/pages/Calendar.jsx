import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../Component/Sidebar";
import { Menu } from "lucide-react";

const Calendar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hallName = location.state?.hallName || "Hall";
  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState({});
  const today = dayjs();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch hall-specific accepted bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookingsByHall/${hallName}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();

        const bookingMap = {};

        data.forEach((b) => {
          const start = dayjs(b.startDate);
          const end = dayjs(b.endDate);
          const slotType = b.slot?.toLowerCase();
          let d = start;

          while (d.isBefore(end.add(1, "day"))) {
            const key = d.format("YYYY-MM-DD");
            if (!bookingMap[key]) bookingMap[key] = { morning: false, evening: false, full: false };

            if (slotType === "full day") bookingMap[key].full = true;
            else if (slotType === "morning") bookingMap[key].morning = true;
            else if (slotType === "evening") bookingMap[key].evening = true;

            d = d.add(1, "day");
          }
        });

        setBookings(bookingMap);
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [hallName, API_BASE_URL]);

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  // ✅ Disable clicking on fully booked or past dates
  const handleDateClick = (day) => {
    const date = currentDate.date(day);
    if (date.isBefore(today, "day")) return;

    const dateKey = date.format("YYYY-MM-DD");
    const booking = bookings[dateKey];

    if (booking && booking.full) {
      alert("❌ This date is already fully booked.");
      return;
    }

    setSelectedDate(date);
    setShowModal(true);
  };

  const handleBook = () => {
    if (!selectedDate) return;
    setShowModal(false);
    navigate("/book", {
      state: { date: selectedDate.format("YYYY-MM-DD"), hallName },
    });
  };

  const getSlotStatus = (date) => {
    const key = date.format("YYYY-MM-DD");
    return bookings[key] || { morning: false, evening: false, full: false };
  };

  const renderDayCircle = (dateString, dateObj) => {
    const booking = bookings[dateString];
    const isPast = dateObj.isBefore(today, "day");
    const isSelected = selectedDate && dateObj.isSame(selectedDate, "day");

    if (isPast)
      return "bg-gray-300 text-gray-600 cursor-not-allowed";

    if (!booking)
      return `bg-green-500 text-white ${isSelected ? "ring-4 ring-purple-400" : ""}`;

    if (booking.full)
      return `bg-red-600 text-white cursor-not-allowed ${isSelected ? "ring-4 ring-purple-400" : ""}`;

    if (booking.morning && !booking.evening)
      return `bg-gradient-to-b from-red-600 to-green-500 text-white ${isSelected ? "ring-4 ring-purple-400" : ""}`;

    if (!booking.morning && booking.evening)
      return `bg-gradient-to-t from-green-500 to-red-600 text-white ${isSelected ? "ring-4 ring-purple-400" : ""}`;

    if (booking.morning && booking.evening)
      return `bg-red-600 text-white cursor-not-allowed ${isSelected ? "ring-4 ring-purple-400" : ""}`;

    return `bg-green-500 text-white ${isSelected ? "ring-4 ring-purple-400" : ""}`;
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-pink-300 text-purple-800 py-3 px-4 shadow">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-pink-200 rounded-full">
          <Menu size={24} />
        </button>
        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          {hallName} — Calendar
        </h1>
        <div className="w-6"></div>
      </div>

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
              className="fixed top-0 left-0 z-50 h-full"
            >
              <Sidebar user={user || { name: "Guest" }} onSignOut={handleSignOut} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Month Navigation */}
      <div className="flex justify-between px-8 py-4 items-center">
        <button onClick={prevMonth} className="text-purple-800 text-2xl hover:text-purple-600">‹</button>
        <h2 className="text-xl font-bold text-purple-800">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={nextMonth} className="text-purple-800 text-2xl hover:text-purple-600">›</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium py-2">{d}</div>
        ))}

        {[...Array(startDay)].map((_, i) => <div key={"empty" + i}></div>)}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const date = currentDate.date(day);
          const dateString = date.format("YYYY-MM-DD");
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`m-2 w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-150 ${renderDayCircle(dateString, date)}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">
              Slot Availability — {selectedDate.format("DD MMM YYYY")}
            </h3>

            {(() => {
              const { morning, evening, full } = getSlotStatus(selectedDate);
              const allBooked = full || (morning && evening);

              return (
                <>
                  <p className={`font-medium ${morning ? "text-red-600" : "text-green-600"}`}>
                    🌅 Morning Slot: {morning ? "Booked" : "Available"}
                  </p>
                  <p className={`font-medium ${evening ? "text-red-600" : "text-green-600"}`}>
                    🌇 Evening Slot: {evening ? "Booked" : "Available"}
                  </p>
                  <p className={`font-medium ${full ? "text-red-600" : "text-green-600"}`}>
                    🌞 Full Day: {full ? "Booked" : "Available"}
                  </p>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleBook}
                      disabled={allBooked}
                      className={`px-6 py-2 rounded-full transition ${
                        allBooked
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {allBooked ? "Already Booked" : "Book"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
