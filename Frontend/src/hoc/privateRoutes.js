import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const auth = localStorage.getItem("front_user_token");
  const paymentstatus = JSON.parse(localStorage.getItem("permissionDashboard"));
  return auth ? (
    paymentstatus?.paymentStatus == "0" && !paymentstatus?.withEnterprise ? (
      <Navigate to={`/Pricing/${paymentstatus?._id}`} />
    ) : (
      children
    )
  ) : (
    <Navigate to="/" />
  );
}
export default PrivateRoutes;
