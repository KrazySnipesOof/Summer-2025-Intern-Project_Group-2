import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const Loanpayment = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Loan Payment</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Credit card Payment:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="creditCardPayment"
                      value={props.loanPayments.creditCardPayment}
                      onChange={(e) => props.handleLoanPayment(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Other Loan Payment:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="otherLoanPayment"
                      value={props.loanPayments.otherLoanPayment}
                      onChange={(e) => props.handleLoanPayment(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Saving/Investing:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="savingInvesting"
                      value={props.loanPayments.savingInvesting}
                      onChange={(e) => props.handleLoanPayment(e)}
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
                      value={props.loanPayments.others}
                      onChange={(e) => props.handleLoanPayment(e)}
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

export default Loanpayment;
