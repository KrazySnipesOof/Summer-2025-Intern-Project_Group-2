import React, { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { MdOutlineSearch, MdOutlineDelete } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import AddIou from "./Modal/AddIOU";
const dataiou = [
  {
    id: 0,
    text: "Billing/subscription updates",
  },
  {
    id: 1,
    text: "Billing/subscription edit ",
  },
  {
    id: 2,
    text: "Billing/subscription delete",
  },
];
const UserIou = () => {
  const [show, setShow] = useState(false);

  const IouClose = () => setShow(false);
  const IouShow = () => setShow(true);
  const [items, setItems] = useState(dataiou);
  const [inputValue, setInputValue] = useState("");
  const IouDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };
  const IouEdit = (id, newText) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };
  const IouInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const IouSubmit = (e) => {
    e.preventDefault();
    const newId = items.length + 1;
    const newItem = { id: newId, text: inputValue };
    setItems([...items, newItem]);
    setInputValue("");
  };

  const handleinvoiceData = () => {
    const invoicelist =
    items?.map((item) => {
          return (
            <>
              <li key={item.id}>
                <div className="listview">
                  <div className="title">{item.text}</div>
                  <div className="list-edit-dl">
                    <Button
                      className="editbtn"
                      onClick={() => IouEdit(item.id)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      className="dlbtn"
                      onClick={() => IouDelete(item.id)}
                    >
                      <MdOutlineDelete />
                    </Button>
                  </div>
                </div>
              </li>
            </>
          );
        });
    return invoicelist;
  };





  return (
    <>
      <div className="appointment-wrapper userio-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Created Service Providers</Form.Label>
                  <Form.Select name="workPerDay">
                    <option>Create by All Service Providers</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>All IOU Statuses</Form.Label>
                  <Form.Select name="workPerDay">
                    <option>Select</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={3}>
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
        <div className="add-Iou">
          <Button className="addproduct-btn" onClick={IouShow}>
            Add IOU
          </Button>
        </div>

        <div className="Iou-list-wrap">
          <ul>
            {handleinvoiceData()}
          </ul>
        </div>
      </div>
      <AddIou
        inputValue={inputValue}
        IouInputChange={IouInputChange}
        IouSubmit={IouSubmit}
        show={show}
        IouClose={IouClose}
      />
    </>
  );
};
export default UserIou;
