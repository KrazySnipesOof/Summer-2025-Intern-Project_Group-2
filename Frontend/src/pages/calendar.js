import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import Calenderlayout from "../components/fullCalendar/calendarLayout";
const Calenderfull = ({notificationCount,setNotificationCount}) => {
  return (
    <>
       <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <Calenderlayout />
      <Footer />
    </>
  );
};

export default Calenderfull;
