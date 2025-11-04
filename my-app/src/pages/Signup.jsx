// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
  });

  const departments = [
    "Computer Engineering",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "AI & DS",
  ];

  const roles = ["Faculty", "Admin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/api/auth/signup", formData);
      alert(res.data.message || "Signup successful!");
      
      // Reset form after alert confirmation
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        role: "",
      });

    } catch (err) {
      alert("Error creating account. Try again!");

      // Reset form after alert confirmation
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        role: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 border border-purple-300">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Logo"
            className="w-20 h-20 mb-2"
          />
          <h2 className="text-2xl font-bold text-purple-700">Nice to Meet You!</h2>
          <p className="text-gray-500">Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            className="w-full border rounded-full p-3 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            className="w-full border rounded-full p-3 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            className="w-full border rounded-full p-3 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            className="w-full border rounded-full p-3 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          />

          <select
            name="department"
            value={formData.department}
            className="w-full border rounded-full p-3 border-purple-400 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            name="role"
            value={formData.role}
            className="w-full border rounded-full p-3 border-purple-400 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-full transition"
          >
            Create My Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-purple-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
