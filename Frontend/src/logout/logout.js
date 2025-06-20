import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const logOut = async () => {
    console.log("LLLLLLLLLLLLLLLLLLL")
    localStorage.removeItem("front_user_token");
    localStorage.removeItem("front_user_id");
    localStorage.removeItem("business_Type_id");  
    localStorage.removeItem("permissionDashboard");   

    navigate("/");
  };

  useEffect(() => {
    logOut();
  }, []);

  return(
    <>
    </>
  )
};

export default Logout;
