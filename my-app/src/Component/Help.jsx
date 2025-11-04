import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Linkedin,
  Menu,
  Phone,
  Globe,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import Sidebar from "../Component/Sidebar";

const Help = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const contacts = [
    {
      name: "KBP College Support",
      email: "kbpcollegehelp@gmail.com",
      phone: "+91 98765 43210",
      website: "https://www.kbpcollege.edu.in",
      linkedin: "https://linkedin.com/in/kbpcollege",
      twitter: "https://twitter.com/kbpcollege",
      facebook: "https://facebook.com/kbpcollege",
      instagram: "https://instagram.com/kbpcollege",
    },
    {
      name: "Auditorium Technical Helpdesk",
      email: "auditorium.support@kbpcollege.edu.in",
      phone: "+91 91234 56789",
      website: "https://www.kbpcollege.edu.in/auditorium",
      linkedin: "https://linkedin.com/in/auditorium-support",
      twitter: "https://twitter.com/kbp_auditorium",
      facebook: "https://facebook.com/kbp.auditorium",
      instagram: "https://instagram.com/kbp_auditorium",
    },
    
  ];

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
            Help & Contact
          </h1>
          <div className="w-6" />
        </header>

        {/* Contact Section */}
        <main className="p-8 max-w-6xl mx-auto">
          <p className="text-center text-gray-700 mb-8 text-lg">
            Need help? Contact our support or technical staff using the details below.
          </p>

          {/* Cards in Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contacts.map((contact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 flex flex-col justify-between"
              >
                <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center">
                  {contact.name}
                </h2>

                <div className="space-y-3 text-base text-gray-700">
                  {/* Email */}
                  <div className="flex items-center gap-3 text-blue-600">
                    <Mail size={18} />
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 text-blue-600">
                    <Phone size={18} />
                    <a href={`tel:${contact.phone}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-3 text-blue-600">
                    <Globe size={18} />
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-6 mt-5">
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:scale-110 transition"
                    >
                      <Linkedin size={22} />
                    </a>
                    <a
                      href={contact.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:scale-110 transition"
                    >
                      <Twitter size={22} />
                    </a>
                    <a
                      href={contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <Facebook size={22} />
                    </a>
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:scale-110 transition"
                    >
                      <Instagram size={22} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
