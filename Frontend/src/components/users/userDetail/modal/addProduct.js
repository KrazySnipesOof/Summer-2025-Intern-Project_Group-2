import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createNotification } from "../../../../helper/notification";
import * as productServices from "../../../../services/productServices";
import { Rings } from "react-loader-spinner";

const AddProduct = (props) => {
  const [err, setErr] = useState({});
  const tokenResponse = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  const [productData, setProductData] = useState({
    quantity: "",
    price: "",
    inventoryId: "",
    userId: "",
  });
  const list = [];
  const secondList = [];
  props?.inventoryList?.map((result) => {
    list?.push(result.data);
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData({
      ...productData,
      [name]: value,
    });
  };
  const validate = () => {
    let isValid = true;
    const formError = {};
   let  num1= /^[1-9]\d*$/
    let num2 =  /^0*(?:\d+(?:,\d{3})*(?:\.\d{2})?|\.\d{2})$/;

    if (!productData.inventoryId ) {
      isValid = false;
      formError["inventoryId"] = "Please select Product";
    } else if (productData.inventoryId === "Select") {
      isValid = false;
      formError["inventoryId"] = "Please select Product";
    }

    if (!productData.quantity.trim()) {
      formError["quantity"] = "Quantity is required";
      isValid = false;
    } else if (productData.quantity.trim() == 0) {
      formError["quantity"] = "Quantity shoud be greater than 0";
      isValid = false;
    } 
    else if (!+productData.quantity.trim().match(num1)) {
      formError["quantity"] = "Quantity should not be valid";
      isValid = false;
    }
    if (!productData.price.trim()) {
      formError["price"] = "Price is required";
      isValid = false;
    } else if (productData.price.trim() == 0) {
      formError["price"] = "Price shoud be greater than 0";
      isValid = false;
    } 
    else if (!productData.price.trim().match(num2)) {
      formError["price"] = "Invalid price";
      isValid = false;
    }
    setErr(formError);
    return isValid;
  };
  const handleSubmit = async (e) => {
    if (validate()) {
      setIsLoading(true);
      e.preventDefault();
      const obj = {
        quantity: productData.quantity,
        price: productData.price,
        inventoryId: productData.inventoryId,
        userId: id,
      };
      const response = await productServices.createProduct(obj, tokenResponse);
      if (response.status == 200) {
        createNotification("success", response?.data?.message);
        props.getProductList();
        props.AddProductClose();
        setIsLoading(false);
        setProductData({
          quantity: "",
          price: "",
          inventoryId: "",
          userId: "",
        });
      } else {
        createNotification("error", response?.response?.data?.message);
        props.getProductList();
        setIsLoading(false);
      }
    }
  };
  const onHide = () => {
    props.ProductClose();
    setProductData({
      quantity: "",
      price: "",
      inventoryId: "",
      userId: "",
    });
    setErr([]);
  };
  return (
    <Modal className="addproduct-wrapper" show={props.show} onHide={onHide}>
      <Modal.Header closeButton>
        <h2>Add Product</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Product</Form.Label>

                  <Form.Select
                    name="inventoryId"
                    className="basic-multi-select"
                    onChange={handleChange}
                    classNamePrefix="select"
                  >
                    <option>Select</option>

                    {list[0]?.map((res) => (
                      <option key={res._id} value={res._id}>
                        {res.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <span className="error" style={{ color: "red" }}>
                  {err && err.inventoryId}
                </span>
              </Col>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  min="1"
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  placeholder="Please add Quantity"
                />{" "}
                <span className="error" style={{ color: "red" }}>
                  {err && err.quantity}
                </span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  onChange={handleChange}
                  placeholder="Please add Price"
                />{" "}
                <span className="error" style={{ color: "red" }}>
                  {err && err.price}
                </span>
              </Form.Group>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="submitbtn">
          <Button
            type="submit"
            disabled={isLoading ? true : false}
            onClick={handleSubmit}
            className="nextbtn"
          >
            {isLoading ? (
              <>
                <div className="submit-loader">
                  <Rings
                    height="40"
                    width="40"
                    radius="10"
                    color="#ffffff"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              </>
            ) : (
              <> Submit</>
            )}
            <BsChevronDoubleRight />
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default AddProduct;
