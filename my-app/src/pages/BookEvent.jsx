import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Building2, User2, Home, Menu } from "lucide-react";
import dayjs from "dayjs";
import CalendarComponent from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Sidebar from "../Component/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

const BookEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const hallName = location.state?.hallName || "Not Selected";
  const selectedDate = location.state?.date || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStartCal, setShowStartCal] = useState(false);
  const [showEndCal, setShowEndCal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    hallName: hallName,
    facultyName: user?.username || "",
    department: user?.department || "",
    startDate: selectedDate || "",
    endDate: "",
    slot: "",
    speaker: "",
    attendees: "",
    collaboration: "",
    description: "",
    status: "Pending",
    user_id: user?.id || "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Initialize only once (pre-fill form from user and props)
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        hallName: hallName,
        facultyName: user.username || "",
        department: user.department || "",
        startDate: selectedDate || "",
        user_id: user.id || "",
      }));
    }
  }, []); // run once only

  // ✅ Handle date selection (for start & end)
  const handleDateSelect = (name, value) => {
    const formatted = dayjs(value).format("YYYY-MM-DD");
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    if (name === "startDate") setShowStartCal(false);
    else setShowEndCal(false);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit booking request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.eventName || !formData.slot || !formData.startDate) {
      alert("Please fill out all required fields before submitting.");
      return;
    }

    if (
      formData.endDate &&
      dayjs(formData.endDate).isBefore(dayjs(formData.startDate))
    ) {
      alert("End date cannot be before start date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message || "✅ Booking submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert("❌ Failed to submit booking. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-pink-300 text-purple-800 py-3 px-4 shadow">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-pink-200 rounded-full"
        >
          <Menu size={24} />
        </button>

        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Book Event — {hallName}
        </h1>

        <div className="w-6"></div>
      </div>

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
                user={user || { username: "Guest", email: "guest@example.com" }}
                onSignOut={handleSignOut}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Booking Form */}
      <div className="flex justify-center items-center flex-1 bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-[#f9f2f9] w-[420px] sm:w-[500px] rounded-3xl shadow-xl p-8 text-purple-900 relative"
        >
          <h2 className="text-center text-2xl font-bold mb-6">Book Event</h2>

          {/* Hall Name */}
          <div className="flex items-center border-2 border-purple-400 rounded-full px-3 py-2 mb-4">
            <Home className="text-purple-600 mr-2" size={20} />
            <input
              type="text"
              name="hallName"
              value={formData.hallName}
              readOnly
              className="flex-1 bg-transparent outline-none text-purple-700"
            />
          </div>

          {/* Faculty Name */}
          <div className="flex items-center border-2 border-purple-400 rounded-full px-3 py-2 mb-4">
            <User2 className="text-purple-600 mr-2" size={20} />
            <input
              type="text"
              name="facultyName"
              value={formData.facultyName}
              readOnly
              className="flex-1 bg-transparent outline-none text-purple-700"
            />
          </div>

          {/* Department */}
          <div className="flex items-center border-2 border-purple-400 rounded-full px-3 py-2 mb-4">
            <Building2 className="text-purple-600 mr-2" size={20} />
            <input
              type="text"
              name="department"
              value={formData.department}
              readOnly
              className="flex-1 bg-transparent outline-none text-purple-700"
            />
          </div>

          {/* Event Name */}
          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={handleChange}
            className="w-full border-2 border-purple-400 rounded-full px-4 py-2 mb-4 outline-none"
            required
          />

          {/* Start Date */}
          <div className="relative mb-4">
            <label className="block font-semibold mb-2">Start Date</label>
            <div
              className="flex items-center justify-between border-2 border-purple-400 rounded-full px-4 py-2 cursor-pointer"
              onClick={() => setShowStartCal(!showStartCal)}
            >
              <span>{formData.startDate || "Select start date"}</span>
              <Calendar className="text-purple-700" size={20} />
            </div>
            {showStartCal && (
              <div className="absolute mt-2 z-20 bg-white p-3 rounded-xl shadow-lg">
                <CalendarComponent
                  onChange={(value) => handleDateSelect("startDate", value)}
                  value={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : new Date()
                  }
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="relative mb-4">
            <label className="block font-semibold mb-2">End Date</label>
            <div
              className="flex items-center justify-between border-2 border-purple-400 rounded-full px-4 py-2 cursor-pointer"
              onClick={() => setShowEndCal(!showEndCal)}
            >
              <span>{formData.endDate || "Select end date"}</span>
              <Calendar className="text-purple-700" size={20} />
            </div>
            {showEndCal && (
              <div className="absolute mt-2 z-20 bg-white p-3 rounded-xl shadow-lg">
                <CalendarComponent
                  onChange={(value) => handleDateSelect("endDate", value)}
                  value={
                    formData.endDate ? new Date(formData.endDate) : new Date()
                  }
                  minDate={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : new Date()
                  }
                />
              </div>
            )}
          </div>

          {/* Slot */}
          <label className="text-sm font-medium mb-1">Select Slot</label>
          <div className="flex items-center border-2 border-purple-400 rounded-full px-3 py-2 mb-4">
            <Calendar className="text-purple-600 mr-2" size={20} />
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-purple-700"
              required
            >
              <option value="">Choose slot</option>
              <option value="Morning">Morning (9 AM - 12 PM)</option>
              <option value="Evening">Evening (5 PM - 8 PM)</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          {/* Other Inputs */}
          <input
            type="text"
            name="speaker"
            placeholder="Speaker"
            value={formData.speaker}
            onChange={handleChange}
            className="w-full border-2 border-purple-400 rounded-full px-4 py-2 mb-4 outline-none"
          />

          <input
            type="text"
            name="attendees"
            placeholder="Attendees"
            value={formData.attendees}
            onChange={handleChange}
            className="w-full border-2 border-purple-400 rounded-full px-4 py-2 mb-4 outline-none"
          />

          <input
            type="text"
            name="collaboration"
            placeholder="Collaboration (Optional)"
            value={formData.collaboration}
            onChange={handleChange}
            className="w-full border-2 border-purple-400 rounded-full px-4 py-2 mb-4 outline-none"
          />

          <textarea
            name="description"
            placeholder="Enter the event description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border-2 border-purple-400 rounded-2xl px-4 py-2 h-28 mb-4 outline-none"
          />

          <div className="flex items-center border-2 border-purple-400 rounded-full px-3 py-2 mb-6 bg-purple-100">
            <span className="font-semibold text-purple-700">Status:</span>
            <span className="ml-3 text-purple-800">{formData.status}</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-full transition-all ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-purple-700 hover:bg-purple-800 text-white"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-300 text-purple-800 py-3 rounded-full hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEvent;
