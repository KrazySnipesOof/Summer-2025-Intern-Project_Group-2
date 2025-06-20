import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import Settinglayout from "../components/settings/settingLayout";
const Settings = ({notificationCount,setNotificationCount}) => {
  return (
    <>
     <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <Settinglayout />
      <Footer />
    </>
  );
};

export default Settings;
