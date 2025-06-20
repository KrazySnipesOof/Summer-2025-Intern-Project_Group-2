import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import NotificationLayout from "../components/notification/notificationLayout";
const Notification = ({notificationCount,setNotificationCount}) => {
  return (
    <>
     <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <NotificationLayout />
      <Footer />
    </>
  );
};

export default Notification;
