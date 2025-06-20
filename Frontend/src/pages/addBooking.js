import React from "react";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import AddBookingForm from "../components/bookings/addBookings";
const Booking = ({notificationCount,setNotificationCount}) => {
  return (
    <>
       <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <AddBookingForm />
      <Footer />
    </>
  );
};

export default Booking;
