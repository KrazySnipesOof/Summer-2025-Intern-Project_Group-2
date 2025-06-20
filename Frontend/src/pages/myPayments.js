import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import BookingLayout from "../components/myPayments/bookingLayout";
const MyPayments = ({notificationCount,setNotificationCount}) => {
  return (
    <>
      <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <BookingLayout />
      <Footer />
    </>
  );
};

export default MyPayments;