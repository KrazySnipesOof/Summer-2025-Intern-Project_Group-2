import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Dropdown } from "react-bootstrap";
import logo from "../assets/img/bisi_logo.png";
import VideopopupDashboard from "./videoPopUpDashboard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as notificationService from "../services/notificationService";
import { GetUserByID } from "../services/userServices";
import { MdOutlineNotificationsNone } from "react-icons/md";
import NotificationPopup from "./notification/notificationPopup";
import * as calenderService from "../services/calenderServices";
import { createNotification } from "../helper/notification";

const HeaderTop = ({ notificationCount, setNotificationCount }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(
    JSON.parse(localStorage.getItem("permissionDashboard"))
  );
  const [paymentStatus, setPaymentStatus] = useState("");
  const [activate, setActivate] = useState(1);
  const [unActivedata, setUnactivedata] = useState();

  const [staffStatus, setStaffStatus] = useState("");
  const userName = useSelector((state) => state?.auth?.user?._id);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationLIst] = useState();
  const [buttonDisabled, seButtondisabled] = useState(false);

  const getNotification = async () => {
    const response = await notificationService.getNotification();
    if (response?.status == 200) {
      if (response?.data?.data) {
        setNotificationLIst(response?.data?.data);
        setNotificationCount(
          response?.data?.data?.filter((val) => val.status === "unread").length
        );
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  const openNotification = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add("open-notification");
    } else {
      document.body.classList.remove("close-notification");
    }
  };

  const closeNotification = () => {
    setIsOpen(false);
    if (!isOpen) {
      document.body.classList.add("open-notification");
    } else {
      document.body.classList.remove("close-notification");
    }
  };
  const userNameFun = async () => {
    if (userName) {
      const res = await GetUserByID(userName);
      if (res.data) {
        setPaymentStatus(res?.data?.paymentStatus);
        setStaffStatus(res?.data?.type);
        setUnactivedata(res?.data?.email);
        setActivate(res?.data?.status);
      } else {
        console.log("something went wrong");
      }
    }
  };
  useEffect(() => {
    userNameFun();
  }, [name, userName]);

  const userId = localStorage.getItem("front_user_id");
  const handleVideoPlay = () => {
    setShow(true);
  };
  const handleClick = () => {
    navigate(`/myaccount/${userId}`);
  };

  const handleLoogut = () => {
    navigate("/logout");
  };
  const sendmail = async (e) => {
    e.preventDefault();
    seButtondisabled(true);

    if (unActivedata) {
      const response = await calenderService.resendmail(unActivedata);
      if (response?.status == "200") {
        createNotification("success", response?.data?.message);
        setTimeout(() => {
          seButtondisabled(false);
        }, 2000);
      } else {
        console.log("erro");
      }
    }
  };
  return (
    <>
      <div className="headertop-wrapper">
        <Container>
          <div className="headerbar d-md-flex justify-content-between align-items-center">
            <div className="logobar">
              {paymentStatus == 1 || staffStatus == "staff" ? (
                <Link to="/dashboard" className="mb-4 mb-md-0">
                  <img src={logo} alt="logo" />
                </Link>
              ) : (
                <img src={logo} alt="logo" />
              )}
            </div>
            <div className="head-rightbar">
              <div className="verifydesc">
                {userName ? (
                  activate == 0 ? (
                    <b>
                      Please verify your Account first -{" "}
                      <Link
                        style={{
                          pointerEvents:
                            buttonDisabled == false ? "auto" : "none",
                        }}
                        onClick={sendmail}
                      >
                        Click Here To resend mail
                      </Link>{" "}
                    </b>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </div>
              {userName ? (
                <div className="userbar">
                  {name?.paymentStatus == 1 || name?.type == "staff" ? (
                    <Button
                      className="notification-btn"
                      onClick={openNotification}
                    >
                      <MdOutlineNotificationsNone />
                      <span className="notification-value">
                        {notificationCount}
                      </span>
                    </Button>
                  ) : (
                    ""
                  )}
                  <Dropdown align="end" id="dropdown-menu-align-end">
                    <Dropdown.Toggle id="dropdown-custom-components">
                      {name?.withEnterprise && (
                        <div className="enterprise">
                          {name?.businessName} Enterprise
                        </div>
                      )}
                      <span className="m-0">
                        {name?.firstName ? `Hello ${name?.firstName}` : ""}{" "}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={handleClick}
                        disabled={
                          name?.type === "staff" ? false : paymentStatus == 0
                        }
                      >
                        {" "}
                        Account
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLoogut}>
                        Logout{" "}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                " "
              )}
            </div>
          </div>
        </Container>
      </div>

      {show ? <VideopopupDashboard show={show} setShow={setShow} /> : ""}
      <NotificationPopup
        isOpen={isOpen}
        closeNotification={closeNotification}
      />
    </>
  );
};

export default HeaderTop;
