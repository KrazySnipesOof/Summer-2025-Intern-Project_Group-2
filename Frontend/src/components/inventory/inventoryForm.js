import React, { useState, useEffect, useRef } from "react";
import { Container, Col, Form, Row, Button, Breadcrumb } from "react-bootstrap";
import { MdHome, MdKeyboardArrowDown } from "react-icons/md";
import * as bookingService from "../../services/bookingServices";
import { useNavigate } from "react-router-dom";
import { BsChevronDoubleRight } from "react-icons/bs";
import { Rings } from "react-loader-spinner";
import { createNotification } from "../../helper/notification";
import { toast } from "react-toastify";
import * as inventoryService from "../../services/inventoryServices";
import Multiselect from "multiselect-react-dropdown";
import "./inventoryForm.scss";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const InventoryForm = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [serviceSetting, setServiceSetting] = useState([]);
  const [error, setError] = useState([]);
  const [price, setPrice] = useState('');

  const [inventoryData, setinventoryData] = useState({
    name: "",
    service: "",
    price: "",
    productstock: "",
    productimg: "",
  });
  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const handleFileChange = (e) => {
    const file1 = e.target.files[0];

    let allowedExtensions = /[\/.](jpg|jpeg|png)$/i;

    if (!allowedExtensions.exec(file1.type)) {
      toast.error("Invalid file type, Please upload only jpg, png file type!");
      return;
    } else {
      setFile(file1);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setinventoryData({ ...inventoryData, productimg: file1 });

      setPreview(objectUrl);
    }
  };
  const getServices = async (reduxToken) => {
    const response = await inventoryService.getServices(reduxToken);
    if (response.status == 200) {
      setData(response?.data?.data);
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    getServices(reduxToken);
  }, [reduxToken]);

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response?.status == 200) {
      const data1 = response?.data?.data[0]?.service
      const serviceIds1 = data1.map((item) => item?.serviceId)
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let arr = [];
    items.map((val) => {
      return arr.push(val._id);
    });

    const priceValue = price.replace(/[^0-9.]/g, '');

    const formData = new FormData();
    formData.append("productImg", inventoryData.productimg);
    formData.append("name", inventoryData.name);
    formData.append("service", JSON.stringify(inventoryData.service));
    formData.append("productstock", inventoryData.productstock);
    formData.append("price", priceValue);

    const Validation = () => {
      let err = {};
      let isValid = true;
      let num2 = /^\d+(\.\d+)?$/;
      let num3 = /^0*(?:\d+(?:,\d{3})*(?:\.\d{2})?|\.\d{2})$/;

      if (!inventoryData.name.trim()) {
        err["name"] = "Name is required";
        isValid = false;
      }
      if (!inventoryData.productstock.trim()) {
        isValid = false;
        err["productstock"] = "Product stock is required";
      } else if (inventoryData.productstock.trim() == 0) {
        err["productstock"] = "Product stock shoud be greater than 0";
        isValid = false;
      } else if (!inventoryData.productstock.match(num2)) {
        isValid = false;
        err["productstock"] = " Invalid Product stock value";
      }
      if (inventoryData?.service?.length <= 0) {
        isValid = false;
        err["service"] = "We cannot hit submit unless a service is selected";
      }

      const priceValue = price.replace(/[^0-9.]/g, '');

      if (!priceValue.trim()) {
        err["price"] = "Price is required";
        isValid = false;
      } else if (priceValue.trim() == 0) {
        err["price"] = "Price shoud be greater than 0";
        isValid = false;
      } else if (!priceValue.trim().match(num3)) {
        err["price"] = "Invalid price value";
        isValid = false;
      }
      setError(err);
      return isValid;
    };

    if (Validation()) {
      if (reduxToken) {
        setLoader(true);
        const response = await inventoryService.createInventory(
          formData,
          reduxToken
        );
        setTimeout(() => {
          setLoader(false);
        }, 3000);
        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          setTimeout(() => {
            navigate("/Inventory");
          }, 3000);
        } else {
          console.log("error");
          setLoader(false);
        }
      }
    }
  };

  const handleSelect = (selectedList, index) => {
    setItems(selectedList);
    const data = selectedList.map((val) => {
      return val._id;
    });
    setinventoryData({ ...inventoryData, service: data });
  };

  const handleRemove = (selectedList) => {
    setItems(selectedList);
    setinventoryData({ ...inventoryData, service: "" });
  };
  const inputChange = (e) => {
    const { name, value } = e.target;

    setinventoryData({ ...inventoryData, [name]: value });
  };
  
  const inputPriceChange = (e) => {
    let { value } = e.target;
    value = value.replace(/[^0-9.]/g, '');
    setPrice(`$${value}`);
  };
  
const handlesetservice  =  () =>{
  navigate("/setting")
  localStorage.setItem("settingbar", "2");
}


  return (
    <>
      <ToastContainer />
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <h2>
                  <b>Inventory</b>
                </h2>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Inventory</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="layout-content-wrapper booking-layout gg">
              <div>
                <div className="user-information-des">
                  <p>
                    {" "}
                    <b>Back Bar Inventory:</b> You must select the services
                    associated with the product listed.
                  </p>

                  <p>
                    <b>Retail Inventory:</b> You must enter your purchase price
                    (how much you paid for it) as well as the sales price (how
                    much the customers will pay for it)
                  </p>
                </div>
                <div className="main-heading">
                  <h1>Add Inventory</h1>
                  <p>Fill the following fields to add a Product</p>
                </div>
                <div className="bookingform-wrapper">
                  <div className="addbooking-form">
                    <div className="form-wrapper">
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group classNhandleDataame="mb-3">
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control
                                maxLength={20}
                                type="text"
                                placeholder="Add Name of Product"
                                onChange={inputChange}
                                name="name"
                              />
                              <span className="error"> {error.name} </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                onChange={inputPriceChange}
                                placeholder="Add Price"
                                name="price"
                                value={price}
                              />
                              <span className="error">{error?.price} </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Quantity In Stock</Form.Label>
                              <Form.Control
                                maxLength={4}
                                type="number"
                                onChange={inputChange}
                                placeholder="Add Stock Quantity"
                                name="productstock"
                              />
                              <span className="error">
                                {" "}
                                {error?.productstock}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3 selected-field">
                            <Form.Label></Form.Label>
                              <Form.Label className="d-flex items-center justify-content-between">
                                Service
                               <button onClick={handlesetservice} className="btn-link">Click here to add services</button> 
                              </Form.Label>
                              <Multiselect
                                options={
                                  serviceSetting?.length > 0
                                    ? serviceSetting
                                    : []
                                }
                                selectedValues={items}
                                onChange={inputChange}
                                onSelect={handleSelect}
                                onRemove={handleRemove}
                                displayValue="service"
                                className="input-control multiselect"
                                name="genres"
                              />
                              {error && error?.service ? (
                                <>
                                  <span className="error">
                                    {error?.service}
                                  </span>
                                </>
                              ) : (
                                <></>
                              )}
                              <span className="downarrow">
                                <MdKeyboardArrowDown />
                              </span>
                            </Form.Group>
                          </Col>

                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Product Image</Form.Label>

                              <div className="inventory-pdimg">
                                <Form.Control
                                  type="file"
                                  id="new"
                                  accept=".jpg, .png"
                                  ref={inputRef}
                                  onChange={handleFileChange}
                                  readOnly
                                />
                                {file && (
                                  <img
                                    src={preview}
                                    style={{ width: 200, height: 100 }}
                                  />
                                )}
                                <Button onClick={handleUpload}>
                                  Add Image
                                </Button>
                              </div>
                              <span className="error">{error?.productimg}</span>
                            </Form.Group>
                          </Col>
                          <div className="submitbtn">
                            <Button
                              type="submit"
                              disabled={loader}
                              className="nextbtn"
                            >
                              {loader ? (
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
                        </Row>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
export default InventoryForm;
