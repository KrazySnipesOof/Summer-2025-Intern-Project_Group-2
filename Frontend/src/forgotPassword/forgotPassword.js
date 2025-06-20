import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { createNotification } from "../helper/notification";
import * as authServices from "../services/authServices";

const ForgotPassword = (props) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);

  const handleShow = () => setShow(true);
  const handleCloseOnCloseButton = () => {
    setShow(false);
    setEmail("");
  };
  const validate = () => {
    let valid = true;
    let errors = {};
    if (!email) {
      valid = false;
      errors["email"] = "Email is required";
    }
    setError(errors);
    return valid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await authServices.forgotPassword({ email });
      if (response.data.code == 404) {
        createNotification("error", response.data.message);
      } else {
        createNotification("success", response.data.message);
        handleCloseOnCloseButton();
      }
    }
  };
  return (
    <>
      <Button className="forgetpassbtn" variant="info" onClick={handleShow}>
        Forgot Password
      </Button>
      <Modal
        className="forgetpopup"
        show={show}
        onHide={handleCloseOnCloseButton}
      >
        <Modal.Header>
          <Modal.Title>Forgot your Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="form-group">
            <label>
              Enter your valid email and we'll send you the link to reset your
              password
            </label>
            <input
              className="input1 form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="error"> {error && error.email}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOnCloseButton}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Send Email
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ForgotPassword;
