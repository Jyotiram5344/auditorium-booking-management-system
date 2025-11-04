import React from "react";
import {
  Calendar,
  BarChart,
  HelpCircle,
  Info,
  LogOut,
  HomeIcon,
  Users,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem("role") || "faculty";

  const handleNavigate = (path) => navigate(path);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  // Faculty Menu
  const facultyMenu = [
    { icon: <HomeIcon size={20} />, label: "Home", path: "/dashboard" },
    { icon: <Calendar size={20} />, label: "My Bookings", path: "/mybookings" },
    { icon: <BarChart size={20} />, label: "Report", path: "/report" },
    { icon: <HelpCircle size={20} />, label: "FAQs", path: "/faqs" },
    { icon: <Info size={20} />, label: "Help", path: "/help" },
  ];

  // Admin Menu
  const adminMenu = [
    { icon: <HomeIcon size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Manage Faculty/Admin", path: "/admin/faculty" },
    { icon: <ClipboardList size={20} />, label: "Booking Requests", path: "/admin/bookings" },
    { icon: <FileText size={20} />, label: "Reports", path: "/admin/reports" },
    { icon: <Info size={20} />, label: "Help", path: "/help" },
  ];

  const menuItems = role === "admin" ? adminMenu : facultyMenu;

  return (
    <div className="w-72 h-screen bg-white shadow-md rounded-r-2xl flex flex-col justify-between p-6">
      {/* Top section with user info */}
      <div>
        <div className="flex flex-col items-center border-b pb-6">
          <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center text-2xl font-semibold text-purple-800">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="mt-3 font-medium text-gray-800">
            {user?.username || "User"}
          </p>
          <p className="text-sm text-gray-500">
            {user?.email || "user@example.com"}
          </p>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-5 text-purple-900">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div
        onClick={handleSignOut}
        className="flex items-center gap-3 text-red-500 font-medium cursor-pointer hover:text-red-600"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </div>
    </div>
  );
};

// Reusable Sidebar Item
const SidebarItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 text-md font-medium cursor-pointer hover:text-purple-600 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
