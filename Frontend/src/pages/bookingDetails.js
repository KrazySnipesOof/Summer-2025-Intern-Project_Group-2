import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import BookingDetail from "../components/bookings/bookingDetail";
const MyBookingDetail = ({notificationCount,setNotificationCount}) => {
  return (
    <>
      <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <BookingDetail />
      <Footer />
    </>
  );
};

export default MyBookingDetail;
