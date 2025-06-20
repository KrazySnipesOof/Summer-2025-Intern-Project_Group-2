import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap"; // Import Spinner for loader
import HeaderTop from "../components/headerTop";
import * as authServices from "../services/authServices";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../helper/notification";
import Footer from "../components/footer";

const ActivateAccount = ({ notificationCount, setNotificationCount }) => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const { token } = useParams();
  const [accountTokenError, setAccountTokenError] = useState(false);
  const [loading, setLoading] = useState(true); // State for loader
  const front_user_token = localStorage.getItem("front_user_token");

  useEffect(() => {
    authServices
      .accountActivationAction(token)
      .then((result) => {
        if (result.data.status === 200) {
          createNotification("success", result.message);
          setTimeout(() => {
            if (result?.data?.data?.paymentStatus == 1 && front_user_token) {
              navigate("/dashboard");
            } else if (front_user_token == null || front_user_token === "") {
              navigate("/");
            } else if (
              result?.data?.data?.paymentStatus == 0 &&
              front_user_token
            ) {
              navigate(`/PricingInfo/${result?.data?.data?._id}`, {
                state: {
                  email: result?.data?.data?.email,
                  password: result?.data?.data?.password,
                },
              });
            }
          }, 2000);
        } else if (result.data.status === 401) {
          setAccountTokenError(true);
        } else {
          setShowError(true);
        }
      })
      .catch((err) => {
        console.log(err, "ERR");
      })
      .finally(() => {
        setLoading(false); // Set loading to false when the request is complete
      });
  }, []);

  return (
    <>
      <HeaderTop
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
      <div className="Login-wrapper">
        <Container>
          <div className="login-form">
            <h2 className="title">Email Verification</h2>
            <div className="form-wrapper text-center">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <h4 className="text-start">
                  {showError
                    ? "Your Account is Already Activated "
                    : accountTokenError
                    ? "Link is Expired"
                    : "Account Activated"}
                </h4>
              )}
            </div>
          </div>
          <ToastContainer autoClose={5000} />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ActivateAccount;
