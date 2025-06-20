import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
const UserClasses = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Dates</Form.Label>
                  <div className="selectdate-field">
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Start Date"
                        />
                      </div>
                    </InputGroup>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Statuses</Form.Label>
                  <Form.Select name="workPerDay">
                    <option>Select Statuses</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Classes</Form.Label>
                  <Form.Select name="workPerDay">
                    <option>Select Classes</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All Teachers</Form.Label>
                  <Form.Select name="workPerDay">
                    <option>Select Teachers</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <div className="app-searchbtn">
                  <Button className="searchbtn">
                    <MdOutlineSearch />
                  </Button>
                  <Button className="clearbtn">
                    <AiOutlineClear />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="appointment-table-wrap"></div>
      </div>
    </>
  );
};
export default UserClasses;
