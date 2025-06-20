import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

const Transportation = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Transportation</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Auto Payment(s):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="autoPayment"
                      value={props.transportation.autoPayment}
                      onChange={(e) => props.handletransPort(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Auto Insurance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="autoInsurance"
                      value={props.transportation.autoInsurance}
                      onChange={(e) => props.handletransPort(e)}
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
                      name="transportationGas"
                      value={props.transportation.transportationGas}
                      onChange={(e) => props.handletransPort(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Maintenance:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="maintenance"
                      value={props.transportation.maintenance}
                      onChange={(e) => props.handletransPort(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3 license-field">
                    <Form.Label>
                      License/Registration:{" "}
                      <span
                        className="toltip-icon"
                        data-background-color="#1c5141"
                        data-tip="Whatever value will be added here, gonna /12 first and then add "
                        data-place="right"
                      >
                        <MdOutlineReportGmailerrorred />
                      </span>
                      <ReactTooltip />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="LicenseRegistration"
                      value={props.transportation.LicenseRegistration}
                      onChange={(e) => props.handletransPort(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Parking/Toll/Bus/Train:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="ParkingTollBusTrain"
                      value={props.transportation.ParkingTollBusTrain}
                      onChange={(e) => props.handletransPort(e)}
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
                      name="Others"
                      value={props.transportation.Others}
                      onChange={(e) => props.handletransPort(e)}
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

export default Transportation;
