import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createNotification } from "../helper/notification";
import { ToastContainer } from "react-toastify";
import * as staffServices from "../services/staffServices";

import { Button, Form } from "react-bootstrap";
import ResetHeaderBar from "../components/resetHeaderbar";
import Footer from "../components/footer";
const StaffresetPassword = (props) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [error, setError] = useState({});
  const [data, setData] = useState({
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid = () => {
    let pwd = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
    );
    if (data.password == "") {
      setError({ password: "New password is required!" });
      return false;
    } else if (!pwd.test(data.password)) {
      setError({
        password:
          "Your password should have at least one special charachter, digits, uppercase and lowercase charachter. Length: 8+ ch-ers.",
      });
      return false;
    }

    if (confirmPassword === "") {
      setError({ confirmPassword: "Confirm password is required!" });
      return false;
    } else if (!pwd.test(confirmPassword)) {
      setError({
        confirmPassword:
          "Your password should have at least one special charachter, digits, uppercase and lowercase charachter. Length: 8+ ch-ers.",
      });
      return false;
    } else {
      setError({});
      return true;
    }
  };

  const handleChange = async (event) => {
    setError({});
    const { name, value } = event.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const isValid = isFormValid();
    if (isValid) {
      if (data.password !== confirmPassword) {
        setError({
          ...error,
          confirmPassword: "Confirm password is not matched",
        });
      } else if (data.password === confirmPassword) {
        try {
          const loginResponse = await staffServices.passwordstaff( id , data);
          if (loginResponse.status === 200) {
            createNotification("success", loginResponse.message);
            setTimeout(() => {
              navigate("/booking");
            }, 2000);
          } else {
            createNotification("error", loginResponse.message);
          }
        } catch (error) {
          console.log(Error);
        }
      }
    }
  };


  return (
    <>
      <ResetHeaderBar />
      <div className="forget-password-wrap">
        <div className="forget-pasbox">
          <h4 className="heading">Generate Password</h4>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="form-control"
              type="password"
              value={data.password}
              placeholder="New Password"
              name="password"
              onChange={handleChange}
            />
            <span className="form-error">{error.password}</span>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              className="form-control"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="form-error">{error.confirmPassword}</span>
          </Form.Group>
          <div className="mt-3">
            <Button
              className="resetbtn"
              onClick={() => {
                handleSubmit();
              }}
            >
            Create Password
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default StaffresetPassword;
