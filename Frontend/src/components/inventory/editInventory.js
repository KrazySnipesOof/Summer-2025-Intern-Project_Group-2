import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Col,
  Form,
  Row,
  Button,
  Breadcrumb,
} from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsChevronDoubleRight } from "react-icons/bs";
import * as inventoryService from "../../services/inventoryServices";
import Multiselect from "multiselect-react-dropdown";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../../helper/notification";
import { useSelector } from "react-redux";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const EditInventory = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  const [data, setData] = useState([]);
  const [serviceInvet, setServiceInvent] = useState([]);
  const [getData, setGetData] = useState({
    name: "",
    price: "",
    productstock: "",
    productimg: "",
  });
  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const [items, setItems] = useState([]);

  const [error, setError] = useState([]);
  const { id } = useParams();

  const getServices = async (reduxToken) => {
    const response = await inventoryService.getServices(reduxToken);
    if (response.status == 200) {
      setData(response.data.data);
    } else {
      console.log("error");
    }
  };


  useEffect(() => {
    getServices(reduxToken);
  }, [reduxToken]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getInventoryById = async (reduxToken, id) => {
    const response = await inventoryService.inventoryById(reduxToken, id);
    if (response.status == 200) {
      setGetData(response.data.data);
    } else {
      console.log("error");
    }
  };


  useEffect(() => {
    getInventoryById(reduxToken, id);
  }, [reduxToken]);

  const handleSelect = (selectedList, index) => {
  
    setServiceInvent(selectedList);
  };

  const handleRemove = (selectedList) => {
    setItems(selectedList);
    setServiceInvent(selectedList);
  };
  const handleFileChange = (e) => {
    const file1 = e.target.files[0];
    let allowedExtensions = /[\/.](jpg|jpeg|png)$/i;

    if (!allowedExtensions.exec(file1.type)) {
      toast.error("Invalid file type, Please upload only jpg, png file type!");
      return;
    } else {
      setFile(file1);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setGetData({ ...getData, productimg: file1 });
      setPreview(objectUrl);
    }
  };

  const Validation = () => {
    let err = {};
    let isValid = true;
    let num2 = /^\d+(\.\d+)?$/;

    if (!getData.name.trim()) {
      err["name"] = "Name is required";
      isValid = false;
    }
    if (!getData.productstock.toString().trim()) {
      err["productstock"] = "Product stock is required";
      isValid = false;
    }

    else if (!getData.productstock.toString().match(num2)) {
      err["productstock"] = "Product stock shoud be greater than 0";
      isValid = false;
    }
    if (serviceInvet.length <= 0) {
      err["service"] = "Service is required";
      isValid = false;
    }
    if (!getData.price) {
      err["price"] = "Price is required";
      isValid = false;
    } else if (getData.price.toString().trim() == 0) {
      err["price"] = "Price shoud be greater than 0";
      isValid = false;
    } else if (!getData.price.toString().trim().match(num2)) {
      err["price"] = "Invalid price value";
      isValid = false;
    }
    setError(err);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Validation()) {
      let arr = [];
      serviceInvet.map((val) => {
        return arr.push(val._id);
      });
      const formData = new FormData();
      formData.append("productImg", getData.productimg);
      formData.append("name", getData.name);
      formData.append("service", JSON.stringify(arr));
      formData.append("productstock", getData.productstock);
      formData.append("price", getData.price);
      setIsLoading(true);



      if (file) {
        const response = await inventoryService.editInventory(id, formData);

        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          setTimeout(() => {
            navigate("/inventory");
          }, 3000);
        } else {
         
          setIsLoading(false);
        }
      } else {
        const obj = {
          name: getData.name,
          productstock: getData.productstock,
          service: arr,
          productimg: getData.productimg,
          price: getData.price,
        };
        const response = await inventoryService.editInventory(id, obj);
        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          setTimeout(() => {
            navigate("/inventory");
          }, 3000);
        } else {
          console.log(":::error");
        }
      }
    }
  };

  useEffect(() => {
    getInventory();
  }, [reduxToken]);

  const getInventory = async () => {
    const response = await inventoryService.inventoryById(reduxToken, id);
    if (response?.status == 200) {
      setGetData(response?.data?.data);
      setServiceInvent(response.data.data.service);
    } else {
      console.log(":::error");
    }
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setGetData({ ...getData, [name]: value });
  };
  return (
    <>
      <ToastContainer />
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="layout-content-wrapper booking-layout gg">
              <div>
                <div className="main-heading">
                  <h1>Edit Inventory</h1>
                  <p>Fill the following fields to edit a inventory</p>
                </div>
                <div className="bookingform-wrapper">
                  <div className="addbooking-form">
                    <div className="form-wrapper addbooking">
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group classNhandleDataame="mb-3">
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control
                                maxLength={20}
                                type="text"
                                placeholder="Add Name of Product"
                                onChange={onInputChange}
                                name="name"
                                value={getData.name}
                              />
                              <span className="error"> {error?.name} </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                type="number"
                                onChange={onInputChange}
                                placeholder="Add Price"
                                name="price"
                                value={getData.price}
                              />
                              <span className="error">{error?.price} </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Quantity In Stock</Form.Label>
                              <Form.Control
                                type="number"
                                onChange={onInputChange}
                                placeholder="Add Stock Quantity"
                                name="productstock"
                                value={getData.productstock}
                              />
                              <span className="error">
                                {" "}
                                {error?.productstock}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3 selected-field">
                              <Form.Label>Service</Form.Label>
                              <Multiselect
                                options={data}
                                selectedValues={serviceInvet}
                                onSelect={handleSelect}
                                onRemove={handleRemove}
                                displayValue="service"
                                className="input-control multiselect"
                                name="service "
                                value={serviceInvet}
                              />

                              <span className="error">{error?.service}</span>
                              <span className="downarrow">
                              </span>
                            </Form.Group>
                          </Col>
                      
                          <Col xs={12} md={6} className="mb-3 mb-lg-0">
                            <Form.Group className="mb-3">
                              <Form.Label>Product Image</Form.Label>

                              <div className="inventory-pdimg">
                                {getData?.productimg
                                  ? !file && (
                                      <img
                                        src={`${imgUrl}/${getData.productimg}`}
                                        style={{ width: 200, height: 100 }}
                                      />
                                    )
                                  : ""}

                                <Form.Control
                                  type="file"
                                  id="new"
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
                                    {
                                      getData?.productimg == null ? "ADD IMAGE" :"EDIT IMAGE"
                                    } 
                                </Button>
                              </div>
                              <span className="error">{error?.productimg}</span>
                            </Form.Group>
                          </Col>
                          <div className="submitbtn">
                            <Button
                              type="submit"
                              disabled={isLoading}
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
export default EditInventory;
