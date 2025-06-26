//import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
const CompanyExpenses = (props) => {
  const { companyExpenses, handleCompanyExpenses } = props;
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="bugdet-form">
          <h2 className="title">Company Expenses</h2>
          <div className="form-wrapper">
            <Form>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rent:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="rent"
                      value={companyExpenses.rent}
                      onChange={(e) => handleCompanyExpenses(e)}
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
                      name="companyGas"
                      value={companyExpenses.companyGas}
                      onChange={(e) => handleCompanyExpenses(e)}
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
                      name="companyWater"
                      value={companyExpenses.companyWater}
                      onChange={(e) => handleCompanyExpenses(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Electricity :</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="electricity"
                      value={companyExpenses.electricity}
                      onChange={(e) => handleCompanyExpenses(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cellular:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="cellular"
                      value={companyExpenses.cellular}
                      onChange={(e) => handleCompanyExpenses(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Internet:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="internet"
                      value={companyExpenses.internet}
                      onChange={(e) => handleCompanyExpenses(e)}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marketing:</Form.Label>
                    <Form.Control
                      type="text"
                      pattern="[0-9]*"
                      name="marketing"
                      value={companyExpenses.marketing}
                      onChange={(e) => handleCompanyExpenses(e)}
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

export default CompanyExpenses;
