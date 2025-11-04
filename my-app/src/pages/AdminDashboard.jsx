import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../Component/Sidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    username: "Admin",
    email: "admin@college.edu",
    role: "admin",
  };

  return (
    <div className="flex min-h-screen bg-[#f8f0f5] overflow-hidden">
      {/* Sidebar Animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 z-50 h-full"
            >
              <Sidebar user={storedUser} onSignOut={() => alert("Signed Out")} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-pink-200 py-4 px-6 shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-purple-800" size={26} />
          </button>
          <h1 className="text-lg font-medium text-purple-900">Admin Dashboard</h1>
          <div className="w-6" />
        </header>

        {/* Dashboard content */}
        <main className="flex-grow flex justify-center items-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100"
          >
            <img
                src="/collegeimg.jpeg" // ✅ Image path: just "public/collegeimg.jpeg"
                alt="College Campus"
                className="rounded-2xl w-full max-w-5xl h-[550px] object-cover shadow-lg"
                />

          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
