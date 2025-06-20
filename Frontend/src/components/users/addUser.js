import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import * as bookingService from "../../services/bookingServices";
import * as authServices from "../../services/authServices";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createNotification } from "../../helper/notification";

const Adduser = (props) => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const loggedInUserId = useSelector((state) => state?.auth?.user?._id);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US +1');
  const [countryData, setCountryData] = useState([])
  const inputRef = useRef(null);

  const inputChange = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };



  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedCountry(selectedOption);
  };

  const inputChange1 = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value.replace(/[^0-9]/g, "");

    if (name === "phone") {
      if (sanitizedValue.length > 12) {
        sanitizedValue = sanitizedValue.slice(0, 12);
      }

      if (sanitizedValue.length >= 10) {
        const firstThreeDigits = sanitizedValue.slice(0, 3);
        const nextThreeDigits = sanitizedValue.slice(3, 6);
        const remainingDigits = sanitizedValue.slice(6);

        const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;

        setUserData((prevData) => ({
          ...prevData,
          [name]: formattedPhoneNumber,
        }));
      } else {
        setUserData((prevData) => ({
          ...prevData,
          [name]: sanitizedValue,
        }));
      }
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let selectedCountry1 = userData.selectedCountry ? userData.selectedCountry : userData.selectedBenificialCountry;
    selectedCountry1 = selectedCountry.replace(/,/g, '').trim();

    const obj = {
      name: userData.name ? userData.name.trim() : userData.name,
      email: userData.email,
      role: 3,
      phoneNumber: userData.phone,
      selectedCountry: selectedCountry1,
      userId: loggedInUserId,
    };
    const Validation = () => {
      let err = {};
      let isValid = true;
      let phoneNumber = /^\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{4}$/;
      const phoneNo = /^\d{10,15}$/;

      let regex = new RegExp(
        /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
      );

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
      if (!userData.phone && selectedCountry == "") {
        isValid = false;
        err["phone"] = "Phone number and country code is required";
      } else if (!userData.phone) {
        isValid = false;
        err["phone"] = "Phone number is required";
      } else if (selectedCountry == "") {
        isValid = false;
        err["phone"] = "Country code is required";
      }
      else if (userData.phone.trim() === "") {
        err["phone"] = "Phone number is required";
        isValid = false;
      }
      else if (!phoneNo.test(userData.phone.replace(/-/g, ""))) {
        isValid = false;
        err["phone"] = "Phone number must be of 10-15 digits";
      }

      setError(err);
      return isValid;
    };
    if (Validation()) {
      if (reduxToken) {
        setLoader(true);
        const response = await bookingService.createCustomerBooking(
          obj
        );
        setTimeout(() => {
          setLoader(false);
        }, 3000);
console.log(response,":::::::::::::::::::::::")
        if (response.status == 200) {
          props.setShow(false);
          setUserData({});
          createNotification("success", response?.data?.message);
          props.getUser();
          setTimeout(() => {
            navigate("/clients");
          }, 3000);
        } 
       else if (response.status == 201) {
          // props.setShow(false);
          // setUserData({});
          createNotification("error", response?.data?.message);
          // props.getUser();
          // setTimeout(() => {
          //   navigate("/clients");
          // }, 3000);
        } 
        else {
          createNotification("error", response?.data?.message);

          setLoader(false);
        }
      }
    }
  };

  const onHide = () => {
    props.setShow();
    setError({});
  };
  return (
    <Modal className="adduser-wrapper" show={props.show} onHide={onHide}>
      <Modal.Header closeButton>
        <h2>Add Client</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={12} md={6} className="mb-3 mb-lg-0">
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
              <Col xs={12} md={6} className="mb-3 mb-lg-0">
                <Form.Group className="mb-3">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Add Email Address"
                    value={userData.email}
                    onChange={inputChange}
                    name="email"
                  />
                  <span className="error"> {error.email} </span>
                </Form.Group>
              </Col>
              <Col xs={12} >
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <div className="selectinput-field">
                    <Form.Select name="state" onChange={handleCountryChange} value={selectedCountry}>
                      <option value="US,+1">US +1</option>
                      {Object.entries(countryData).map(([code, name]) => (
                        <option key={code} value={`${code},${name}`}>
                          {`${code}${name}`}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control
                      type="text"
                      placeholder="Add Phone Number"
                      value={userData.phone}
                      onChange={inputChange1}
                      name="phone"
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
        <div className="submitbtn" >
          <Button type="submit" disabled={loader} className="nextbtn" onClick={handleSubmit}>
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
export default Adduser;
