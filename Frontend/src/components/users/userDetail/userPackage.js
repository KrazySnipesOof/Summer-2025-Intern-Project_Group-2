import React from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
const Userpackage = () => {
  return (
    <>
      <div className="user-membership-wrapper">
        <h1>Package</h1>
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    If the service provider offers grouped services for a
                    discount
                  </Form.Label>
                  <Form.Control type="text" name="serviceprovider" />
                </Form.Group>
              </Col>
              <Col xs={6} className="service-included">
                <Form.Group className="mb-3">
                  <Form.Label>When it was purchased </Form.Label>
                  <Form.Control type="text" name="serviceincluded" />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>How it was purchased</Form.Label>
                  <Form.Control type="text" name="serviceredeemed" />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>How many visits are allowed</Form.Label>
                  <Form.Control type="text" name="serviceremaining" />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>How many visits have been redeemed</Form.Label>
                  <Form.Control type="text" name="servicepurchase" />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>How many services remaining</Form.Label>
                  <Form.Control type="text" name="servicepurchase" />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Points offered for purchase </Form.Label>
                  <Form.Control type="text" name="servicepurchase" />
                </Form.Group>
              </Col>
            </Row>
            <div className="submitbtn">
              <Button className="nextbtn">
                Submit
                <BsChevronDoubleRight />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Userpackage;
