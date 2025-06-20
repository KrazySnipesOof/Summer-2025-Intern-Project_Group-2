import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../components/footer";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import * as authServices from "../services/authServices";
import * as enterpriseServices from "../services/enterpriseService";
import { BiMessageRoundedError } from "react-icons/bi";
import { getTokens } from "../helper/firebase";

const LicenseActivate = ({ notificationCount, setNotificationCount }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstName: "",
    phone: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState({});
  const [level, setLevel] = useState(0);
  const [countryData, setCountryData] = useState([]);
  const [enterpriseData, setEnterpriseData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("US +1");
  const [selectedBusinessCountry, setSelectedBusinessCountry] =
    useState("US +1");
  const [fcmToken, setFCMToken] = useState("");

  const getAllCountryData = async () => {
    const response = await authServices.getCountryData();
    if (response?.status === 200) {
      setCountryData(response?.data);
    }
  };

  useEffect(() => {
    getAllCountryData();
  }, []);

  useEffect(() => {
    async function tokenFunc() {
      const data = await getTokens(() => {});
      if (data) {
        setFCMToken(data);
      }
    }
    tokenFunc();
  }, []);

  const validate = () => {
    const { email, password, phone, mobile, firstName } = user;
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
    setErr(formError);
    return isValid;
  };

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
  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedCountry(selectedOption);
  };

  const handleBusinessCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedBusinessCountry(selectedOption);
  };

  const fetchEnterpriseData = async () => {
    setIsLoading(true);
    try {
      const response = await enterpriseServices.getEnterpriseByKey(code);
      if (response?.success) {
        setEnterpriseData(response?.data);
        setLevel(1);
      } else {
        toast.error("Enter a valid activation key");
      }
    } catch (error) {
      console.log(error);
      toast.error("Enter a valid activation key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      let data = {
        fcmToken: fcmToken,
        businessType: enterpriseData?.businessType,
        businessName: enterpriseData?.enterpriseName,
        withEnterprise: true,
        selectedCountry,
        selectedBusinessCountry,
        ...user,
      };
      setIsLoading(true);
      try {
        const response = await authServices.register(data);
        if (response.status === 201) {
          let enterpriseObj = {
            key: code,
            userId: response?.data?.data?._id,
          };
          const joinResp = await enterpriseServices.addUserToEnterprise(
            enterpriseObj
          );
          if (joinResp.success) {
            toast.success("Your account activated successfully!");
            setTimeout(() => {
              setIsLoading(false);
              navigate("/");
            }, 3000);
          } else {
            toast.error("Something went wrong");
            setIsLoading(false);
          }
        } else {
          toast.error(response.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    }
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
            <div className={`license-form ${level === 0 ? "first" : "second"}`}>
              <div className="d-flex gap-2 align-items-center mb-3">
                {level !== 0 && (
                  <IoArrowBack
                    className="icon-back"
                    size={28}
                    onClick={() => {
                      setLevel(0);
                      setUser({});
                      setErr({});
                    }}
                  />
                )}
                <h2 className="title mb-0">Activate</h2>
              </div>
              <div className="form-wrapper license">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (level === 0) {
                      fetchEnterpriseData();
                    } else {
                      handleSubmit();
                    }
                  }}
                >
                  {level === 0 ? (
                    <div className="content">
                      <Form.Group className="">
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="code"
                          placeholder="Enter code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  ) : (
                    <div className="content">
                      <Row className="mb-3">
                        <Col xs={6}>
                          <Form.Group className="">
                            <Form.Label>Business Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="businessName"
                              value={enterpriseData?.enterpriseName}
                              disabled
                            />
                            <span className="error">{err && err.code}</span>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              placeholder="Enter your name"
                              value={user.firstName}
                              onChange={handleChange}
                            />
                            <span className="error">
                              {err && err.firstName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col xs={6}>
                          <Form.Group className="">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="email"
                              placeholder="Enter email address"
                              value={user.email}
                              onChange={handleChange}
                            />
                            <span className="error">{err && err.email}</span>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="">
                            <Form.Label>
                              Password{" "}
                              <span
                                className="toltip-icon pb-1"
                                data-background-color="#1c5141"
                                data-tip="Your password should have at least one special character, digits, uppercase and lowercase character, Length: 8+ character."
                              >
                                <MdOutlineReportGmailerrorred />
                              </span>
                            </Form.Label>
                            <ReactTooltip />
                            <Form.Control
                              type="password"
                              name="password"
                              placeholder="Enter password"
                              value={user.password}
                              onChange={handleChange}
                            />
                            <span className="error">{err && err.password}</span>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
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
                                {Object.entries(countryData).map(
                                  ([code, name]) => (
                                    <option key={code} value={`${code}${name}`}>
                                      {`${code}${name}`}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                              <Form.Control
                                type="text"
                                name="phone"
                                placeholder="Enter business Phone"
                                value={user.phone}
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
                                {Object.entries(countryData).map(
                                  ([code, name]) => (
                                    <option key={code} value={`${code}${name}`}>
                                      {`${code}${name}`}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                              <Form.Control
                                type="text"
                                name="mobile"
                                placeholder="Enter mobile Number"
                                value={user.mobile}
                                onChange={handleChange}
                              />
                            </div>
                            <span className="error">{err && err.mobile}</span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                  <Button type="submit" disabled={!code || isLoading}>
                    Activate
                  </Button>
                </Form>
              </div>
              {level === 0 && (
                <div className="newaccount">
                  Don't have an account yet? <Link to="/Signup"> SignUp</Link>
                </div>
              )}
            </div>
            <ToastContainer autoClose={5000} />
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LicenseActivate;
