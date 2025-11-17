import React from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo, isAuthenticated } from "../api/authApi";
import type { UserInfo } from "../api/authApi";

type Role = UserInfo["role"];

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children: React.ReactNode; // 👈 FIX HERE
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserInfo();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
