import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedRole = localStorage.getItem("role")?.toLowerCase();

  // If missing user or role → go to signin
  if (!storedUser || !storedRole) {
    return <Navigate to="/signin" replace />;
  }

  // If role not allowed → go to 404
  if (!allowedRoles.includes(storedRole)) {
    return <Navigate to="/404" replace />;
  }

  // ✅ Allowed → show page
  return children;
}
