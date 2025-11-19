import React from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../api/authApi"; // chỉnh path nếu khác

type Role = "Admin" | "Staff" | "CoOwner";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const user = getUserInfo();

  // Chưa đăng nhập → về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sai role → sang Permission
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/permission" replace />;
  }

  // Đúng role → cho vào
  return children;
};

export default ProtectedRoute;
