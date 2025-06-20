import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authServices from "../services/authServices";
import { createNotification } from "../helper/notification";
import { Form, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    bussName: "",
    firstName: "",
    phone: "",
    mobile: "",
    state: "",
    bussType: "",
    reffered: "",
  });
  const [err, setErr] = useState({});
  const {
    email,
    password,
    firstName,
    phone,
    mobile,
    state,
    bussName,
    bussType,
    reffered,
  } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const loginPage = () => {
    navigate("/");
  };
  const validation = () => {
    const { email, password } = user;
    let isValid = true;
    const formError = {};
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let phoneno = /^\d{10}$/;

    if (!email) {
      isValid = false;
      formError["email"] = "Email is required";
    } else if (!regex.test(email)) {
      isValid = false;
      formError["email"] = "Not a valid Email";
    }
    if (!password) {
      isValid = false;
      formError["password"] = "Password is required";
    }
    if (!firstName) {
      isValid = false;
      formError["firstName"] = "Name is required";
    }
    if (!mobile) {
      isValid = false;
      formError["mobile"] = "Mobile is required";
    } else if (!mobile.match(phoneno)) {
      isValid = false;
      formError["mobile"] = "Invalid.";
    }
    if (!phone) {
      isValid = false;
      formError["phone"] = "Phone is required";
    } else if (!phone.match(phoneno)) {
      isValid = false;
      formError["phone"] = "Invalid.";
    }
    if (!state) {
      isValid = false;
      formError["state"] = "State is required";
    }
    if (!bussType) {
      isValid = false;
      formError["bussType"] = "Business-Type is required";
    }
    if (!bussName) {
      isValid = false;
      formError["bussName"] = "Business-Name is required";
    }
    if (!reffered) {
      isValid = false;
      formError["reffered"] = "Field is required";
    }
    setErr(formError);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validation()) {
      const response = await authServices.register(user);
      if (response.status == 201) {
        createNotification("success", response.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        createNotification("error", response.message);
      }
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login">
        <h5>
          <u>
            <i>Register</i>
          </u>
        </h5>
        <Form onSubmit={submitHandler}>
          <div className="loginbox">
            <input
              type="text"
              name="firstName"
              placeholder="Enter your name"
              value={firstName}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.firstName}</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.email}</p>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.password}</p>
            <input
              type="text"
              name="bussName"
              placeholder="Enter Your Business Name"
              value={bussName}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.bussName}</p>
            <input
              type="text"
              name="phone"
              placeholder="Enter Your Phone"
              value={phone}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.phone}</p>
            <input
              type="text"
              name="mobile"
              placeholder="Enter Your Mobile"
              value={mobile}
              onChange={handleChange}
            />
            <p style={{ color: "red" }}>{err && err.mobile}</p>
            <select name="state" onChange={handleChange}>
              <option value="">Select State</option>
              <option value="state1">State 1</option>
              <option value="state2">State 2</option>
            </select>
            <p style={{ color: "red" }}>{err && err.state}</p>
            <select name="bussType" onChange={handleChange}>
              <option value="">Select Business-type</option>
              <option value="Cosmetologist">Cosmetologist</option>
              <option value="Make-up Artist">Make-up Artist</option>
            </select>
            <p style={{ color: "red" }}>{err && err.bussType}</p>
            <select name="reffered" onChange={handleChange}>
              <option value="">Select One</option>
              <option value="referred">Referred</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
            <p style={{ color: "red" }}>{err && err.reffered}</p>

            <Button type="submit" className="btn btn-primary btn-block">
              Submit
            </Button>
            <Form.Text className="text-muted">
              Already have an account ?{" "}
              <u onClick={loginPage} style={{ cursor: "pointer" }}>
                Login
              </u>
              .
            </Form.Text>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
