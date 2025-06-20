import React, { useState, useEffect } from "react";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { createNotification } from "../../helper/notification";
import * as userServices from "../../services/userServices";
import * as businessService from "../../services/businessServices";
import { Modal } from "react-bootstrap";
const PaymentSetting = () => {
  const userID = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [stripeData, setStripeData] = useState({
    secretKey: "",
    publicKey: "",
  });
  const [showbutton,setShowButon]=useState(false)
  let id = userID;
  const inputChange = (e) => {
    const { name, value } = e.target;

    setStripeData({ ...stripeData, [name]: value });
  };


  const getUserById = async () => {
    if (id !== undefined && id !== null) {
      const response = await userServices.GetUserByID(id);
      setStripeData({
        secretKey: response.data.secretKey,
        publicKey: response.data.publicKey,
      });
    }
  };

  useEffect(() => {
    getUserById();
  }, [userID]);

  const toggleSecretKeyVisibility = () => {
    setShowSecretKey(!showSecretKey);
  };

  const togglePublicKeyVisibility = () => {
    setShowPublicKey(!showPublicKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const obj = {
      secretKey: stripeData.secretKey
        ? stripeData.secretKey.trim()
        : stripeData.secretKey,
      publicKey: stripeData.publicKey,
    };
    const validation = () => {
      let err = {};
      let isValid = true;

      if (!obj.secretKey) {
        err["secretKey"] = "Secret key is required";
        isValid = false;
      } else if (obj.secretKey.trim() === "") {
        err["secretKey"] = "Secret key is required";
        isValid = false;
      }

      if (!obj.publicKey) {
        err["publicKey"] = "Public key is required";
        isValid = false;
      } else if (obj.publicKey.trim() === "") {
        err["publicKey"] = "Public key is required";
        isValid = false;
      }

      setError(err);
      return isValid;
    };
    if(validation()){
      setShowButon(true)
    }
  };
  const handleSubmitForm =async()=>{
    const obj = {
      secretKey: stripeData.secretKey
        ? stripeData.secretKey.trim()
        : stripeData.secretKey,
      publicKey: stripeData.publicKey,
    };
    const response = await businessService.updateStripeDetail(
          obj,
          reduxToken
        );
        if (response.status == 200) {
          setIsLoading(false);
          createNotification("success", response?.data?.message);
          handleclodelinkmodel()
          localStorage.setItem("WARNING_SECRET_KEY",true)
          getUserById()

        }
    
  }
  const handleclodelinkmodel =()=>{
  setShowButon(false)
  }

  return (
    <>
      <div className="appointment-wrapper setting-layout">
        <div className="userinvoice-list-wrap">
          <div className="user-information-desc">
            <p>Connect to your stripe account.</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Secret Key</Form.Label>
                  <InputGroup className="d-flex align-items-center gap-2">
                    <Form.Control
                      type={showSecretKey ? "text" : "password"}
                      placeholder="Enter Secret Key"
                      name="secretKey"
                      value={stripeData.secretKey}
                      onChange={inputChange}
                    />
                   
                    <Button
                      variant="link"
                      onClick={toggleSecretKeyVisibility}
                      className="eye-icon"
                    >
                      {showSecretKey ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </InputGroup>
                  <span className="error"> {error?.secretKey} </span>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Public Key</Form.Label>
                  <InputGroup className="d-flex align-items-center gap-2">
                    <Form.Control
                      type={showPublicKey ? "text" : "password"}
                      placeholder="Enter Public Key"
                      name="publicKey"
                      value={stripeData.publicKey}
                      onChange={inputChange}
                    />
                   
                    <Button
                      variant="link"
                      onClick={togglePublicKeyVisibility}
                      className="eye-icon"
                    >
                      {showPublicKey ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </InputGroup>
                  <span className="error"> {error?.publicKey} </span>
                </Form.Group>
              </Col>
              <div className="submitbtn">
                <Button className="nextbtn" type="submit">
                  <> Connect</>
                </Button>
              </div>
            </Row>
          </Form>
        </div>
        <Modal 
      aria-labelledby="contained-modal-title-vcenter"
      centered show={showbutton} onHide={handleclodelinkmodel}>
                  <Modal.Header closeButton onClick={()=>setShowButon(false)}>
                    <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="p-0">
                    <div className="text-center">
                      
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" style={{width:"100px", height:"100px", fill:"red", }}><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                     <p className="pt-3">If secret & public are not correct as per your stripe account then online payment will not be activated.</p>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button variant="secondary" onClick={handleclodelinkmodel}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitForm}>
                      Proceed
                    </Button>
                    
                  </Modal.Footer>
                </Modal> 
      </div>
    </>
  );
};
export default PaymentSetting;
