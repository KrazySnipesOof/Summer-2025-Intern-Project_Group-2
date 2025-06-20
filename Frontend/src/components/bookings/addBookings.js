import React, { useEffect, useState } from "react";
import { Container, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";

import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import SelfBooking from "./bookingForm";
import * as bookingService from "../../services/bookingServices";
import "./bookingForm.scss";

const AddBookings = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);

  const [selectName, setSelectName] = useState([]);
  const [emailElement, setEmailElement] = useState("");
  const [customerId, setCustomerId] = useState("");

  const getServices = async () => {
    try {
      const response = await bookingService.getServices(reduxToken);
      if (response.status !== 200) {
        console.error("Error fetching services");
      }
    } catch (error) {
      console.error("Error fetching services", error);
    }
  };

  const emailFunc = async () => {
    try {
      const res = await bookingService.getCustomerDetails(emailElement?.[0]?.email);
      if (res.data.code === 200) {
        setCustomerId(res.data.data[0]?._id);
      } else {
        console.error("Error fetching customer details");
      }
    } catch (error) {
      console.error("Error fetching customer details", error);
    }
  };

  const nameFun = async () => {
    try {
      const resp = await bookingService.searchEmailWithName(selectName);
      if (resp.data.code === 200) {
        // You can set the data to state or do something else with it if needed
        const response = resp.data.data;
      } else {
        console.error("Error searching for name and email");
      }
    } catch (error) {
      console.error("Error searching for name and email", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getServices();
  }, [reduxToken]);

  useEffect(() => {
    if (emailElement) {
      emailFunc();
    }
  }, [emailElement, selectName]);

  useEffect(() => {
    nameFun();
  }, [selectName]);

  return (
    <>
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
            <div className="layout-content-wrapper booking-layout gg">
              <div>
                <div className="main-heading">
                  <h1>Add Booking</h1>
                  <p>Fill the following fields to add a booking</p>
                </div>
                <div className="bookingform-wrapper addbooking-fwr">
                  <div className="addbooking-form">
                    <SelfBooking />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AddBookings;
