import React  from "react";
import ReactNotificationComponent from "./ReactNotification";

const NotificationsPOPUp = (props) => {




  return (
    <>
        <ReactNotificationComponent
          title={props.title}
          body={props.body}
          setShow={props.setShow}
          show={props.show}
        />
    </>
  );
};

NotificationsPOPUp.propTypes = {};

export default NotificationsPOPUp;
