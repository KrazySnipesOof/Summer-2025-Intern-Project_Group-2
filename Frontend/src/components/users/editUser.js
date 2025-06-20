import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import * as bookingService from "../../services/bookingServices";
import * as authServices from "../../services/authServices";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createNotification } from "../../helper/notification";

const Edituser = (props) => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedCountry: ""
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState([]);
  const [userId, setUserId] = useState("");
  const [countryData, setCountryData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const data1 =
      props.editDetails &&
      props.editDetails.row &&
      props.editDetails.row.original;
    const obj = {
      name: data1 && data1.name,
      email: data1 && data1.email,
      phone: data1 && data1.phoneNumber,
      selectedCountry: data1 && data1.selectedCountry,
      selectedBenificialCountry: data1 && data1.selectedBenificialCountry,
      dob: data1 && data1.dob,
      address: data1 && data1.address
    };
    setUserId(data1 && data1._id);
    setUserData(obj);
  }, [
    props.editDetails &&
    props.editDetails.row &&
    props.editDetails.row.original, props.editModal
  ]);

  const inputRef = useRef(null);

  const inputChange = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };


  const inputChange1 = (e) => {
    const { name, value } = e.target;
    let formattedNumber = value.replace(/\D/g, "");
    if (name === "phone") {
      if (formattedNumber.length > 12) {
        formattedNumber = formattedNumber.slice(0, 12);
      }
      if (formattedNumber.length >= 10) {
        const firstThreeDigits = formattedNumber.slice(0, 3);
        const nextThreeDigits = formattedNumber.slice(3, 6);
        const remainingDigits = formattedNumber.slice(6);

        const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;

        setUserData((prevData) => {
          return {
            ...prevData,
            [name]: formattedPhoneNumber,
          };
        });
      } else {
        setUserData((prevData) => {
          return {
            ...prevData,
            [name]: formattedNumber,
          };
        });
      }
    }
  };

  const getAllCountryData = async () => {
    const response = await authServices.getCountryData();

    if (response?.status === 200) {
      setCountryData(response?.data)
    }
  };

  useEffect(() => {
    getAllCountryData();
  }, []);

  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    const [countryCode, countryName] = selectedOption.split(',');
    setSelectedCountry(`${countryCode}${countryName}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {
      name: userData.name ? userData.name.trim() : userData.name,
      email: userData.email,
      phoneNumber: userData.phone,
      address: userData.address ? userData.address : "",
      dob: userData?.dob ? userData?.dob : "",
      selectedCountry: selectedCountry ? selectedCountry : userData.selectedCountry
    };
   
    const Validation = () => {
      let err = {};
      let isValid = true;
      let num1 = "^\\d+$";
      let num2 = "^[1-9][0-9]*$";
      let regex = new RegExp(
        /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
      );
      let phoneNo = /^\d{10,15}$/;


      if (!userData.name) {
        err["name"] = "Name is required";
        isValid = false;
      } else if (userData.name.trim() === "") {
        err["name"] = "Please enter name";
        isValid = false;
      }

      if (!userData.email) {
        isValid = false;
        err["email"] = "Email is required";
      } else if (userData.email.trim() === "") {
        isValid = false;
        err["email"] = "Email is required";
      } else if (!regex.test(userData.email)) {
        isValid = false;
        err["email"] = "Please enter a valid email address";
      }

      if (!userData.phone) {
        err["phone"] = "Phone number is required";
        isValid = false;
      }
      else if (!phoneNo.test(userData?.phone.replace(/-/g, ""))) {
        isValid = false;
        err["phone"] = "Phone number must be of 10-12 digits";
      }
      setError(err);
      return isValid;
    };
    if (Validation()) {
      if (reduxToken) {
        setLoader(true);
        const response = await bookingService.editCustomer(userId, obj);
        setLoader(false);

        if (response.data.status == 200) {
          props.setEditModal(false);

          createNotification("success", response?.data?.message);
          props.getUser();
          setError([]);
          setTimeout(() => {
            navigate("/clients");
          }, 3000);
        } else {
          createNotification("error", response?.data?.message);
          console.log("error");
          setLoader(false);
        }
      }
    }
  };

  const handleClose = () => {
    props.setEditModal(false);
    setError([]);
    const data1 =
      props.editDetails &&
      props.editDetails.row &&
      props.editDetails.row.original;
    const obj = {
      name: data1 && data1.name,
      email: data1 && data1.email,
      phone: data1 && data1.phone,
    };
    setUserId(data1 && data1._id);
    setUserData(obj);
  };
  return (
    <Modal
      className="adduser-wrapper"
      show={props.editModal}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <h2>Edit Client</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Add Name"
                    name="name"
                    value={userData.name}
                    onChange={inputChange}
                  />
                  <span className="error"> {error.name} </span>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Add Email Address"
                    name="email"
                    disabled
                    value={userData.email}
                    onChange={inputChange}
                  />
                  <span className="error"> {error.email} </span>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <div className="selectinput-field">
                    <Form.Select name="state" onChange={handleCountryChange}>
                      <option value="" >{userData.selectedCountry ? userData.selectedCountry : userData.selectedBenificialCountry}</option>
                      {Object.entries(countryData).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control
                      type="text"
                      placeholder="Add Phone Number"
                      name="phone"
                      value={userData.phone}
                      onChange={inputChange1}
                    />
                  </div>

                  <span className="error"> {error.phone} </span>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="submitbtn" onClick={handleSubmit}>
          <Button type="submit" disabled={loader} className="nextbtn">
            {loader ? (
              <>
                <div className="submit-loader">
                  <Rings
                    height="40"
                    width="40"
                    radius="10"
                    color="#ffffff"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              </>
            ) : (
              <> Submit</>
            )}
            <BsChevronDoubleRight />
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default Edituser;
