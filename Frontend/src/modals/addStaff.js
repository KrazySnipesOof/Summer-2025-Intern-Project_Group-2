  import Button from "react-bootstrap/Button";
  import Modal from "react-bootstrap/Modal";
  import React from "react";
  import { useState ,useEffect } from "react";
  import Col from "react-bootstrap/Col";
  import Form from "react-bootstrap/Form";
  import Row from "react-bootstrap/Row";
  import MessageIcon from "../assets/icons/MessageIcon";
  import Switch from "@mui/material/Switch";
  import FormControlLabel from "@mui/material/FormControlLabel";
  import * as authServices from "../services/authServices";
  import { createNotification } from "../helper/notification";
  import * as staffService from "../services/staffServices";
  import { useDispatch } from "react-redux";
  import { Rings } from "react-loader-spinner";
  import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
  import { MdClose } from "react-icons/md";
  import { useNavigate } from "react-router-dom";
  import { useSelector } from "react-redux";
import { setActiveTabs } from "../store/action/activeTabAction";

    const AddStafModal = ({setAddError,addError, setstaffAddData ,  staffAddData, selectedPermission, setSelectedPermission , getstaff, handleHidestaffModal,modalShow}) => {
    const dispatch =useDispatch()
    const [countryData, setCountryData] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('US +1');
    const reduxToken = useSelector((state) => state?.auth?.token);
    const loggedInUserId = useSelector((state) => state?.auth?.user?._id);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const inputChange = (e) => {
      const { name, value } = e.target;
      setstaffAddData({ ...staffAddData, [name]: value });
    };
    const inputChange1 = (e) => {
      const { name, value } = e.target;
      let sanitizedValue = value.replace(/[^0-9]/g, "");
      if (name === "phoneNumber") {
        if (sanitizedValue.length > 12) {
          sanitizedValue = sanitizedValue.slice(0, 12);
        }
        if (sanitizedValue.length >= 10) {
          const firstThreeDigits = sanitizedValue.slice(0, 3);
          const nextThreeDigits = sanitizedValue.slice(3, 6);
          const remainingDigits = sanitizedValue.slice(6);
          const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;
          setstaffAddData((prevData) => ({
            ...prevData,
            [name]: formattedPhoneNumber,
          }));
        } else {
          setstaffAddData((prevData) => ({
            ...prevData,
            [name]: sanitizedValue,
          }));
        }
      } else {
        setstaffAddData((prevData) => ({
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
      let selectedCountry1 = staffAddData.countryCode ? staffAddData.countryCode : staffAddData.selectedBenificialCountry;
      selectedCountry1 = selectedCountry.replace(/,/g, '').trim();
      const obj = {
        firstName: staffAddData.name ? staffAddData.name.trim() : staffAddData.name,
        email: staffAddData.email,
        selectedCountry: selectedCountry1,
        mobile: staffAddData.phoneNumber,
        addedBy:loggedInUserId,
        permission:selectedPermission,
        status:1,
        loginStatus:1,
        type : "staff",
      };
      const Validation = () => {
        let err = {};
        let isValid = true;
        let phoneNumbers = /^\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{4}$/;
        const phoneNo = /^\d{10,15}$/;
        let regex = new RegExp(
          /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
        );
        if (!staffAddData.name) {
          err["name"] = "Name is required";
          isValid = false;
        } else if (staffAddData.name.trim() === "") {
          err["name"] = "Please enter name";
          isValid = false;
        }
        if (!staffAddData.email) {
          isValid = false;
          err["email"] = "Email is required";
        } else if (staffAddData.email.trim() === "") {
          isValid = false;
          err["email"] = "Email is required";
        } else if (!regex.test(staffAddData.email)) {
          isValid = false;
          err["email"] = "Please enter a valid email address";
        }
        if (!staffAddData.phoneNumber && selectedCountry == "") {
          isValid = false;
          err["phoneNumber"] = "Phone number and country code is required";
        } else if (!staffAddData.phoneNumber) {
          isValid = false;
          err["phoneNumber"] = "Phone number is required";
        } else if (selectedCountry == "") {
          isValid = false;
          err["phoneNumber"] = "Country code is required";
        }
        else if (staffAddData.phoneNumber.trim() === "") {
          err["phoneNumber"] = "Phone number is required";
          isValid = false;
        }
        else if (!phoneNo.test(staffAddData.phoneNumber.replace(/-/g, ""))) {
          isValid = false;
          err["phoneNumber"] = "Phone number must be of 10-15 digits";
        }
        setAddError(err);
        return isValid;
      };  
      if (Validation()) {
        if (reduxToken) {
          setLoader(true);
          const response = await staffService.addStaff(obj);
          setTimeout(() => {
            setLoader(false);
          }, 3000);
          if (response?.data?.success == true) {
            createNotification("success", response?.data?.message);
            getstaff()
            setTimeout(() => {
            dispatch(setActiveTabs(5))
            navigate("/setting");
              handleHidestaffModal()
            }, 3000);
            setstaffAddData({
              name: "",
              email: "",
              phoneNumber: "",
              userId:"",
            })
          } else {
            createNotification("error", response?.data?.message);
            setLoader(false);
          }
        }
      }
    };
    const handlePermission = (e) => {
      const { name, checked } = e.target;
  setSelectedPermission(prevState => ({
    ...prevState,
    [name]: checked
  }));
    }
    const handleCountryChange = (e) => {
      const selectedOption = e.target.value;
      setSelectedCountry(selectedOption);
    };
    return (
      <Modal
        show={modalShow}
        size="lg"
        className="staff-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <div className="modal__header">
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="modal-head">Add Staff</div>
            <p className="para-line">
              Fill the following fields to add a staff member
            </p>
          </Modal.Title>
          <Button className="clsbtn" onClick={() => handleHidestaffModal()}><MdClose/></Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="add-staff-field">
          <div className="form-feild">
            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationCustom01">
                <Form.Label>Name</Form.Label>
                <Form.Control
                name="name"
                required type="text"
                onChange={inputChange}
                placeholder="Add Name" />
                <span className="error"> {addError.name} </span>
                
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  required
                  name="email"
                  type="email"
                  placeholder="Add Email Address"
                  onChange={inputChange}
                />
                <span className="error"> {addError.email} </span>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom02">
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
                  required
                  type="text"
                  name="phoneNumber"
                  placeholder="Add Phone Number"
                  value={staffAddData.phoneNumber}
                  onChange={inputChange1}
                />
                </div>
                <span className="error"> {addError.phoneNumber} </span>
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <div className="page-moodule">
                  <h6>
                    Page Module Permission{" "}
                    <span className="ps-2">
                      <MessageIcon />
                    </span>
                  </h6>
                </div>
              </Col>
            </Row>
          <div className="addstaf-togglelist">
            <Row>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.toDo} />}
                    label="To do"
                    labelPlacement="start"
                    name="toDo"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.goals} />}
                    label="My Goals"
                    labelPlacement="start"
                    name="goals"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.number} />}
                    label="The Number"
                    labelPlacement="start"
                    name="number"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary"  checked={selectedPermission.bookings}/>}
                    label="Booking"
                    labelPlacement="start"
                    name="bookings"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary"  checked={selectedPermission.calender}/>}
                    label="Calenders"
                    labelPlacement="start"
                    name="calender"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary"  checked={selectedPermission.users}/>}
                    label="Users"
                    labelPlacement="start"
                    name="users"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"settings
                    control={<Switch color="primary" checked={true} />}
                    label="Setting"
                    labelPlacement="start"
                    name="settings"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.inventory} />}
                    label="Inventory"
                    labelPlacement="start"
                    name="inventory"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.myAccount} />}
                    label="My Account"
                    labelPlacement="start"
                    name="myAccount"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch color="primary" checked={selectedPermission.payment} />}
                    label="Payment"
                    labelPlacement="start"
                    name="payment"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch className="toggle-circle" checked={selectedPermission.rollManagement} />}
                    label="Role Management"
                    labelPlacement="start"
                    name="rollManagement"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch className="toggle-circle" checked={selectedPermission.link} />}
                    label="Generate a Link"
                    labelPlacement="start"
                    name="link"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
              <Col xs={12} md={3} lg={4}>
                <div className="switch-toggle">
                  <FormControlLabel
                    value="start"
                    control={<Switch className="toggle-circle" checked={selectedPermission.report} />}
                    label="Report"
                    labelPlacement="start"
                    name="report"
                    onChange={handlePermission}
                  />
                </div>
              </Col>
            </Row>
            </div>
          </div>
          <div className="add-btn">
          <Button  disabled={loader}  onClick={handleSubmit}>
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
              <> Add</>
            )} <KeyboardDoubleArrowRightIcon />
          </Button>
        </div>
          </div>
        </Modal.Body>
      
      </Modal>
    );
  }
  export default AddStafModal;
