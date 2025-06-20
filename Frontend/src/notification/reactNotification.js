import React, { useEffect } from "react"; // react notification
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ReactNotificationComponent = ({ title, body, setShow, show }) => {
  useEffect(() => {
    if (title !== "" && show) {
      toast.info(<Display />);
    }
  }, [title, show]);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, []);

  function Display() {
    return (
      <div>
        <h4>{title}</h4>
      </div>
    );
  }

  return (
    <Link to={"/notification"}>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
       
      />
    </Link>
  );
};

ReactNotificationComponent.defaultProps = {
  title: "This is title",
  body: "Some body",
};

ReactNotificationComponent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default ReactNotificationComponent;
