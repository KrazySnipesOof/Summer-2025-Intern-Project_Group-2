import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
const AddIou = (props) => {
  return (
    <Modal
      className="addproduct-wrapper"
      show={props.show}
      onHide={props.IouClose}
    >
      <Modal.Header closeButton>
        <h2>Add IOU</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form onSubmit={props.IouSubmit}>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="Iou"
                    placeholder="Please add Iou"
                    value={props.inputValue}
                    onChange={props.IouInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="submitbtn">
              <Button type="submit" className="nextbtn">
                Submit
                <BsChevronDoubleRight />
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
export default AddIou;
