  import Button from "react-bootstrap/Button";
  import Modal from "react-bootstrap/Modal";
  import React from "react";
  import { useState , useEffect} from "react";
  import Col from "react-bootstrap/Col";
  import Form from "react-bootstrap/Form";
  import Row from "react-bootstrap/Row";
  import MessageIcon from "../assets/icons/MessageIcon";
  import Switch from "@mui/material/Switch";
  import FormControlLabel from "@mui/material/FormControlLabel";
  import * as authServices from "../services/authServices";
  import { createNotification } from "../helper/notification";
  import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
  import { MdClose } from "react-icons/md";
  import { useSelector } from "react-redux";
  import * as staffService from "../services/staffServices";
  import { Rings } from "react-loader-spinner";
  const EditStafModal = ({Editerror, setEditError,getstaff ,selectedEditPermission ,setSelectedEditPermission ,  setEditStaffdata,editStaffData, handleEditHidestaff,editmodalShow}) => {
    const [validated, setValidated] = useState(false);
    const [countryData, setCountryData] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("");
    const [loader, setLoader] = useState(false);
    const reduxToken = useSelector((state) => state?.auth?.token);
    const loggedInUserId = useSelector((state) => state?.auth?.user?._id);
    const handleeditSubmit = async (e) => {
      e.preventDefault();
      const obj = {
        firstName: editStaffData.firstName ? editStaffData.firstName.trim() : editStaffData.firstName,
        email: editStaffData.email,
        selectedCountry: selectedCountry ? selectedCountry : editStaffData.selectedCountry,
        mobile: editStaffData.mobile,
        addedBy:loggedInUserId,
        permission:selectedEditPermission
      };
      const Validation = () => {
        let err = {};
        let isValid = true;
        const phoneNo = /^\d{10,15}$/;
        let regex = new RegExp(
          /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
        );
        if (!editStaffData.firstName) {
          err["name"] = "Name is required";
          isValid = false;
        } else if (editStaffData.firstName.trim() === "") {
          err["name"] = "Please enter name";
          isValid = false;
        }
        if (!editStaffData.email) {
          isValid = false;
          err["email"] = "Email is required";
        } else if (editStaffData.email.trim() === "") {
          isValid = false;
          err["email"] = "Email is required";
        } else if (!regex.test(editStaffData.email)) {
          isValid = false;
          err["email"] = "Please enter a valid email address";
        }
        if (!editStaffData.mobile && selectedCountry == "") {
          isValid = false;
          err["phoneNumber"] = "Phone number and country code is required";
        } else if (!editStaffData.mobile) {
          isValid = false;
          err["phoneNumber"] = "Phone number is required";
        } else if (obj.selectedCountry == "") {
          isValid = false;
          err["phoneNumber"] = "Country code is required";
        }
        else if (editStaffData.mobile.trim() === "") {
          err["phoneNumber"] = "Phone number is required";
          isValid = false;
        }
        else if (!phoneNo.test(editStaffData.mobile.replace(/-/g, ""))) {
          isValid = false;
          err["phoneNumber"] = "Phone number must be of 10-15 digits";
        }
        setEditError(err);
        return isValid;
      };  
      if (Validation()) {
        if (reduxToken) {
          setLoader(true);
          const response = await staffService.editstaff(loggedInUserId, editStaffData._id ,
            obj
          );
          setTimeout(() => {
            setLoader(false);
          }, 3000);
          if (response.success == true) {
            createNotification("success", response?.message);
            getstaff()
            setTimeout(() => {
            handleEditHidestaff()
            }, 3000);
          } else {
            createNotification("error", response?.message);
            setLoader(false);
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
    
    const handlePermission = (e) => {
      const { name, checked } = e.target;
      setSelectedEditPermission(prevState => ({
    ...prevState,
    [name]: checked
  })
  );
  }
  const inputChange = (e) => {
    const { name, value } = e.target;

    setEditStaffdata({ ...editStaffData, [name]: value });
  };

  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    const [countryCode, countryName] = selectedOption.split(',');
    setSelectedCountry(`${countryCode}${countryName}`);
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

        setEditStaffdata((prevData) => ({
          ...prevData,
          [name]: formattedPhoneNumber,
        }));
      } else {
        setEditStaffdata((prevData) => ({
          ...prevData,
          [name]: sanitizedValue,
        }));
      }
    } else {
      setEditStaffdata((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
    return (
      <Modal
        show={editmodalShow}
        size="lg"
        className="staff-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <div className="modal__header">
          <Modal.Title id="contained-modal-title-vcenter">
            <div className="modal-head">Edit Staff</div>
            <p className="para-line">
              Fill the following fields to Edit a staff member
            </p>
          </Modal.Title>
          <Button className="clsbtn" onClick={() => handleEditHidestaff()}><MdClose/></Button>
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
                value={editStaffData.firstName}
                required type="text"
                onChange={inputChange}
                placeholder="Add Name" />
              <span className="error"> {Editerror.name} </span>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  required
                  name="email"
                  value={editStaffData.email}
                  type="email"
                  disabled
                  placeholder="Add Email Address"
                />
              <span className="error"> {Editerror.email} </span>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom02">
                <Form.Label>Phone Number</Form.Label>
                <div className="selectinput-field">
                <Form.Select name="state" onChange={handleCountryChange} >
                          <option value="">{editStaffData?.selectedCountry ? editStaffData?.selectedCountry : editStaffData?.selectedBenificialCountry}</option>
                          {Object.entries(countryData).map(([code, name]) => (
                            <option key={code} value={`${code},${name}`}>
                              {`${code}${name}`}
                            </option>
                          ))}
                        </Form.Select>
                <Form.Control
                  required
                  name="phoneNumber"
                  value={editStaffData.mobile}
                  onChange={inputChange1}
                  type="text"
                  placeholder="Add Phone Number"
                />
                </div>
                <span className="error"> {Editerror.phoneNumber} </span>
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
                      control={<Switch color="primary" checked={ selectedEditPermission && selectedEditPermission?.toDo} />}
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
                      control={<Switch color="primary" checked={selectedEditPermission?.goals} />}
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
                      control={<Switch color="primary" checked={selectedEditPermission?.number} />}
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
                      control={<Switch color="primary"  checked={selectedEditPermission?.bookings}/>}
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
                      control={<Switch color="primary"  checked={selectedEditPermission?.calender}/>}
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
                      control={<Switch color="primary"  checked={selectedEditPermission?.users}/>}
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
                      value="start"
                      control={<Switch color="primary" checked={selectedEditPermission?.settings} />}
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
                      control={<Switch color="primary" checked={selectedEditPermission?.inventory} />}
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
                      control={<Switch color="primary" checked={selectedEditPermission?.myAccount} />}
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
                      control={<Switch color="primary" checked={selectedEditPermission?.payment} />}
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
                      control={<Switch className="toggle-circle" checked={selectedEditPermission?.rollManagement} />}
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
                    control={<Switch className="toggle-circle" checked={selectedEditPermission.link} />}
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
                    control={<Switch className="toggle-circle" checked={selectedEditPermission.report} />}
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
          <Button  disabled={loader}  onClick={handleeditSubmit}>
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
              <> Update</>
            
            )}<KeyboardDoubleArrowRightIcon />
          </Button>
        </div>
          </div>
        </Modal.Body>
      
      </Modal>
    );
  }
  export default EditStafModal;


