import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", { email, password });
      const { user, message } = res.data;

      alert(message);

      const normalizedRole = (user?.role || "").toString().trim().toLowerCase();

      localStorage.setItem("user", JSON.stringify({ ...user, role: normalizedRole }));
      localStorage.setItem("role", normalizedRole);

      setTimeout(() => {
        if (normalizedRole === "admin") navigate("/admin/dashboard");
        else if (normalizedRole === "faculty") navigate("/dashboard");
        else navigate("/signin");
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f0f5] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hello Again!</h2>
          <p className="text-sm text-gray-500">Log into your account</p>
        </div>

        {error && <div className="text-red-500 text-center text-sm mb-3">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition duration-200"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
