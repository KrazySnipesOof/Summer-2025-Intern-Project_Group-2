import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const auth = localStorage.getItem("front_user_token");
  const paymentstatus = JSON.parse(localStorage.getItem("permissionDashboard"));
  return auth ? (
    paymentstatus?.paymentStatus == "0" && !paymentstatus?.withEnterprise ? (
      <Navigate to={`/Pricing/${paymentstatus?._id}`} />
    ) : (
      <Navigate to="/dashboard" />
    )
  ) : (
    children
  );
}

export default ProtectedRoutes;
