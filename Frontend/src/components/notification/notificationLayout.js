import React, { useState, useEffect } from "react";
import { Container, Breadcrumb, Button } from "react-bootstrap";
import Notificationlist from "./notificationList";
import * as notificationService from "../../services/notificationService";
import { MdHome } from "react-icons/md";
import Loader from "../../helper/loader";
const NotificationLayout = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setnotificationData] = useState({ day: "Today" });
  const [loader, setLoader] = useState(false);

  const getNotification = async () => {
    setLoader(true);

    const response = await notificationService.getNotification();
    if (response.status == 200) {
      setNotificationCount(
        response?.data?.data?.filter((val) => val.status === "unread").length
      );
      setLoader(false);

    } else {
    setLoader(true);

      console.log("error");
    }
  };

  useEffect(() => {
    getNotification();
  }, []);
  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <div className="breadcurm-bar">
            <div className="bdbar-box">
              <h2>
                <b>Notifications</b>
              </h2>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <MdHome />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>All Notification</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div className="layout-content-wrapper notification-layout">
            <div className="main-heading">
              <h1>
                Notification messages<b></b>
              </h1>
            </div>
            <div className="notification-list-wrap">
              <div className="Notification-tab-list">
                <Button
                  onClick={() =>
                    setnotificationData((prev) => ({ ...prev, day: "Today" }))
                  }
                  className={notificationData.day == "Today" ? 'active' : null}
                >
                  Today
                </Button>
                <Button
                  onClick={() =>
                    setnotificationData((prev) => ({
                      ...prev,
                      day: "Yesterday",
                    }))
                  }
                  className={notificationData.day == "Yesterday" ? 'active' : null}
                >
                  Yesterday
                </Button>
                <Button
                  onClick={() =>
                    setnotificationData((prev) => ({
                      ...prev,
                      day: "This_week",
                    }))
                  }
                  className={notificationData.day == "This_week" ? 'active' : null}
                >
                  This week
                </Button>
              </div>
              {loader == true ?   <Loader /> : 
              <Notificationlist notificationData={notificationData} />}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default NotificationLayout;
