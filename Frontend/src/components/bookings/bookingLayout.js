import React, {useEffect } from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import BookingRevenue from "./bookingRevenue";
const BookingLayout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <div className="breadcurm-bar">
            <div className="bdbar-box">
              <h2>
                <b>My Bookings</b>
              </h2>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <MdHome />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Bookings</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="layout-content-wrapper booking-layout">
            <BookingRevenue />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default BookingLayout;
