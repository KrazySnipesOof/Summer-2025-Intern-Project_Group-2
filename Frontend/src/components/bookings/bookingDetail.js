import React, { useEffect } from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router";
import BookingList from "./bookingList";
const BookingDetail = () => {
  const navigate = useNavigate();
  const handleClick = (()=>{
navigate(`/booking`);
  })
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
                <b>Bookings</b>
              </h2>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <MdHome onClick={() => handleClick()} />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Booking Details</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="layout-content-wrapper booking-detail">
            <BookingList/>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default BookingDetail;
