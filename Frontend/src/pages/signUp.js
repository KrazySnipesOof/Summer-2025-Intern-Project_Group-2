import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import { Rings } from "react-loader-spinner";
import { BsChevronDoubleRight } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import * as authServices from "../services/authServices";
import * as authActions from "../store/action/authAction";
import { useDispatch } from "react-redux";

import { createNotification } from "../helper/notification";
import { useNavigate } from "react-router-dom";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import * as businessServices from "../services/businessServices";
import Footer from "../components/footer";
import states from "../config/state.json";
import ReactTooltip from "react-tooltip";
import Multiselect from "multiselect-react-dropdown";
import { getTokens } from "../helper/firebase";
import { BiMessageRoundedError } from "react-icons/bi";

const Signup = ({ notificationCount, setNotificationCount }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenFound, setTokenFound] = useState("");
  const [fcmToken, setFCMToken] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
    businessName: "",
    firstName: "",
    phone: "",
    mobile: "",
    state: "",
    reffered: "",
  });
  const [bussType, setBussType] = useState([]);
  const [err, setErr] = useState({});
  const [userState, setUserState] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("US +1");
  const [selectedBusinessCountry, setSelectedBusinessCountry] =
    useState("US +1");
  // const [showPasswords, setShowPassword] = useState(true);

  const {
    email,
    password,
    firstName,
    phone,
    mobile,
    state,
    businessName,
    reffered,
  } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "mobile") {
      let inputNumber = value.replace(/\D/g, "");
      let formattedNumber = inputNumber;

      if (inputNumber.length >= 10) {
        if (inputNumber.length > 12) {
          inputNumber = inputNumber.slice(0, 12);
        }
        const firstThreeDigits = inputNumber.substr(0, 3);
        const nextThreeDigits = inputNumber.substr(3, 3);
        const remainingDigits = inputNumber.substr(6);

        formattedNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;
      } else if (inputNumber.length === 10) {
        formattedNumber = inputNumber.replace(
          /^(\d{3})(\d{3})(\d{4})$/,
          "$1-$2-$3"
        );
      }

      setUser({
        ...user,
        [name]: formattedNumber,
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
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

  const validation = () => {
    const { email, password } = user;
    let isValid = true;
    const formError = {};
    const regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    let phoneNo = /^\d{10,15}$/;

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
    if (!password) {
      isValid = false;
      formError["password"] = "Password is required";
    } else if (!pwd.test(password)) {
      isValid = false;
      formError["password"] =
        "Your password should have at least one special character, digits, uppercase and lowercase character, Length: 8+ character.";
    }
    if (!firstName) {
      isValid = false;
      formError["firstName"] = "Name is required";
    } else if (firstName.trim() === "") {
      isValid = false;
      formError["firstName"] = "Please enter name";
    }
    if (!mobile && selectedCountry == "") {
      isValid = false;
      formError["mobile"] = "Mobile number and country code is required";
    } else if (!mobile) {
      isValid = false;
      formError["mobile"] = "Mobile number is required";
    } else if (selectedCountry == "") {
      isValid = false;
      formError["mobile"] = "Country code is required";
    } else if (!phoneNo.test(mobile.replace(/-/g, ""))) {
      isValid = false;
      formError["mobile"] = "Mobile number must be of 10-12 digits";
    }
    if (!phone) {
      isValid = false;
      formError["phone"] = "Business phone is required";
    } else if (!phoneNo.test(phone.replace(/-/g, ""))) {
      isValid = false;
      formError["phone"] = "Business phone must be 10-15 digits only";
    }
    if (!state) {
      isValid = false;
      formError["state"] = "Residence is required";
    }
    if (!items.length) {
      isValid = false;
      formError["items"] = "Business Type is required";
    }
    if (!businessName) {
      isValid = false;
      formError["businessName"] = "Business Name is required";
    } else if (businessName.trim() === "") {
      isValid = false;
      formError["businessName"] = "Please enter businessName";
    }
    if (!reffered) {
      isValid = false;
      formError["reffered"] = "Referrence is required";
    }
    setErr(formError);
    return isValid;
  };

  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedCountry(selectedOption);
  };

  const handleBusinessCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedBusinessCountry(selectedOption);
  };

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (validation()) {
      setIsLoading(true);
      let arr = [];
      items.map((item) => arr.push(item.id));
      let data = {
        businessType: arr,
        fcmToken: fcmToken,
        selectedCountry,
        selectedBusinessCountry,
        ...user,
      };
      const response = await authServices.register(data);
      if (response.status === 201) {
        createNotification("success", response.data.message);
        if (
          response &&
          response.data &&
          response?.data?.data?.status == 0 &&
          response?.data?.data?.HistoryActivateStatus == false
        ) {
          setTimeout(() => {
            navigate(`/DeactivateAccount/${response?.data?.data?._id}`);
          }, 5000);
        } else {
          setTimeout(() => {
            setIsLoading(false);
            navigate("/");
            // dispatch(authActions.loginUser(signindata, navigate));
          }, 5000);
        }
      } else {
        createNotification("error", "Email Already Exists");
        setIsLoading(false);
      }
    }
  };

  const getAllbusinessTypes = async () => {
    let arr = [];
    const response = await businessServices.getAllbussTypesforsignup();
    if (response.status === 200) {
      if (response?.data.length > 0) {
        response.data.map((resp) => {
          return arr.push({ type: resp.businessType, id: resp._id });
        });
      }
      setBussType(arr);
    }
  };

  const getAllCountryData = async () => {
    const response = await authServices.getCountryData();

    if (response?.status === 200) {
      setCountryData(response?.data);
    }
  };

  useEffect(() => {
    getAllCountryData();
  }, []);

  const handleRemove = (selectedList) => {
    setItems(selectedList);
  };

  const handleSelect = (selectedList) => {
    setItems(selectedList);
  };

  useEffect(() => {
    getAllbusinessTypes();
  }, []);

  useEffect(() => {
    setUserState(states.states);
  }, []);

  return (
    <>
      <div className="login-page-wrapper">
        <HeaderTop
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />
        <div className="Login-wrapper">
          <Container>
            <div className="Signup-form">
              <h2 className="title">SIGN UP TODAY!</h2>
              <div className="form-wrapper">
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="businessName"
                          placeholder="Business Name"
                          value={businessName}
                          onChange={handleChange}
                        />
                        <span className="error">{err && err.businessName}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Your Name"
                          name="firstName"
                          value={firstName}
                          onChange={handleChange}
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
                          value={email}
                          onChange={handleChange}
                        />
                        <span className="error">{err && err.email}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Password
                          <span
                            className="toltip-icon"
                            data-background-color="#1c5141"
                            data-tip="Your password should have at least one special character, digits, uppercase and lowercase character, Length: 8+ character."
                          >
                            <MdOutlineReportGmailerrorred />
                          </span>
                        </Form.Label>
                        <ReactTooltip />
                        <div className="pas-word">
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                          />
                          <span className="error">{err && err.password}</span>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3 tooltiplabel">
                        <Form.Label>
                          Business Phone{" "}
                          <span
                            className="toltip-icon"
                            data-background-color="#1c5141"
                            data-tip="SMS will be send on only Mobile number"
                            data-place="right"
                            data-for="bph"
                          >
                            <BiMessageRoundedError />
                          </span>
                          <ReactTooltip id="bph" />
                        </Form.Label>
                        <div className="selectinput-field">
                          <Form.Select
                            name="state"
                            onChange={handleBusinessCountryChange}
                            value={selectedBusinessCountry}
                          >
                            <option value="US,+1">US +1</option>
                            {Object.entries(countryData).map(([code, name]) => (
                              <option key={code} value={`${code}${name}`}>
                                {`${code}${name}`}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control
                            type="text"
                            name="phone"
                            placeholder="Business Phone"
                            value={phone}
                            onChange={handleChange}
                          />
                        </div>

                        <span className="error">{err && err.phone}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3 tooltiplabel">
                        <Form.Label>
                          Mobile Number{" "}
                          <span
                            className="toltip-icon"
                            data-background-color="#1c5141"
                            data-tip="SMS will be send on only Mobile number"
                            data-place="right"
                            data-for="mnph"
                          >
                            <BiMessageRoundedError />
                          </span>
                          <ReactTooltip id="mnph" />
                        </Form.Label>
                        <div className="selectinput-field">
                          <Form.Select
                            name="state"
                            onChange={handleCountryChange}
                            value={selectedCountry}
                          >
                            <option value="US,+1">US +1</option>
                            {Object.entries(countryData).map(([code, name]) => (
                              <option key={code} value={`${code}${name}`}>
                                {`${code}${name}`}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={mobile}
                            onChange={handleChange}
                          />
                        </div>
                        <span className="error">{err && err.mobile}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your State of Residence</Form.Label>
                        <Form.Select name="state" onChange={handleChange}>
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
                    <Col xs={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Business Type(Profession)
                          <span
                            className="toltip-icon"
                            data-background-color="#1c5141"
                            data-tip="In this version you want to be able to update your business types later once an account has been created so please a little more careful "
                          >
                            <MdOutlineReportGmailerrorred />
                          </span>
                        </Form.Label>

                        <Multiselect
                          options={bussType}
                          selectedValues={items}
                          onSelect={handleSelect}
                          onRemove={handleRemove}
                          displayValue="type"
                          className="input-control multiselect"
                          name="items"
                        />
                        <span className="error">{err && err.items}</span>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          How did you hear about Bi$i Boulevard?
                        </Form.Label>
                        <Form.Select name="reffered" onChange={handleChange}>
                          <option>Select Referrence</option>
                          <option value="linkedin">Linkedin</option>
                          <option value="Facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="pinterest">Pinterest</option>
                        </Form.Select>
                        <span className="error">{err && err.reffered}</span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" disabled={isLoading}>
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
                      <> SignUp</>
                    )}
                    <BsChevronDoubleRight />
                  </Button>
                </Form>
              </div>
              <div className="newaccount">
                Already have an account ?<Link to="/"> Login</Link>
              </div>
              <div className="mt-3 d-flex newaccount justify-content-center">
                I have an activation code.{" "}
                <Link to="/license-activation" className="font-weight-bold">
                  {" "}
                  Activate
                </Link>
              </div>
            </div>
          </Container>
        </div>

        <ToastContainer />
        <Footer />
      </div>
    </>
  );
};

export default Signup;
