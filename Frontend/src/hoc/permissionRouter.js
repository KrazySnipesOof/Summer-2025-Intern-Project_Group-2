import React , { useEffect, useState }  from "react";
import { Navigate ,useLocation } from "react-router-dom";
import { GetUserByID } from "../services/userServices";
function PermissionRouter({ children }) {
const user_id = localStorage.getItem("front_user_id");
const location = useLocation();
const currentPath = location.pathname;
const [staffData, setStaffdata] = useState([]);
const [onGoing, setOngoing] = useState(true);
const [Permission, setPermission] = useState({});
const getUserdata = async (user_id) => {
  const res = await GetUserByID(user_id);
    if (res) {
        setStaffdata(res?.data)
        setPermission(res?.data?.permission)
              }
  };
useEffect(() => {
if(user_id != ""){
    getUserdata(user_id);
}
  }, [user_id]);

  useEffect(() => {
  if(currentPath == "/clients"){
    if (Permission?.users != true ){
      setOngoing(false)
    }
  }    
  if(currentPath == "/Goals"){
    if (Permission?.goals != true ){
      setOngoing(false)
    }
  }  
  if(currentPath == "/Inventory"){
    if (Permission?.inventory != true ){
      setOngoing(false)
    }
  }   
  if(currentPath == "/booking"){
    if (Permission?.bookings != true ){
      setOngoing(false)
    }
  }  
  if(currentPath == "/report"){
    if (Permission?.report != true ){
      setOngoing(false)
    }
  }  
  if(currentPath == "/Calendar"){
    if (Permission.calender != true ){
      setOngoing(false)
    }
  }  
  if(currentPath == "/setting"){
    if (Permission.settings != true ){
      setOngoing(false)
    }
  }  
  
  if(currentPath == "/payments"){
    if (Permission.payment != true ){
      setOngoing(false)
    }
  } 
  }, []);

  return onGoing == true ? children : <Navigate to="/" />;
}
export default PermissionRouter;

