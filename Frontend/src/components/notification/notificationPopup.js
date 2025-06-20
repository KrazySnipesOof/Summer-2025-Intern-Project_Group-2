import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { CSSTransition } from "react-transition-group";
import * as notificationService from "../../services/notificationService";
import { MdClose } from "react-icons/md";
import Userimg from "../../assets/img/noAvtar.png";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const NotificationPopup = ({ isOpen, closeNotification }) => {
  const url = useParams();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationLIst] = useState();
  const [latestLIst, setLatestList] = useState([]);
  const getNotification = async () => {
    const response = await notificationService.getNotification();
    if (response?.status == 200) {
      setNotificationLIst(response?.data?.data);
      setNotificationCount(
        response?.data?.data?.filter((val) => val.status === "unread").length
      );
    } else {
      console.log("error");
    }
  };

  const newData = () => {
    if (notificationList && notificationList.length > 0) {
      notificationList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latest5 = notificationList.slice(0, 5);
      setLatestList(latest5);
    }
  };

  useEffect(() => {
    newData();
  }, [notificationList]);

  useEffect(() => {
    getNotification();
  }, []);

  const handleOpenPopUp = async (item) => {
    const obj = {
      Id: item._id,
      data: "read",
    };
    const response = await notificationService.updateNotification(obj);
    if (item?.type == "Booking") {
      navigate(`/bookingdetail/${item.bookingId}`);
    } else if (item?.type == "User") {
      navigate(`/clientdetail/${item.customerId._id}`);
    }
  };

  const handlelatestLIstData = () => {
    const latestLIstData =
      latestLIst &&
      latestLIst?.length > 0 &&
      latestLIst.map((item) => {
        const currentDate = new Date();
        const time = item.createdAt;

        const specificDate = new Date(time);

        const timeDiffMs = currentDate - specificDate;

        const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiffMs / (1000 * 60)) % 60);

        let timeString;
        if (hours === 0 && minutes === 0) {
          timeString = "Just now";
        } else if (hours < 1) {
          timeString = `${minutes} minutes ago`;
        } else if (hours >= 24) {
          const days = Math.floor(hours / 24);
          timeString = `${days} day${days > 1 ? "s" : ""} ago`;
        } else {
          timeString = `${hours} hours ${minutes} minutes ago`;
        }
        return (
          <>
            <div
              className={
                item.status == "unread"
                  ? "notification-lists nonreadble"
                  : "notification-lists"
              }
            >
              <div className="notification-detail">
                <div className="nth-profileicon">
                  {item?.customerId?.userProfileImg ? (
                    <img
                      src={`${imgUrl}/${item?.customerId?.userProfileImg}`}
                      alt="icon"
                    />
                  ) : (
                    <img src={Userimg} alt="icon" />
                  )}
                </div>
                <div
                  className="desc cursor"
                  onClick={() => handleOpenPopUp(item)}
                >
                  <span className="cursor">
                    <h3>{item.title}</h3>
                  </span>

                  <span
                    dangerouslySetInnerHTML={{
                      __html: item.text.slice(
                        0,
                        Math.max(
                          item.text.indexOf("Do"),
                          item.text.indexOf("AM"),
                          item.text.indexOf("Be")
                        )
                      ),
                    }}
                  />
                  <ul>
                    <li>
                      <span>{`${timeString}`}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
      });
    return latestLIstData;
  };

  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="notification-wrapper"
        unmountOnExit
      >
        <div className="notification-wrapper">
          <div className="notification-box">
            <div className="heading">
              <h2>Notifications</h2>{" "}
              <Button onClick={closeNotification}>
                <MdClose />
              </Button>
            </div>
            <div>
              <>
                {latestLIst?.length > 0 ? (
                  <div className="notification-list-box">
                    {handlelatestLIstData()}
                  </div>
                ) : (
                  <>
                    <div className="not-notification">
                      No Notification Found
                    </div>
                  </>
                )}
              </>
            </div>
            <div className="notfiction-btn">
              <Button href="/Notification">Show All Notifications</Button>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};
export default NotificationPopup;
