//import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const PersonalInsurance = (props) => {
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Personal Insurance</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Health Insurance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="healthInsurance"
                      value={props.personalInsurance.healthInsurance}
                      onChange={(e) => props.handlePersonalInsurence(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Life Insurance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="lifeInsurance"
                      value={props.personalInsurance.lifeInsurance}
                      onChange={(e) => props.handlePersonalInsurence(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Disability Income Insurance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="disabilityIncomeInsurance"
                      value={props.personalInsurance.disabilityIncomeInsurance}
                      onChange={(e) => props.handlePersonalInsurence(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Long term Health care Insurance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="healthCareInsurance"
                      value={props.personalInsurance.healthCareInsurance}
                      onChange={(e) => props.handlePersonalInsurence(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Medical/Dental/Vision/Drug:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="medicalDentalVisionDrug"
                      value={props.personalInsurance.medicalDentalVisionDrug}
                      onChange={(e) => props.handlePersonalInsurence(e)}
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
                      value={props.personalInsurance.others}
                      onChange={(e) => props.handlePersonalInsurence(e)}
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

export default PersonalInsurance;
