import React from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import CalenderApp from "./calendarForm";
const Calenderlayout = () => {
  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <div className="breadcurm-bar">
            <div className="bdbar-box">
              <h2>
                <b>Calendar</b>
              </h2>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <MdHome />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Calendar</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="layout-content-wrapper booking-layout">
            <div className="main-heading">
              <h1>Bookings Calendar</h1>
            </div>
            <CalenderApp />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Calenderlayout;
