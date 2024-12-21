import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requireFaculty: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireFaculty }) => {
  const isFaculty = localStorage.getItem("is_faculty");
  console.log("protectedroute is faculty",isFaculty)

  if (requireFaculty && isFaculty=="False") {
    return <Navigate to="/student/exam" />;
  }

  if (!requireFaculty && isFaculty=="True") {
    return <Navigate to="/app/set-exam" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
