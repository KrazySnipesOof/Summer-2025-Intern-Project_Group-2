import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as FamilyServices from "../../../../services/familyServices";
import { createNotification } from "../../../../helper/notification";
import { Rings } from "react-loader-spinner";

const AddFamilyMember = (props) => {
  const tokenResponse = useSelector((state) => state.auth.token);

  const { bookedUserList } = props;
  const { id } = useParams();
  const [err, setErr] = useState({});
  const [familyRelation, setFamilyRelation] = useState({
    users: "",
    relation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
    var regex = /^[A-Za-z\s]+$/
    if (!familyRelation.users) {
      isValid = false;
      formError["users"] = "Please select Client";
    }
    if (!familyRelation.relation) {
      isValid = false;
      formError["relation"] = "Please enter Relation";
    } else if (familyRelation.relation.trim() === "") {
      isValid = false;
      formError["relation"] = "Please enter Relation";
    }
    else if (!regex.test(familyRelation.relation.trim())) {
      isValid = false;
      formError["relation"] = "Please enter valid Relation";
    }
    setErr(formError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if(validate()){
    e.preventDefault();
    setIsLoading(true);
let result = familyRelation.relation?.toLowerCase();
    const str2 = result.charAt(0).toUpperCase() + result.slice(1);
    const obj = {
      users: familyRelation.users,
      relation: str2,
      addedByuser: id,
    };
    const response = await FamilyServices.create(obj, tokenResponse);
    props.AddFamilyClose();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    if (response.status == 200) {
      createNotification("success", response?.data?.message);
      setIsLoading(false);
      props.getUserfamily();
      props.getUser();
      setFamilyRelation("")
    } else {
      createNotification("error", response?.response?.data?.message);
    }
  }
  };
  const onHide = () =>{
    props.AddFamilyClose()
    setFamilyRelation("")
    setErr({});
   }  
  
  return (
    <Modal
      className="addproduct-wrapper add-family-modal"
      show={props.showUser}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <h2>Add Client Family</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Client</Form.Label>
                  <Form.Select
                    name="users"
                    className="basic-multi-select"
                    onChange={handleChange}
                    classNamePrefix="select"
                  >
                    <option value= "">Select</option>
                    {bookedUserList &&
                      bookedUserList.length > 0 &&
                      bookedUserList.map((res) => (
                        <option key={res.name} value={res._id}>
                          {res.name}
                        </option>
                      ))}
                  </Form.Select>
                    <span className="error" style={{ color: "red" }}>
                      {err && err.users}
                    </span>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Client Relation</Form.Label>
                  <Form.Control
                    type="text"
                    name="relation"
                    onChange={handleChange}
                    placeholder="Please add relation"
                  />{" "}
                  <span className="error" style={{ color: "red" }}>
                    {err && err.relation}
                  </span>
                </Form.Group>
              </Col>
            </Row>
            <div className="submitbtn">
              <Button disabled={isLoading ? true : false} type="button" onClick={handleSubmit} className="nextbtn">
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
              <> Submit</>
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
export default AddFamilyMember;
