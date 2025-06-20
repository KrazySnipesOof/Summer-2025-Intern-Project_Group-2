import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import UserLayout from "../components/users/userLayout";
const Users = ({notificationCount,setNotificationCount}) => {
  return (
    <>
       <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <UserLayout />
      <Footer />
    </>
  );
};

export default Users;
