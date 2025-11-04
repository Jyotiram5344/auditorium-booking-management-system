import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Loader2, Menu } from "lucide-react";
import Sidebar from "../Component/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const AdminFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch all faculty users
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      setFacultyList(data);
    } catch (err) {
      console.error("❌ Error fetching faculties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // ✅ Delete faculty by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/users/${id}`, { method: "DELETE" });
      setFacultyList((prev) => prev.filter((f) => f._id !== id));
      alert("✅ Faculty deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting faculty:", err);
    }
  };

  // ✅ Open edit modal
  const handleEdit = (faculty) => setEditingUser(faculty);

  // ✅ Update faculty
  const handleUpdate = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      alert("✅ Profile updated successfully!");
      setEditingUser(null);
      fetchFaculties();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ Update failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* ✅ Sidebar Animation */}
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
                user={JSON.parse(localStorage.getItem("user"))}
                onSignOut={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Main Section */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between bg-pink-200 py-4 px-6 shadow-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-lg shadow hover:bg-purple-100 transition"
          >
            <Menu className="text-purple-800" />
          </button>

          <h1 className="text-lg md:text-2xl font-bold text-purple-800 text-center flex-1">
            👩‍🏫 Manage Faculty / Admin Profiles
          </h1>
          <div className="w-6" />
        </header>

        {/* ✅ Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center mt-20 text-gray-600">
            <Loader2 className="animate-spin mr-2" /> Loading faculties...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {facultyList.map((faculty) => (
              <motion.div
                key={faculty._id}
                className="bg-white rounded-2xl shadow-lg p-5 border border-purple-100 hover:shadow-xl transition relative"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-purple-700 capitalize">
                    {faculty.username}
                  </h2>
                  <div className="flex gap-3">
                    <Pencil
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleEdit(faculty)}
                      size={20}
                    />
                    <Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDelete(faculty._id)}
                      size={20}
                    />
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm">
                  <strong>Email:</strong> {faculty.email}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Department:</strong> {faculty.department}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Role:</strong> {faculty.role}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Joined:{" "}
                  {faculty.createdAt
                    ? new Date(faculty.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ✅ Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
              <h2 className="text-lg font-bold text-purple-800 mb-4">
                ✏️ Edit Faculty Profile
              </h2>

              <label className="block mb-2 text-sm">Username</label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 mb-3"
              />

              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 mb-3"
              />

              <label className="block mb-2 text-sm">Department</label>
              <input
                type="text"
                value={editingUser.department}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    department: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaculty;
