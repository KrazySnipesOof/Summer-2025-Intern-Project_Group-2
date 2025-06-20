import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import UserSoap from "../userSoap";

const AddSoap = (props) => {
  console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSuccess = () => {
    setUpdateSuccess(true);
  };
  const getSoaplist = () =>{
    props.getProductList()
  }

  const handleClose = () => {
    props.SoapClose();
    setUpdateSuccess(false); // Reset the update success state
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose(); // Close the modal when update is successful
    }
  }, [updateSuccess]);

  return (
    <Modal  size="lg" show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Soap</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserSoap getSoaplist={getSoaplist} handleClose={handleClose} onSuccess={handleSuccess} /> {/* Pass the onSuccess callback */}
      </Modal.Body>
    </Modal>
  );
};

export default AddSoap;
