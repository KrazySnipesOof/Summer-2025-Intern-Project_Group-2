import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, Modal, InputGroup } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import * as authServices from "../../../../services/authServices";
import { useNavigate, useParams } from "react-router-dom";
import * as userBookingService from "../../../../services/bookingUserService";
import moment from "moment";
import { createNotification } from "../../../../helper/notification";
import { Rings } from "react-loader-spinner";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const EditProfileModal = (props) => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [countryData, setCountryData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('');

  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const { id } = useParams();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    userProfileImg: "",
    selectedCountry: ""
  });
  const [err, setErr] = useState({});
  const handleFileChange = (e) => {
    const file1 = e.target.files[0];

    let allowedExtensions = /[\/.](jpg|jpeg|png)$/i;

    if (!allowedExtensions.exec(file1.type)) {
      toast.error("Invalid file type, Please upload only jpg, png file type!");
      return;
    } else {
      setFile(file1);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setUserData({ ...userData, userProfileImg: file1 });
      setPreview(objectUrl);
    }
  };
  const getCustomerDetails = () => {
    setUserData(props?.editUserBookingDetail);
    setDateOfBirth(props?.editUserBookingDetail?.dob);
  };
  useEffect(() => {
    getCustomerDetails();
  }, [props?.editUserBookingDetail]);
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const onInputChangePhonenumber = (e) => {
    const { name, value } = e.target;
    let formattedNumber = value.replace(/\D/g, "");
    if (name === "phoneNumber") {
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

  const validate = () => {
    let isValid = true;
    const formError = {};
    const phoneNo = /^\d{10,15}$/;
    if (!userData?.name) {
      isValid = false;
      formError["name"] = "Name is required";
    } else if (userData?.name.trim() === "") {
      isValid = false;
      formError["name"] = "Please enter name";
    }
    if (!userData?.phoneNumber) {
      isValid = false;
      formError["phoneNumber"] = "Phone number is required";
    } else if (!phoneNo.test(userData?.phoneNumber.replace(/-/g, ""))) {
      isValid = false;
      formError["phoneNumber"] = "Phone number must be of 10-12 digits";
    }
    if (!userData.address) {
      isValid = false;
      formError["address"] = "Address is required";
    } else if (userData?.address.trim() === "") {
      isValid = false;
      formError["address"] = "Please enter address";
    }
    const dateOB = new Date(userData?.dob);
    const dateOBDate = moment(dateOB).format("MMMM DD, yyyy");
    const dateOBSeconds = moment(dateOB).format("X");
    const currentDate = new Date();
    const currentDateDate = moment(currentDate).format("MMMM DD, yyyy");
    const currentDateSeconds = moment(currentDate).format("X");
    if (dateOBDate === currentDateDate) {
      isValid = false;
      formError["dob"] = "Date should be less than current date";
    }
    setErr(formError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("userProfileImg", userData.userProfileImg);
      formData.append("dob", userData.dob ? userData.dob : "");
      formData.append("address", userData.address.trim());
      formData.append("phoneNumber", userData.phoneNumber);
      formData.append("email", userData.email);
      formData.append("name", userData.name.trim());
      formData.append("selectedCountry", selectedCountry ? selectedCountry : userData.selectedCountry);
      if (file) {
        const response = await userBookingService.editBookingUser(
          id,
          formData,
          reduxToken
        );
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        if (response.status == 200) {
          setIsLoading(false);
          createNotification("success", response?.data?.message);
          props.getUser();
          props.setShow(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        const obj = {
          ...userData,
          name: userData.name.trim(),
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: userData.address.trim(),
          dob: userData.dob,
          selectedCountry: selectedCountry ? selectedCountry : userData.selectedCountry,
        };
        const response = await userBookingService.editBookingUser(
          id,
          obj,
          reduxToken
        );
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          props.getUser();
          props.setShow(false);
        } else {
          console.log(":::error");
          setIsLoading(false);
        }
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
  const closeed = () => {
    props.EditProfileClose();
  };
  return (
    <Modal className="addproduct-wrapper" show={props.show} onHide={closeed}>
      <Modal.Header closeButton>
        <h2>Edit Profile</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="editprofile-form">
          <Form>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Add Full Name"
                    value={userData?.name ? userData?.name : ""}
                    onChange={onInputChange}
                  />
                  <span className="error" style={{ color: "red" }}>
                    {err && err.name}
                  </span>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    disabled="true"
                    placeholder="Add Email Address"
                    value={userData.email ? userData.email : ""}
                    onChange={onInputChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
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
                      pattern="[0-9]*"
                      placeholder="Add Phone Number"
                      name="phoneNumber"
                      value={userData.phoneNumber ? userData.phoneNumber : ""}
                      onChange={onInputChangePhonenumber}
                    />
                  </div>

                  <span className="error" style={{ color: "red" }}>
                    {err && err.phoneNumber}
                  </span>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3 inoice-field date-field">
                  <Form.Label>Date Of Birth</Form.Label>
                  <div className="selectdate-field">
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={
                            userData?.dob ? new Date(userData?.dob) : ""
                          }
                          onChange={(date) =>
                            setUserData({ ...userData, dob: date })
                          }
                          dateFormat="MMMM d, yyyy"
                          maxDate={new Date()}
                          placeholderText="Enter Date Of Birth"
                        />
                        <span className="error" style={{ color: "red" }}>
                          {err && err.dob}
                        </span>
                      </div>
                    </InputGroup>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Image</Form.Label>
                  <div className="inventory-pdimg">
                    <Form.Control
                      type="file"
                      id="new"
                      accept=".jpg, .png"
                      ref={inputRef}
                      onChange={handleFileChange}
                      readOnly
                    />
                    <Button onClick={handleUpload}>
                      {!userData.userProfileImg ? "Add Image" : "Edit Image"}
                    </Button>
                    <div className="upload-img">
                      {userData?.userProfileImg
                        ? !file && (
                          <img
                            src={`${imgUrl}/${userData.userProfileImg}`}
                            style={{ width: 200, height: 100 }}
                          />
                        )
                        : ""}
                      {file && (
                        <img
                          src={preview}
                          style={{ width: 200, height: 100 }}
                        />
                      )}
                    </div>
                  </div>
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    name="address"
                    value={userData.address ? userData.address : ""}
                    onChange={onInputChange}
                  />
                  <span className="error" style={{ color: "red" }}>
                    {err && err.address}
                  </span>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="submitbtn">
          <Button disabled={isLoading ? true : false} className="nextbtn" onClick={handleSubmit}>
            {isLoading ? (
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
export default EditProfileModal;
