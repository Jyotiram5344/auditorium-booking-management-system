import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Component/Sidebar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Get logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const halls = [
    {
      id: 1,
      name: "Central Auditorium",
      location: "KBP College of Engineering, Satara",
      image: "https://sipnaengg.ac.in/wp-content/uploads/2021/09/Audi-5.jpeg",
    },
    {
      id: 2,
      name: "Digital Classroom",
      location: "KBP College of Engineering, Satara",
      image:
        "https://www.furkatingcollege.edu.in/wp-content/uploads/2020/01/DOC-20190403-WA0018-e1579802533854-1024x638.jpg",
    },
    {
      id: 3,
      name: "Seminar Hall",
      location: "KBP College of Engineering, Satara",
      image: "https://www.carmelcet.in/images/facilities/Seminar-Hall.jpg",
    },
    {
      id: 4,
      name: "AI Lab",
      location: "KBP College of Engineering, Satara",
      image: "https://iebmedia.com/wp-content/uploads/2022/01/MitsDMA915_pic1.jpg",
    },
  ];

  const handleCardClick = (hall) => {
    navigate("/calendar", { state: { hallName: hall.name } });
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="flex min-h-screen bg-[#f8f0f5] overflow-hidden">
      {/* Sidebar with Animation */}
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
                user={user || { name: "Guest", email: "guest@example.com" }}
                onSignOut={handleSignOut}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* App Bar */}
        <header className="flex items-center justify-between bg-pink-200 py-4 px-6 shadow-md">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-purple-800" size={26} />
          </button>
          <h1
            onClick={() => setCurrentPage("Home")}
            className="text-lg font-medium text-purple-900 cursor-pointer select-none"
          >
            {currentPage}
          </h1>
          <div className="text-sm text-purple-900 font-medium">
            {user?.department || ""}
          </div>
        </header>

        {/* Auditorium Cards */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {halls.map((hall) => (
            <motion.div
              key={hall.id}
              onClick={() => handleCardClick(hall)}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-xl font-semibold">{hall.name}</h2>
                  <p className="text-sm opacity-80">📍 {hall.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
