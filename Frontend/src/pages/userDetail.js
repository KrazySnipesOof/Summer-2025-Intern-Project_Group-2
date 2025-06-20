import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import UserDetail from "../components/users/userDetail/userDetail";
const UsersDetail = ({notificationCount,setNotificationCount}) => {
  return (
    <>
     <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <UserDetail />
      <Footer />
    </>
  );
};

export default UsersDetail;
