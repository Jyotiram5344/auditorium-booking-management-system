import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import BookEvent from "./pages/BookEvent";
import MyBooking from "./pages/MyBooking";
import Report from "./pages/Report";
import FAQ from "./Component/FAQ";
import Help from "./Component/Help";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAllBooking from "./pages/AdminAllBooking";
import AdminReport from "./pages/AdminReport";
import AdminFaculty from "./pages/AdminFaculty";
import ProtectedRoute from "./Component/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/signin" />} />

        {/* Auth */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Faculty routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <BookEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybookings"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <MyBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFaculty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReport />
            </ProtectedRoute>
          }
        />

        <Route path="/faqs" element={<FAQ />} />
        <Route path="/help" element={<Help />} />

        {/* 404 */}
        <Route
          path="/404"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-2xl font-semibold text-gray-700">
                404 — Page Not Found
              </h1>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}
