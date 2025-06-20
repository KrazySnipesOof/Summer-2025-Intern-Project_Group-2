import React from "react";
import { Modal, Button } from "react-bootstrap";

const UserModal = ({
  handleClose,
  handleShow,
  show,
  handleChange,
  handleSubmit,
  handleUpdate,
  edit,
}) => {
  return (
    <>
      <Button className="adduser" onClick={handleShow}>
        Add User
      </Button>
      <Modal show={show} className="user-modal" onHide={handleClose}>
        <div className="login1">
          <Modal.Header>
            <Modal.Title>
              {edit ? <span>Update user</span> : <span>Add New User</span>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="popup-form-box">
              {" "}
              <div className="mb-3">
                <label className="form-label"> Name</label>
                <input
                  className="input1 form-control"
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="input1 form-control"
                  type="email"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="input1 form-control"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="close" onClick={handleClose}>
              Close
            </Button>
            <Button
              className="aduser"
              type="submit"
              onClick={edit ? handleUpdate : handleSubmit}
            >
              {edit ? <span>Update User</span> : <span>Add User</span>}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default UserModal;
