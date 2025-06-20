import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import EditBookingForm from "../components/bookings/editBookingForm";
const Booking = ({notificationCount,setNotificationCount}) => {
  return (
    <>
     <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <EditBookingForm />
      <Footer />
    </>
  );
};

export default Booking;
