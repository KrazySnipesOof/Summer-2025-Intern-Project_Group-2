import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import EditSoap from "../editSoap"; // Import EditSoap component

const EditUserSoap = (props) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userData, setUserData] = useState(null); // State variable for user data
  const[EditId,setEditId]=useState('')
  const handleSuccess = () => {
    setUpdateSuccess(true);
  };

  useEffect(() => {
    const data =
      props.editDetails &&
      props.editDetails.row &&
      props.editDetails.row.original;
    if (data) {
      const obj = {
        name: data.name,
        email: data.email,
        phone: data.phoneNumber, // Corrected property name
        selectedCountry: data.selectedCountry,
        selectedBenificialCountry: data.selectedBenificialCountry,
        dob: data.dob,
        address: data.address
      };
console.log(data._id)
      setEditId(data && data._id);
      
      setUserData(obj); // Set user data
    }
  }, [props.editDetails, props.editModal]);

  const handleClose = () => {
    props.EditSoapClose();
    setUpdateSuccess(false);
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose(); // Close the modal when update is successful
    }
  }, [updateSuccess]);

  // Close the modal when the modal is closed by the user
  const handleModalClose = () => {
    handleClose();
  };

  return (
    <Modal   size="lg" show={props.showEdit} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User SOAP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditSoap
        getProductList={props.getProductList}
        handleModalClose={handleModalClose}
          EditId={EditId}
          userData={userData} // Pass user data to EditSoap component
          onSuccess={handleSuccess}
          id={props.Selectedid} // Pass the ID to EditSoap component
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditUserSoap;




