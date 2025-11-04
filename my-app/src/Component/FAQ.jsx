import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import Sidebar from "../Component/Sidebar";

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const faqs = [
    {
      question: "How do I book an auditorium through the Venue Vista app?",
      answer:
        "To book an auditorium, log in to the app, navigate to the booking section, and select an available date and time slot. Complete the required booking details, and submit your request. You will receive a notification once the booking is approved by the admin.",
    },
    {
      question: "What are the available time slots for booking?",
      answer:
        "The auditorium can be booked for various time slots, including morning, afternoon, and full-day sessions. The availability of slots may vary depending on existing bookings and the type of event you plan to host.",
    },
    {
      question: "Can I modify or cancel a booking after it is approved?",
      answer:
        "Yes, you can request modifications or cancellations. However, approval is subject to admin review and the time remaining before the booked date. Cancellations within 24 hours of the event may incur restrictions based on college policies.",
    },
    {
      question: "Who can approve my booking request?",
      answer:
        "Only the admin can approve or reject your booking request after reviewing availability and event details.",
    },
    {
      question: "How can I check the status of my booking request?",
      answer:
        'You can view the status of your booking request in the “My Bookings” section of the app. Here, you can track whether your request is pending, approved, or declined, and receive notifications for any changes in status.',
    },
    {
      question: "Can I book the auditorium for recurring events?",
      answer:
        "Yes, the app allows you to schedule recurring bookings. When making a booking, select the recurring option and specify the frequency (e.g., weekly or monthly). The admin will approve each instance individually based on availability.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f0f5] overflow-hidden">
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
                user={
                  storedUser || { username: "Guest", email: "guest@example.com" }
                }
                onSignOut={() => alert("Signed Out")}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-pink-200 py-4 px-6 shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-purple-800" size={26} />
          </button>
          <h1 className="text-lg font-medium text-purple-900 cursor-pointer select-none">
            FAQs
          </h1>
          <div className="w-6" />
        </header>

        {/* FAQ Section */}
        <main className="p-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3 bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left p-4 bg-pink-50 hover:bg-pink-100 transition-colors duration-200"
              >
                <span className="text-gray-900 font-medium">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-purple-700" />
                ) : (
                  <ChevronDown className="text-purple-700" />
                )}
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 text-gray-700 text-sm bg-white"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default FAQ;
