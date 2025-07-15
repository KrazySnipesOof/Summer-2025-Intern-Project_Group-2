import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { BsCheckCircleFill, BsCalendar3 } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import * as bookingService from "../../services/bookingServices";
import * as calenderService from "../../services/calenderServices";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { createNotification } from "../../helper/notification";
import moment from "moment";

import customericon from "../../assets/img/customer-service-icon.png";
const BookingList = (props) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const reduxToken = useSelector((state) => state?.auth?.token);
  useEffect(() => {
    getSchedule();
  }, [reduxToken]);
  const getSchedule = async () => {
    if (reduxToken) {
      const response = await calenderService.getBookingSchedule(reduxToken);
      if (response?.status === 200) {
        let data1 = response?.data?.data[0]?.scheduledData;
        const currentDate = new Date();
        const filteredArray = data1?.filter((obj) => {
          const startDate = new Date(obj.startDate);
          const startOfCurrentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          return startDate >= startOfCurrentDate;
        });
        setSchedule(
          filteredArray && filteredArray?.length > 0 ? filteredArray : ""
        );
       
      } else {
       console.log("Something went wrong")
      }
    }
  };

console.log(schedule,"LLLLLLLLLLLLLLLLLLLLL")


  const getBooking = async () => {
    const response = await bookingService.singleBooking(id);
    if (response?.status === 200) {
      setData(response?.data?.data);
    } else {
      console.log(":::error");
    }
  };
  useEffect(() => {
    getBooking();
  }, [id]);

  const handleClose = () => setShow(false);

  const handleDeleteClick = (row) => {
    setShow(true);
  };


  

  const cancelBooking1 = async (e) => {
    e.preventDefault();
   
  // const endtime =   data?.startDateTime.setMinutes(data?.startDateTime.getMinutes() + 30);
    const obj = {
      bookingStatus: "Cancelled",
      eventColor: "#b6b6b6",
      data: data?.startDateTime,
      show: false,
    };
    const response = await bookingService.cancelBooking(id, obj);
    if (response.status === 200) {

      createNotification("success", response?.data?.message);
      handleClose();
      getBooking();
      setTimeout(() => {
        navigate(`/bookingdetail/${id}`);
      }, 3000);
    } else {
      console.log(":::error");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="booking-detail-wrapper">
        <Row>
          <Col xs={8}>
            <div className="appointment-booking-wrap">
              <div className="app-book">
                <div className="bk-heading">
                  <span className="icon">
                    <BsCheckCircleFill />
                  </span>
                  <div className="bk-title">
                    <h2>Appointment Booked!</h2>
                    <h3>you will receive a confirmation mail shortly.</h3>
                  </div>
                </div>
                <div className="bk-customer-detail">
                  <div className="bk-salon-box">
                    <div className="bk-cdt">
                      <h2>Person Detail</h2>
                      <p>
                        <b>Name: </b>
                        <span>{data?.name}</span>
                      </p>
                      <p>
                        <b>Email:</b> <span>{data?.email}</span>
                      </p>
                      <p>
                        <b>Phone Number:</b> <span>{`${data?.selectedCountry?.split(' ')[1]}  ${data?.phoneNumber}`}</span>
                      </p>

                    </div>
                  </div>
                </div>
                <div className="bk-customer-detail">

                  <div className="bk-booked">
                    <div className="bk-for">
                      <h3>Booking For</h3>
                      <div className="bk-name">
                        <FaUser /> <span>{data?.name}</span>
                      </div>
                    </div>
                    <div className="bk-for">
                      <h3>Booking ID</h3>
                      <div className="bk-id">
                        <h4>{data?._id}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="bk-datetime">
                    <h3>Date & Time</h3>
                    <div className="bk-dtbox">
                      <div className="bt-time">
                        <BsCalendar3 />
                        <span>
                          {`${new Date(data?.startDateTime).toLocaleDateString(
                            "en-US"
                          )}, ${new Date(data?.startDateTime).toLocaleString(
                            "en-US",
                            { hour: "numeric", minute: "numeric", hour12: true }
                          )}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bk-booked bookingtype-field ">
                    <div className="bk-for">
                      <h3>Booking Type</h3>

                      <div className="bk-cdt">
                        <div className="bkstatus">
                          <span>
                            {data?.bookingType === "self"
                              ? "Self"
                              : data?.bookingType === "giftcertificate"
                                ? "Gift Certificate"
                                : ""}
                          </span>
                        </div>
                        {data && data.bookingType === "giftcertificate" ? (
                          <div>
                            <p>
                              <b>Benificial Name: </b>
                              <span>{data?.benificialName}</span>
                            </p>
                            <p>
                              <b> Benificial Email:</b>{" "}
                              <span>{data?.benificialEmail}</span>
                            </p>
                            <p>
                              <b>Benificial Phone Number:</b>{" "}
                              <span>{`${data?.selectedBenificialCountry?.split(' ')[1]} ${data?.benificialPhone}`}</span>
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bk-booked">
                    <div className="bk-for">
                      <h3>Booking Status</h3>
                      <div className="bkstatus">
                        <span>{data?.bookingStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {data?.bookingStatus === "Confirmed" ? (
                      data?.show === false ? (
                        <div className="cancle-booking">
                          <Button
                            onClick={() => {
                              handleDeleteClick();
                            }}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="booking-detail-box">
              <div className="bk-dt-list">
                <h2>Service</h2>
                <div className="bk-dtbox">
                  <p>
                    {data &&
                      data.service &&
                      data.service.length > 0 &&
                      data?.service?.map((item, index) => {
                        return (
                          <span key={index}>
                            {item?.service}
                            {index === data?.service?.length - 1 ? "" : ", "}
                          </span>
                        );
                      })}
                  </p>
                </div>
              </div>

              <div className="total-price">
                <div className="total-price-amount">
                  <h3>Total Amount paid</h3>
                  <b>
                    {data?.servicePrice ? `$${data?.servicePrice}` : "UnPaid"}
                  </b>
                </div>
              </div>
            </div>
            <div className="bk-chatbox">
              <div className="bk-help">
                <span className="icon">
                  <img src={customericon} alt="icon" />
                </span>
                <div className="help-overlay">
                  <p>Coming Soon...</p>
                </div>
                <div className="helpyou">
                  <h2>We can help you</h2>
                  <p>
                    Call Us 312-450-0418 (or) chat with our customer support
                    team.
                  </p>
                  <Button>Chat with us</Button>
                </div>
                <Modal show={show}>
                  <Modal.Header>
                    <Modal.Title>Cancel Booking</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Do you want to Cancel this Booking ?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="danger" onClick={cancelBooking1}>
                      Cancel Booking
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default BookingList;
