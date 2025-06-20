import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import * as notificationService from "../../services/notificationService";
import Userimg from "../../assets/img/noAvtar.png";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const Notificationlist = (props) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationLIst] = useState();
  const [ids, setIds] = useState("");
  const getNotification = async () => {
    const response = await notificationService.getNotification();
    if (response.status == 200) {
      setNotificationLIst(response.data.data);
      setNotificationCount(
        response?.data?.data?.filter((val) => val.status === "unread").length
      );
    } else {
      console.log("error");
    }
  };

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
      setIds(item.customerId);
      if (item.customerId) {
      }
      navigate(`/clientdetail/${item.customerId._id}`);
    }
  };

  const currentDate = moment();

  const todayData = notificationList?.filter((obj) => {
    const objDate = moment(obj.createdAt);
    return objDate.isSame(currentDate, "day");
  });
  const yesterdayData = notificationList?.filter((obj) => {
    const objDate = moment(obj.createdAt);
    const yesterday = moment().subtract(1, "day");
    return objDate.isSame(yesterday, "day");
  });

  const lastWeekData = notificationList?.filter((obj) => {
    const objDate = moment(obj.createdAt);
    const lastWeekStart = moment().subtract(1, "week").startOf("day");
    const lastWeekEnd = moment().endOf("day");
    return objDate.isBetween(lastWeekStart, lastWeekEnd);
  });

  const combinedData = todayData?.concat(lastWeekData);

  const handleTodayData = () => {
    const todayDateData =
      todayData &&
      todayData.length > 0 &&
      todayData
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => {
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
                <div className="ntf-list" id="today" key={item._id}>
                  <div className="nth-list-wrap">
                    <div className="nth-message-list">
                      <div className="nth-ms-box">
                        <div className="nth-msd">
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
                            className="nth-message cursor"
                            onClick={() => handleOpenPopUp(item)}
                          >
                            <h2 className="cursor">{item.title}</h2>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item?.text,
                              }}
                            />
                          </div>
                        </div>
                        <div className="nth-time-ago">
                          <span>{`${timeString}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        });
    return todayDateData;
  };
  const handleYesterdayData = () => {
    const yesterdayDateData =
      yesterdayData &&
      yesterdayData.length > 0 &&
      yesterdayData
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => {
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
                <div className="ntf-list" id="today" key={item._id}>
                  <div className="nth-list-wrap">
                    <div className="nth-message-list">
                      <div className="nth-ms-box">
                        <div className="nth-msd">
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
                            className="nth-message cursor"
                            onClick={() => handleOpenPopUp(item)}
                          >
                            <h2 className="cursor">{item.title}</h2>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item?.text,
                              }}
                            />
                          </div>
                        </div>
                        <div className="nth-time-ago">
                          <span>{`${timeString}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        });
    return yesterdayDateData;
  };
  const handleLastWeekData = () => {
    const lastWeekDateData =
      lastWeekData &&
      lastWeekData.length > 0 &&
      lastWeekData
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => {
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
                <div className="ntf-list" id="today" key={item._id}>
                  <div className="nth-list-wrap">
                    <div className="nth-message-list">
                      <div className="nth-ms-box">
                        <div className="nth-msd">
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
                            className="nth-message cursor"
                            onClick={() => handleOpenPopUp(item)}
                          >
                            <h2
                              className="cursor"
                              onClick={() => handleOpenPopUp(item)}
                            >
                              {item.title}
                            </h2>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item?.text,
                              }}
                            />
                          </div>
                        </div>
                        <div className="nth-time-ago">
                          <span>{`${timeString}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        });
    return lastWeekDateData;
  };

  return (
    <div>
      <>
        {props.notificationData.day === "Today" ? (
          <>
            {todayData?.length > 0 ? (
              <> {handleTodayData()} </>
            ) : (
              "No Notification Found"
            )}
          </>
        ) : props.notificationData.day === "Yesterday" ? (
          <>
            {yesterdayData.length > 0 ? (
              <> {handleYesterdayData()} </>
            ) : (
              "No Notification Found"
            )}
          </>
        ) : props.notificationData.day === "This_week" ? (
          <>
            {lastWeekData?.length > 0 ? (
              <> {handleLastWeekData()} </>
            ) : (
              "No Notification Found"
            )}
          </>
        ) : (
          ""
        )}
      </>
    </div>
  );
};
export default Notificationlist;
