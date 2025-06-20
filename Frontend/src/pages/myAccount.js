import React, { useState, useEffect } from "react";
import { Container, Breadcrumb, Button, Form, Col, Row, Modal } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import Footer from "../components/footer";
import ReactTooltip from "react-tooltip";
import { BiMessageRoundedError } from "react-icons/bi";
import { MdHome } from "react-icons/md";
import { getUserWithId } from "../services/userServices";
import { useParams } from "react-router-dom";
import states from "../config/state.json";
import { getAllbussTypes } from "../services/businessServices";
import { editUserData ,deactivateAccount } from "../services/userServices";
import * as authServices from "../services/authServices";
import { createNotification } from "../helper/notification";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Multiselect from "multiselect-react-dropdown";
import Loader from "../helper/loader";

const Myaccount = ({ notificationCount, setNotificationCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [countryCode, setCountryCode] = useState("")
  const [businessCountryCode, setBusinessCountryCode] = useState("")
  const [mobilePhone, setMobilePhone] = useState("");
  const [reffered, setReffered] = useState("");
  const [userState, setUserState] = useState([]);
  const [state, setState] = useState("");
  const [bussType, setBussType] = useState([]);
  const [countryData, setCountryData] = useState([])
  const [businessType, setBusinessType] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planName, setPlanName] = useState("");

  
  const [err, setErr] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBusinessCountry, setSelectedBusinessCountry] = useState('');
  const [newBussType, setNewBussType] = useState([]);
  const [loader, setLoader] = useState(true);
  const [userType, setUserType] = useState();
  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);

  const getAllbusinessTypes = async () => {
    let arr = [];
    const response = await getAllbussTypes();

    if (response.status === 200) {
      if (response?.data.length > 0) {
        response.data.map((resp) => {
          return arr.push({ type: resp.businessType, id: resp._id });
        });
      }
      setBussType(arr);
    }
  };

  useEffect(() => {
    getAllbusinessTypes();
  }, []);
  useEffect(() => {
    setUserState(states.states);
  }, []);

  const getAllCountryData = async () => {
    const response = await authServices.getCountryData();

    if (response?.status === 200) {
      setCountryData(response?.data)
    }
  };

  useEffect(() => {
    getAllCountryData();
  }, []);

  const getUserData = async () => {
    setLoader(true);
    const response = await getUserWithId(id);

    if (response) {
      setUserType(response && response?.data && response?.data?.type)
      setLoader(false);
      setBusinessName(
        response && response?.data && response?.data?.businessName
          ? response?.data?.businessName
          : ""
      );
      setFirstName(
        response && response?.data && response?.data?.firstName
          ? response?.data?.firstName
          : ""
      );
      setEmail(
        response && response?.data && response?.data?.email
          ? response?.data?.email
          : ""
      );
      setCountryCode(response && response?.data && response?.data?.selectedCountry
        ? response?.data?.selectedCountry
        : "");
      setBusinessCountryCode(response && response?.data && response?.data?.selectedBusinessCountry
        ? response?.data?.selectedBusinessCountry
        : "");
      setBusinessPhone(
        response && response?.data && response?.data?.phone
          ? response?.data?.phone
          : ""
      );
      setMobilePhone(
        response && response?.data && response?.data?.mobile
          ? response?.data?.mobile
          : ""
      );
      setReffered(
        response && response?.data && response?.data?.reffered
          ? response?.data?.reffered
          : ""
      );
      setState(
        response && response?.data && response?.data?.state
          ? response?.data?.state
          : ""
      );
      setBusinessType(response?.data?.businessType);

      setPlanPrice(
        response &&
        response?.data &&
        response?.data?.planDeatils &&
        response?.data?.planDeatils?.price
      );
      setPlanName(response &&
        response?.data &&
        response?.data?.planDeatils &&
        response?.data?.planDeatils?.planName)
    } else {
      setLoader(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, [id]);

  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    const [countryCode, countryName] = selectedOption.split(',');
    setSelectedCountry(`${countryCode}${countryName}`);
  };

  const handleBusinessCountryChange = (e) => {
    const selectedOption = e.target.value;
    const [countryCode, countryName] = selectedOption.split(',');
    setSelectedBusinessCountry(`${countryCode}${countryName}`);
  };

  const business = (arr1, arr2) => {
    var finalArr = arr2.filter((val) => {
      if (arr1.includes(val.id)) {
        return true;
      }
      return false;
    });

    setNewBussType(finalArr);
  };
  useEffect(() => {
    if (businessType.length > 0 && bussType.length > 0) {
      business(businessType, bussType);
    }
  }, [businessType, bussType]);
  const validation = () => {
    let isValid = true;
    const formError = {};
    const regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    let phoneNo = /^\d{10,15}$/;
    const regex1 = /^\+?1?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
    let pwd = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/
    );

    if (!email) {
      isValid = false;
      formError["email"] = "Email is required";
    } else if (!regex.test(email)) {
      isValid = false;
      formError["email"] = "Please enter a valid email address";
    }
    if (!firstName) {
      isValid = false;
      formError["firstName"] = "Name is required";
    } else if (firstName.trim() === "") {
      isValid = false;
      formError["firstName"] = "Please enter name";
    }
    if (!mobilePhone) {
      isValid = false;
      formError["mobile"] = "Mobile number is required";
    } else if (!phoneNo.test(mobilePhone.replace(/-/g, ""))) {
      isValid = false;
      formError["mobile"] = "Mobile number must be of 10-12 digits";
    }
    if (!businessPhone) {
      isValid = false;
      formError["phone"] = " Business phone is required";
    } else if (!phoneNo.test(businessPhone.replace(/-/g, ""))) {
      isValid = false;
      formError["phone"] = "Business phone must be of 10-12 digits";
    }
    if (state === "Select Residence") {
      isValid = false;
      formError["state"] = "Residence is required";
    }
    if (!businessType) {
      isValid = false;
      formError["businessType"] = "Business Type is required";
    }
    if (!businessName) {
      isValid = false;
      formError["businessName"] = "Business Name is required";
    } else if (businessName.trim() === "") {
      isValid = false;
      formError["businessName"] = "Please enter businessName";
    }
    if (reffered === "Select Referrence") {
      isValid = false;
      formError["reffered"] = "Referrence is required";
    }
    setErr(formError);
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validation()) {
      let arr = [];
      newBussType.map((item) => arr.push(item.id));
      const user = {
        firstName: firstName.trim(),
        phone: businessPhone,
        mobile: mobilePhone,
        state: state,
        businessName: businessName.trim(),
        businessType: arr,
        reffered: reffered,
        selectedCountry: selectedCountry ? selectedCountry : countryCode,
        selectedBusinessCountry: selectedBusinessCountry ? selectedBusinessCountry : countryCode,
      };
      const response = await editUserData(id, user);
      if (response.status === 200) {
        createNotification("success", response.message);
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 3000);
      } else {
        createNotification("error", response.message);
      }
    }
  };
  const handleDeactivateClick = () => {
    setShowDeactivatePopup(true);
  };
  const handleDeactivateConfirm = async() => {
    const response = await deactivateAccount(id,firstName,email);
    if (response.status === 200) {
      createNotification("success", response.message);
      setTimeout(() => {
        // navigate(`/dashboard`);
        navigate("/logout");
      }, 3000);
    } else if(response.status === 201) {
      createNotification("warning", response.message);
    }
    else {
      createNotification("error", response.message);
    }
    setShowDeactivatePopup(false);
  };

  const handleDeactivateCancel =  () => {
   

    setShowDeactivatePopup(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedNumber = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (name === 'phone') {
      if (formattedNumber.length > 12) {
        formattedNumber = formattedNumber.slice(0, 12);
      }
      if (formattedNumber.length >= 10) {
        const firstThreeDigits = formattedNumber.slice(0, 3);
        const nextThreeDigits = formattedNumber.slice(3, 6);
        const remainingDigits = formattedNumber.slice(6);

        const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;
        setBusinessPhone(formattedPhoneNumber);
      } else {
        setBusinessPhone(formattedNumber);
      }
    } else if (name === 'mobile') {
      if (formattedNumber.length > 12) {
        formattedNumber = formattedNumber.slice(0, 12);
      }
      if (formattedNumber.length >= 10) {
        const firstThreeDigits = formattedNumber.slice(0, 3);
        const nextThreeDigits = formattedNumber.slice(3, 6);
        const remainingDigits = formattedNumber.slice(6);

        const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;
        setMobilePhone(formattedPhoneNumber);
      } else {
        setMobilePhone(formattedNumber);
      }
    }


  };

  const handleUpgrade = () => {
    navigate(`/Pricing/${id}`);
  };
  return (
    <div>
      <HeaderTop
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
      <div className="myaccount-wrapper">
        <Container>
          <div className="myaccount-layout layout-wrapper">
            <div className="breadcurm-bar">
              <h2>
                Welcome to <b>Bisi Blvd</b>
              </h2>
              <Breadcrumb>
                <Breadcrumb.Item href="#">
                  <MdHome />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>My Account</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div className="account-detail">
              <div class="account-subheading">
                <h2>User Information</h2>
                <p>Here you can edit public information about yourself.</p>
              </div>

              <div className="form-wrapper">
                {loader ? (
                  <Loader />
                ) : (
                  <Form onSubmit={submitHandler}>
                    <Row>
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Business Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="businessName"
                              value={businessName ? businessName : ""}
                              onChange={(e) => {
                                setBusinessName(e.target.value);
                              }}
                              placeholder="Business Name"
                            />
                            <span className="error">
                              {err && err.businessName}
                            </span>
                          </Form.Group>
                        </Col>
                        : ""}
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Your Name"
                            name="firstName"
                            value={firstName ? firstName : ""}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                            }}
                          />
                          <span className="error">{err && err.firstName}</span>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="email"
                            placeholder="Email Address"
                            value={email ? email : ""}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3 tooltiplabel">
                            <Form.Label>Business Phone  <span
                              className="toltip-icon"
                              data-background-color="#1c5141"
                              data-tip="SMS will be send on only Mobile number"
                              data-place="right"
                              data-for="phn"
                            >
                              <BiMessageRoundedError />
                            </span>
                              <ReactTooltip id="phn" /></Form.Label>
                            <div className="selectinput-field">
                              <Form.Select name="state" onChange={handleBusinessCountryChange} >
                                <option value="">{businessCountryCode}</option>
                                {Object.entries(countryData).map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control
                                type="text"
                                name="phone"
                                placeholder="Business Phone"
                                value={businessPhone ? businessPhone : ""}
                                onChange={handleChange}
                              />
                            </div>

                            <span className="error">{err && err.phone}</span>
                          </Form.Group>
                        </Col>
                        : ""}

                      <Col xs={6}>
                        <Form.Group className="mb-3 tooltiplabel">
                          <Form.Label>Mobile Number  <span
                            className="toltip-icon"
                            data-background-color="#1c5141"
                            data-tip="SMS will be send on only Mobile number"
                            data-place="right"
                            data-for="mnph"
                          >
                            <BiMessageRoundedError />
                          </span>
                            <ReactTooltip id="mnph" /></Form.Label>
                          <div className="selectinput-field">
                            <Form.Select name="state" onChange={handleCountryChange} >
                              <option value="">{countryCode}</option>
                              {Object.entries(countryData).map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control
                              type="text"
                              name="mobile"
                              placeholder="Mobile Number"
                              value={mobilePhone ? mobilePhone : ""}
                              onChange={handleChange}
                            />
                          </div>

                          <span className="error">{err && err.mobile}</span>
                        </Form.Group>
                      </Col>
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Your State of Residence</Form.Label>
                            <Form.Select
                              name="state"
                              value={state ? state : ""}
                              onChange={(e) => {
                                setState(e.target.value);
                              }}
                            >
                              <option>Select Residence</option>
                              {userState &&
                                userState.length > 0 &&
                                userState.map((state) => (
                                  <option key={state.name}>{state.name}</option>
                                ))}
                            </Form.Select>
                            <span className="error">{err && err.state}</span>
                          </Form.Group>
                        </Col>
                        : ""}
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3 business-type-feild">
                            <Form.Label>Business Type(Profession)</Form.Label>
                            <Multiselect
                              selectedValues={newBussType}
                              displayValue="type"
                              className="input-control multiselect"
                              name="items"
                              disable
                            />
                            <span className="error">
                              {err && err.businessType}
                            </span>
                          </Form.Group>
                        </Col>
                        : ""}
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              How did you hear about Bisi Boulevard?
                            </Form.Label>
                            <Form.Select
                              name="reffered"
                              value={reffered ? reffered : ""}
                              onChange={(e) => {
                                setReffered(e.target.value);
                              }}
                            >
                              <option>Select Referrence</option>
                              <option value="Google">Google</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Referral">Referral</option>
                            </Form.Select>
                            <span className="error">{err && err.reffered}</span>
                          </Form.Group>
                        </Col>
                        : ""}
                      {userType === "user" ?
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Current Plan</Form.Label>
                            <div className="currentplan-field">
                              <Form.Control
                                type="text"
                                name="plan"
                                value={planName ? `${planName} - $${planPrice}` : ""}
                                disabled
                              />

                              <button className="planbtn" onClick={handleUpgrade}>
                                Upgrade Plan
                              </button>
                            </div>
                          </Form.Group>
                        </Col>

                        : ""}
                      <Col xs={6}>
                        <div className="de-activate-btn text-end">
                          <button type="button" onClick={handleDeactivateClick}>
                            Deactivate my account
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Button type="submit">Submit</Button>
                  </Form>

                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Modal show={showDeactivatePopup} onHide={handleDeactivateCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to deactivate you account?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-secondary" variant="secondary" onClick={handleDeactivateCancel}>
            No
          </Button>
          <Button className="btn btn-danger" variant="primary" onClick={handleDeactivateConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Myaccount;
