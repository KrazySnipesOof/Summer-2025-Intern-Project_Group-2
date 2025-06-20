import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const Housing = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Housing</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mortgage/Rent:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="mortgage"
                      value={props.housing.mortgage}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Property Tax:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="propertyTax"
                      value={props.housing.propertyTax}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Home Maintenance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="homeMaintenance"
                      value={props.housing.homeMaintenance}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Renters/Homeowners Insurance :</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="homeowerInsurance"
                      value={props.housing.homeowerInsurance}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
          <h2 className="title sub">Utilites</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Electric:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="electric"
                      value={props.housing.electric}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gas:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="gas"
                      value={props.housing.gas}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Water:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="water"
                      value={props.housing.water}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cable:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="cable"
                      value={props.housing.cable}
                      onChange={(e) => props.handleHosuing(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telephone:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="talephone"
                      value={props.housing.talephone}
                      onChange={(e) => props.handleHosuing(e)}
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
                      name="other"
                      value={props.housing.other}
                      onChange={(e) => props.handleHosuing(e)}
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

export default Housing;
