import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const auth = localStorage.getItem("front_user_token");
  

  return auth ? children : <Navigate to="/" />;
}
export default PrivateRoutes;

