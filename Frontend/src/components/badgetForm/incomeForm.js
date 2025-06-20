import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const IncomeForm = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Income</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Salary(Personal from beauty/wellness services you
                      provide):
                    </Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="personalSalary"
                      value={props.income.personalSalary}
                      onChange={(e) => props.handle(e)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bonus(Personal):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="personalBonus"
                      value={props.income.personalBonus}
                      onChange={(e) => props.handle(e)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Other Income(Personal):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="personalOtherIncome"
                      value={props.income.personalOtherIncome}
                      onChange={(e) => props.handle(e)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salary(Spouse/Partner):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="spouseSalary"
                      value={props.income.spouseSalary}
                      onChange={(e) => props.handle(e)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bonus(Spouse/Partner):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="SpouseBonus"
                      value={props.income.SpouseBonus}
                      onChange={(e) => props.handle(e)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Other Income(Spouse/Partner):</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="spouseOtherIncome"
                      value={props.income.spouseOtherIncome}
                      onChange={(e) => props.handle(e)}
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

export default IncomeForm;
