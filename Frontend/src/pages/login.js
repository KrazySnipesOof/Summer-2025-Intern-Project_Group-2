import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as authActions from "../store/action/authAction";
import { Container, Form, Button } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../helper/notification";
import ForgotPassword from "../forgotPassword/forgotPassword";
import { BsEye } from "react-icons/bs";
import { getTokens } from "../helper/firebase";
import Footer from "../components/footer";
import {
  loginUser,
  getUserByEmail,
  accountActivationByClient,
} from "../services/authServices";
import * as userServices from "../services/userServices";
import { useSelector } from "react-redux";

const Login = ({ notificationCount, setNotificationCount }) => {
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [emailVarificationError, setEmailVarificationError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState({});
  const [tokenFound, setTokenFound] = useState("");
  const [fcmToken, setFCMToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswords, setShowPassword] = useState(true);
  const [userStatus, setUserStatus] = useState("");

  const userID = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  let id = userID;

  const formValidation = () => {
    const regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const pwd = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
    );
    let formErrors = {};
    let isValid = true;
    if (!email) {
      isValid = false;
      formErrors["email"] = "Email is required";
    } else if (!regex.test(email)) {
      isValid = false;
      formErrors["email"] = "Please enter a valid email address";
    }
    if (!password) {
      isValid = false;
      formErrors["password"] = "Password is required";
    }
    setErr(formErrors);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (formValidation()) {
      try {
        const data = {
          email,
          password,
          fcmToken,
        };
        const userByEmail = await getUserByEmail(data.email);

        let response = await loginUser(data);
        console.log(
          response?.data?.data?.user?.HistoryActivateStatus,
          "responseresponseresponse"
        );
        if (
          response &&
          response.data &&
          response.data.message ===
            "Email is not verified, please check your email and verify!"
        ) {
          setEmailVarificationError(response.data.message);
        }
        if (
          response &&
          response.data &&
          response.data.message === "Please Choose Subscription Plan"
        ) {
          createNotification(
            "error",
            response && response.data && response.data.message
          );
          setTimeout(() => {
            navigate(`/PricingInfo/${userByEmail?.data?._id}`);
          }, 1000);
        }
        if (
          response &&
          response.data &&
          response.data.message == "Your account is deactivated"
        ) {
          createNotification("error", response.data.message);
        }
        if (
          response &&
          response.data &&
          response.data.message === "Invalid username/password"
        ) {
          createNotification(
            "error",
            response && response.data && response.data.message
          );
        }
        if (
          response &&
          response.data &&
          response.data.message === "Access denied!"
        ) {
          createNotification(
            "error",
            response && response.data && response.data.message
          );
        }

        if (
          response &&
          response.data &&
          response.data.message === "Email doesn't exist"
        ) {
          createNotification(
            "error",
            response && response.data && response.data.message
          );
        }
        if (
          response &&
          response.data &&
          response.data.message == "Logged In" &&
          response?.data?.data?.user?.HistoryActivateStatus == false &&
          response?.data?.data?.user?.status == 0
        ) {
          createNotification(
            "success",
            "You already having account Please activate account first"
          );

          setTimeout(() => {
            navigate(`/DeactivateAccount/${userByEmail?.data?._id}`);
          }, 2000);
          // const deactivateStatus = await accountActivationByClient(response?.data?.data?.user?._id,response?.data?.data?.user?.firstName,response?.data?.data?.user?.email)
          // localStorage.setItem(
          //   "permissionDashboard",
          //   JSON.stringify(response?.data?.data?.user)
          // );
          // createNotification(
          //   "success",
          //   "Login succesfully"
          // );
          // setTimeout(() => {
          //   dispatch(authActions.loginUser(data, navigate));
          // }, 2000);
        }
        if (
          response &&
          response.data &&
          response.data.message === "Logged In" &&
          response?.data?.data?.user?.HistoryActivateStatus == true &&
          response?.data?.data?.user?.status == 0
        ) {
          const deactivateStatus = await accountActivationByClient(
            response?.data?.data?.user?._id,
            response?.data?.data?.user?.firstName,
            response?.data?.data?.user?.email
          );
          localStorage.setItem(
            "permissionDashboard",
            JSON.stringify(response?.data?.data?.user)
          );

          const statusbudget = await userServices.getStatusBudjet(id);
          if (statusbudget?.personalBudget?.addedBy) {
            console.log("Login hogya :::::::::::::::::::::::::::::::");
            localStorage.setItem("Budgetadded", "true");
          }

          dispatch(authActions.loginUser(data, navigate));
        }
        if (
          response &&
          response.data &&
          response.data.message === "Logged In" &&
          response?.data?.data?.user?.status == 1
        ) {
          localStorage.setItem(
            "permissionDashboard",
            JSON.stringify(response?.data?.data?.user)
          );
          const statusbudget = await userServices.getStatusBudjet(id);
          if (statusbudget?.personalBudget?.addedBy) {
            localStorage.setItem("Budgetadded", "true");
          }
          createNotification("success", "Login succesfully");
          setTimeout(() => {
            dispatch(authActions.loginUser(data, navigate));
          }, 2000);
        }
        // if (
        //   response &&
        //   response.data &&
        //   response.data.message === "Logged In" && response?.data?.data?.user?.HistoryActivateStatus == false
        // ) {
        //   const deactivateStatus = await accountActivationByClient(response?.data?.data?.user?._id,response?.data?.data?.user?.firstName,response?.data?.data?.user?.email)
        //   localStorage.setItem(
        //     "permissionDashboard",
        //     JSON.stringify(response?.data?.data?.user)
        //   );
        //   createNotification(
        //     "success",
        //     "Welcome Back"
        //   );
        //   setTimeout(() => {
        //     dispatch(authActions.loginUser(data, navigate));
        //   }, 2000);

        // }
        setDisabledBtn(true);
      } catch (err) {
        createNotification("error", err.message);
      }
    }
  };

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getTokens(setTokenFound);
      if (data) {
        setFCMToken(data);
      }
      return data;
    }
    tokenFunc();
  }, [setTokenFound]);

  useEffect(() => {
    setTimeout(() => {
      setDisabledBtn(false);
    }, 6000);
  }, [disabledBtn]);
  const showPassword = () => {
    setShowPassword(!showPasswords);
  };
  return (
    <>
      <div className="login-page-wrapper">
        <HeaderTop
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />
        <div className="Login-wrapper">
          <Container>
            <div className="login-form">
              <h2 className="title">LOGIN</h2>
              <div className="form-wrapper">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitHandler(e);
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="error">
                      {emailVarificationError ? emailVarificationError : ""}
                    </span>
                    <br />
                    <span className="error">{err && err.email}</span>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="password-label">
                      {" "}
                      <Form.Label>Password</Form.Label>
                    </div>
                    <div className="pas-word">
                      <Form.Control
                        type={showPasswords ? "password" : "input"}
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="error">{err && err.password}</span>
                      <Button
                        className={
                          showPasswords
                            ? "password-btn notshow"
                            : "password-btn"
                        }
                        onClick={showPassword}
                      >
                        <BsEye />
                      </Button>
                    </div>
                    <div className="password-label">
                      <span className="forgetpas">
                        {" "}
                        <ForgotPassword />
                      </span>
                    </div>
                  </Form.Group>

                  <Button type="submit" disabled={disabledBtn}>
                    Login
                  </Button>
                </Form>
              </div>
              <div className="newaccount">
                Don't have an account yet? <Link to="/Signup"> SignUp</Link>
              </div>
              <div className="mt-3 d-flex newaccount justify-content-center">
                I have an activation code.{" "}
                <Link to="/license-activation" className="font-weight-bold">
                  {" "}
                  Activate
                </Link>
              </div>
            </div>
            <ToastContainer autoClose={5000} />
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
