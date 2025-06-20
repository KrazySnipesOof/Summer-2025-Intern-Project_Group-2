import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import ReportLayout from "../components/myReport/reportLayout";
const MyReport = ({notificationCount,setNotificationCount}) => {
  return (
    <>
      <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <ReportLayout />
      <Footer />
    </>
  );
};

export default MyReport;