//import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const Household = (props) => {
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Household</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Groceries:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="groceries"
                      value={props.houseHold.groceries}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Personal care:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="personalCare"
                      value={props.houseHold.personalCare}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Clothing/Dry cleaning:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="ClothingDryCleaning"
                      value={props.houseHold.ClothingDryCleaning}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Domestic Help :</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="domesticHelp"
                      value={props.houseHold.domesticHelp}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Professional Dues:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="professionaldues"
                      value={props.houseHold.professionaldues}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dependent/Child care:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="dependentChildCare"
                      value={props.houseHold.dependentChildCare}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Education/School:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="educationSchool"
                      value={props.houseHold.educationSchool}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cash Allowances:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="cashAllowances"
                      value={props.houseHold.cashAllowances}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Others:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="others"
                      value={props.houseHold.others}
                      onChange={(e) => props.handleHouseHold(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Household;
