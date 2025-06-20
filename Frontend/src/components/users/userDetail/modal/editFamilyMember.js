import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as FamilyServices from "../../../../services/familyServices";
import { createNotification } from "../../../../helper/notification";
import { Rings } from "react-loader-spinner";

const EditFamilyMember = (props) => {
  const tokenResponse = useSelector((state) => state.auth.token);
  const { id } = useParams();
  const [err, setErr] = useState({});
  
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const [familyRelation, setFamilyRelation] = useState({
    relation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setFamilyRelation({ relation:props?.userData?.UserRelation })
  }, [props?.userData?.UserRelation])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFamilyRelation({
      ...familyRelation,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    const formError = {};
    var regex = /^[A-Za-z\s]+$/;
const input = familyRelation.relation.trim()
    if (!familyRelation.relation) {
      isValid = false;
      formError["relation"] = "Relation is required";
    } else if (familyRelation.relation.trim() === "") {
      isValid = false;
      formError["relation"] = "Please enter Relation";
    } else if (!regex.test(input)) {
      isValid = false;
      formError["relation"] = "Please enter valid Relation";
    }
    setErr(formError);
    return isValid;
  };


  const handleSubmit = async (e) => {
    if(validate()){
    setIsLoading(true);

    e.preventDefault();
    let result = familyRelation.relation.toLowerCase();
    const str2 = result.charAt(0).toUpperCase() + result.slice(1);
    const obj = {
      relation: str2,
      userId :props.userData.Userid,
      id:id
    };
    const userId = props.userData.Userid;
    const response = await FamilyServices.update(obj, tokenResponse);
    props.EditFamilyClose();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    if (response.status == 200) {
      createNotification("success", response?.data?.message);
      props.getUserfamily();
      setIsLoading(false);
      props.getUser();
    } else {
      createNotification("error",response?.response?.data?.message);
    }
  }
  };

  return (
    <Modal
      className="addproduct-wrapper add-family-modal"
      show={props.showFamilyedit}
      onHide={props.EditFamilyClose}
    >
      <Modal.Header closeButton>
        <h2>Edit Client Family</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={12}>
              <Form.Label>Client Name</Form.Label>

                <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    name="relation"
                    onChange={handleChange}
                    value={props.userData.Username}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">

                  <Form.Label>Client Relation</Form.Label>
                  <Form.Control
                    type="text"
                    name="relation"
                    onChange={handleChange}
                    value={
                        familyRelation.relation
                        
                    }
                    placeholder="Please add relation"
                  />
                </Form.Group>

                <span className="error" style={{ color: "red" }}>
                    {err && err.relation}
                  </span>
              </Col>
            </Row>
            <div className="submitbtn">
              <Button  disabled={isLoading ? true : false}  type="button" onClick={handleSubmit} className="nextbtn">
               
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
              <>  Update</>
            )}
                <BsChevronDoubleRight />
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default EditFamilyMember;
