import React, { useState, useMemo, useEffect, useRef } from "react";
import { Form, Button, Container, Modal, Row, Col } from "react-bootstrap";
import { BiEdit, BiPlus } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import Loader from "../../helper/loader";
import * as inventoryService from "../../services/inventoryServices";
import MaterialReactTable from "material-react-table";
import InventoryBreadcurm from "./productInventorybreadcurm";
import { useSelector } from "react-redux";
import "./productInventory.scss";
import noIMage from "../../assets/img/userdetail/no-image.png";
import { FaRegFileImage } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Select from "react-select";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import * as bookingService from "../../services/bookingServices";
import { FaPlus } from "react-icons/fa6";
import { Rings } from "react-loader-spinner";

const imgUrl = process.env.REACT_APP_IMAGE_URL;
const ProductInventory = () => {
  const [deleteAllShow, setDeleteAllShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const [val, setVal] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [inventoryData, setinventoryData] = useState([]);
  const [inventoryFormData, setInventoryFormData] = useState({
    name: "",
    service: [],
    price: "",
    productstock: "",
    estUsage: [],
  });
  const [inventoryEditId, setInventoryEditId] = useState("");
  const [imagesFiles, setImagesFiles] = useState([]);
  const [serviceSetting, setServiceSetting] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (files.length + imagesFiles.length > 3) {
      toast.warning("Maximum number of product images is 3");
      return;
    } else {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImagesFiles((images) => [...images, ...newImages]);
    }
  };

  const handleRemoveFile = (preview) => {
    setImagesFiles((prevImages) =>
      prevImages.filter((img) => img.preview !== preview)
    );
  };

  useEffect(() => {
    return () => {
      imagesFiles.forEach(URL.revokeObjectURL);
    };
  }, [imagesFiles]);

  const maxImagesToShow = imagesFiles.slice(0, 3);

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response?.status == 200) {
      const data1 = response?.data?.data[0]?.service;
      const services = data1.map((item) => ({
        value: item?.serviceId?._id,
        label: item?.serviceId?.service,
      }));
      setServiceSetting(services);
    } else {
      console.log("error");
    }
  };

  const reduxToken = useSelector((state) => state?.auth?.token);

  useEffect(() => {
    getInventory();
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  const handleEditClick = (row) => {
    const data = row?.row?.original;
    setInventoryEditId(data?._id);
    setInventoryFormData({
      name: data?.name,
      price: `$${data?.price}`,
      productstock: data?.productstock,
      service: data?.service?.map((service) => {
        return {
          value: service?._id,
          label: service?.service,
        };
      }),
      estUsage: data?.estUsage,
    });
    setImagesFiles(
      data?.productimgs?.map((img) => ({
        file: null,
        preview: img,
      })) || []
    );
    setShowEditModal(true);
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setInventoryFormData({ ...inventoryFormData, [name]: value });
  };
  const inputPriceChange = (e) => {
    const { name, value } = e.target;
    let price = value.replace(/[^0-9.]/g, "");
    setInventoryFormData({ ...inventoryFormData, [name]: `$${price}` });
  };

  const inputEstUsage = (e, serviceId) => {
    const { value } = e.target;

    setInventoryFormData((prevData) => {
      const existingEstUsage = prevData.estUsage || [];

      const updatedEstUsage = existingEstUsage.some(
        (item) => item.serviceId === serviceId
      )
        ? existingEstUsage.map((item) =>
            item.serviceId === serviceId ? { ...item, value } : item
          )
        : [...existingEstUsage, { serviceId, value }];

      return {
        ...prevData,
        estUsage: updatedEstUsage,
      };
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setDeleteAllShow(false);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const inputSearchChange = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    setVal(value);
    const response = await inventoryService.searchInventoryByName(
      1,
      10,
      value,
      reduxToken
    );
    setinventoryData(response?.data?.data);
  };

  const handleDelete = async () => {
    let id = inventoryEditId;

    if (id) {
      const response = await inventoryService.removeInventory(id);
      if (response.status == 200) {
        toast.success(`Success: ${response.data.message}`);
        handleClose();

        getInventory();
        setVal("");
      }
    } else {
      removeInventory();
    }
  };

  const getInventory = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await inventoryService.inventoryList(reduxToken);
      if (response?.status == 200) {
        setinventoryData(response?.data?.data[0]?.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleSelect = (selected) => {
    setInventoryFormData((prevData) => {
      const currentServices = prevData?.service || [];
      if (
        currentServices.some((service) => service?.value == selected?.value)
      ) {
        return {
          ...prevData,
        };
      } else {
        return {
          ...prevData,
          service: [...currentServices, selected],
        };
      }
    });
  };

  const handleSelectRemove = (selected) => {
    setInventoryFormData((prevData) => {
      const currentServices = prevData?.service || [];
      return {
        ...prevData,
        service: currentServices.filter((service) => service != selected),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceValue = inventoryFormData?.price?.replace(/[^0-9.]/g, "");
    const services = inventoryFormData?.service?.map((service) => {
      return service?.value;
    });
    const Validation = () => {
      let err = {};
      let isValid = true;
      let num2 = /^\d+(\.\d+)?$/;

      if (!inventoryFormData?.name.trim()) {
        err["name"] = "Name is required";
        isValid = false;
      }
      if (!inventoryFormData?.productstock.toString().trim()) {
        err["productstock"] = "Product stock is required";
        isValid = false;
      } else if (!inventoryFormData?.productstock.toString().match(num2)) {
        err["productstock"] = "Product stock shoud be greater than 0";
        isValid = false;
      }
      if (services?.length <= 0) {
        err["service"] = "Service is required";
        isValid = false;
      }
      if (!priceValue) {
        err["price"] = "Price is required";
        isValid = false;
      } else if (priceValue.toString().trim() == 0) {
        err["price"] = "Price shoud be greater than 0";
        isValid = false;
      } else if (!priceValue.toString().trim().match(num2)) {
        err["price"] = "Invalid price value";
        isValid = false;
      }
      if (imagesFiles?.length <= 0) {
        err["productimg"] = "Minimum of 1 image is required";
        isValid = false;
      }
      setError(err);
      return isValid;
    };

    if (Validation() && reduxToken) {
      setIsSubmitting(true);
      const files = imagesFiles.filter((imageFile) => imageFile?.file !== null);
      const existingImgs = imagesFiles
        .filter((imageFile) => imageFile.file === null)
        .map((imageFile) => imageFile.preview);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("productImgs", file.file);
      });
      formData.append("name", inventoryFormData?.name);
      formData.append("service", JSON.stringify(services));
      formData.append("productstock", inventoryFormData?.productstock);
      formData.append("price", priceValue);
      formData.append("description", "Testing");
      formData.append("estUsage", JSON.stringify(inventoryFormData?.estUsage));
      if (showEditModal) {
        formData.append("existingImgs", JSON.stringify(existingImgs));
      }

      const obj = {
        name: inventoryFormData?.name,
        productstock: inventoryFormData?.productstock,
        service: services,
        productimgs: imagesFiles?.map((image) => image?.preview),
        price: priceValue,
        estUsage: inventoryFormData?.estUsage,
        description: "Testing",
      };

      try {
        if (showAddModal) {
          const response = await inventoryService.createInventory(
            formData,
            reduxToken
          );
          if (response.status == 200) {
            toast.success(`Success: ${response?.data?.message}`)
          } else {
            console.log("error");
            toast.error("Error: Something went wrong")
          }
        }
        if (showEditModal) {
          const response = await inventoryService.editInventory(
            inventoryEditId,
            files.length > 0 ? formData : obj
          );
          if (response.status == 200) {
            toast.success(`Success: ${response?.data?.message}`)
          } else {
            console.log("error");
            toast.error("Error: Something went wrong")
          }
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsSubmitting(false);
        getInventory();
        handleClose();
      }
    }
  };

  const deleteAll = () => {
    setDeleteAllShow(true);
  };

  const removeInventory = async () => {
    const val = Object.keys(rowSelection);
    const response = await inventoryService.removeMultiInventory(
      val,
      reduxToken
    );
    setRowSelection({});
    if (response.status == 200) {
      toast.success(`Success: ${response.data.message}`);
      getInventory();
      setVal("");
      setDeleteAllShow(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.productimg,
        id: "productImg",
        header: "Image",
        Cell: ({ row }) => (
          <div className="Product-img">
            {row?.original.productimgs ? (
              <img
                src={`${imgUrl}/${row?.original.productimgs[0]}`}
                alt="product-img"
              />
            ) : (
              <img src={`${noIMage}`} alt="product-img" />
            )}
          </div>
        ),

        size: 100,
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: "Name",
        size: 180,
      },
      {
        accessorFn: (row) => `$${row.price}`,
        id: "price",
        header: "Price",
        size: 150,
      },
      {
        accessorFn: (row) => row.productstock,
        id: "productstock",
        header: "Product in stock",
      },

      {
        accessorFn: (row, index) => {
          let serviceLength = row?.service?.length;
          let servicess = row?.service?.map((val) => {
            return val?.service;
          });
          let servicesString =
            serviceLength > 2
              ? `${servicess.slice(0, 2).join(", ")}...`
              : serviceLength > 1
              ? servicess.join(", ")
              : servicess[0];
          if (serviceLength > 1) {
            servicesString = servicesString.replace(/,(\s+)?$/, "");
          }
          return servicesString;
        },
        id: "service",
        header: "Service",
      },

      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
            <Button
              onClick={() => {
                handleEditClick(cell);
              }}
            >
              <BiEdit />
            </Button>
            <Button onClick={() => handleDeleteClick(cell)}>
              <RiDeleteBinLine />
            </Button>
          </div>
        ),
      },
    ],
    [inventoryData]
  );

  const handleDeleteClick = (row) => {
    setInventoryEditId(row?.row?.original?._id);
    setRowSelection({});
    setShowModal(true);
  };

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {}, [rowSelection]);
  const handleAddClick = () => {
    setInventoryFormData({
      name: "",
      service: [],
      price: "",
      productstock: "",
      estUsage: [],
    });
    setImagesFiles([]);
    setError([])
    setShowAddModal(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <ToastContainer />
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <InventoryBreadcurm />
            <div className="layout-content-wrapper booking-layout">
              <div className="main-heading">
                <h1>Products Inventory</h1>
                <p>Below are your list of items</p>
              </div>
              <div className="userlist_wrapper">
                <div className="userlist-layout">
                  <div className="product-inventory-item">
                    <div className="prin-item-field">
                      <div className="item-stored">
                        <p># Items Stored</p>
                        <h1>{inventoryData && inventoryData.length}</h1>
                      </div>
                      <div className="prin-btn">
                        <Button onClick={handleAddClick}>
                          <BiPlus />
                          Add New Inventory
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="user-table">
                    <div className="user-tableheading">
                      <div className="entrie-field"></div>
                      <div className="user-search">
                        <Form
                          className="d-block d-md-flex"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <label>Search</label>
                          <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            onChange={inputSearchChange}
                            aria-label="Search"
                            value={val}
                          />
                        </Form>
                      </div>
                    </div>

                    <div className="rvn-table-wrap product-inventory-list">
                      {Object.keys(rowSelection).length >= 1 ? (
                        <button className="boooking-remove" onClick={deleteAll}>
                          delete
                        </button>
                      ) : (
                        ""
                      )}

                      {isLoading ? (
                        <Loader />
                      ) : (
                        <MaterialReactTable
                          columns={columns}
                          pageSize={20}
                          getRowId={(row) => row._id}
                          data={inventoryData}
                          enablePagination={true}
                          enableRowSelection
                          onRowSelectionChange={setRowSelection}
                          state={{ rowSelection }}
                          enableColumnActions={false}
                          enableSorting={false}
                          enableTopToolbar={false}
                          enableColumnOrdering={false}
                          positionActionsColumn="last"
                          muiTableBodyRowProps={{
                            sx: {
                              height: "50px",
                            },
                          }}
                          muiTableBodyCellProps={{
                            sx: {
                              padding: "4px",
                            },
                          }}
                          muiBottomToolbarProps={{
                            sx: {
                              marginTop: "14px",
                            },
                          }}
                          muiTablePaperProps={{
                            sx: {
                              backgroundColor: "#F6F6F6",
                            },
                          }}
                        />
                      )}
                      <Modal
                        centered
                        show={showAddModal || showEditModal}
                        onHide={handleClose}
                        dialogClassName="inventory-modal"
                        backdrop="static"
                      >
                        <Modal.Body>
                          <p>{showAddModal ? "Add Item" : "Edit Item"}</p>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                              <Form.Control
                                type="text"
                                placeholder="Product Name"
                                maxLength={20}
                                onChange={inputChange}
                                name="name"
                                value={inventoryFormData?.name}
                              />
                              <span className="error"> {error?.name} </span>
                            </Form.Group>
                            <Row className="gap-2 flex-nowrap mx-1">
                              <Col className="p-0">
                                <Form.Group className="mb-3">
                                  <small>Price</small>
                                  <Form.Control
                                    type="text"
                                    placeholder="$"
                                    name="price"
                                    onChange={inputPriceChange}
                                    value={inventoryFormData?.price}
                                  />
                                  <span className="error">{error?.price} </span>
                                </Form.Group>
                              </Col>
                              <Col className="p-0">
                                <Form.Group className="mb-3">
                                  <small>In Stock</small>
                                  <Form.Control
                                    type="number"
                                    placeholder="#"
                                    name="productstock"
                                    onChange={inputChange}
                                    value={inventoryFormData?.productstock}
                                  />
                                  <span className="error">
                                    {error?.productstock}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Form.Group className="mb-2">
                              <div className="images-container">
                                <Form.Control
                                  type="file"
                                  id="new"
                                  accept=".jpg, .png, .jpeg"
                                  ref={inputRef}
                                  multiple
                                  onChange={handleFileChange}
                                  readOnly
                                />
                                {maxImagesToShow.map((image, index) => (
                                  <div className="image" key={index}>
                                    <img
                                      src={
                                        image?.file == null
                                          ? `${imgUrl}/${image?.preview}`
                                          : image?.preview
                                      }
                                      alt="image-product"
                                    />
                                    <IoMdCloseCircleOutline
                                      onClick={() =>
                                        handleRemoveFile(image?.preview)
                                      }
                                      className="remove-btn"
                                    />
                                  </div>
                                ))}
                                {maxImagesToShow.length <= 2 && (
                                  <div
                                    className="empty-img"
                                    onClick={handleUpload}
                                  >
                                    {maxImagesToShow.length == 0 ? (
                                      <>
                                        <FaRegFileImage color="#94C8C3" />
                                        <small>Browse and select image</small>
                                      </>
                                    ) : (
                                      <FaPlus className="plus-btn" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="error">{error?.productimg}</span>
                            </Form.Group>
                            <div className="service-header">
                              <p>Services Product used in:</p>
                              <p>Est. Uses</p>
                            </div>
                            <div className="service-container">
                              <div>
                                {inventoryFormData.service?.length <= 0 ? (
                                  <div className="service">
                                    <div className="service-item">
                                      <p>Select Service Below</p>
                                    </div>
                                    <Form.Control
                                      type="number"
                                      className="est-use"
                                      readOnly
                                    />
                                  </div>
                                ) : (
                                  inventoryFormData.service?.map((service) => (
                                    <div className="service">
                                      <div className="service-item">
                                        <p>{service?.label}</p>
                                        <IoMdCloseCircleOutline
                                          size={20}
                                          className="close-btn"
                                          color="#14513F"
                                          onClick={() =>
                                            handleSelectRemove(service)
                                          }
                                        />
                                      </div>
                                      <Form.Control
                                        type="number"
                                        className="est-use"
                                        onChange={(e) =>
                                          inputEstUsage(e, service?.value)
                                        }
                                        value={
                                          inventoryFormData?.estUsage?.find(
                                            (item) =>
                                              item?.serviceId === service?.value
                                          )?.value || ""
                                        }
                                      />
                                    </div>
                                  ))
                                )}
                                <span className="error">{error?.service}</span>
                                <Select
                                  options={serviceSetting}
                                  onChange={(e) => handleSelect(e)}
                                  value={"Add Service"}
                                  placeholder="Add Service"
                                  className="select-service-button"
                                />
                              </div>
                            </div>
                            <div className="buttons">
                              <Button
                                disabled={isSubmitting}
                                variant="secondary"
                                onClick={handleClose}
                              >
                                Cancel
                              </Button>
                              {showEditModal && (
                                <Button
                                  disabled={isSubmitting}
                                  variant="danger"
                                  onClick={() => {
                                    handleClose();
                                    setShowModal(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                              <Button
                                disabled={isSubmitting}
                                className="save-btn"
                                type="submit"
                              >
                                {isSubmitting ? (
                                  <Rings
                                    height="30"
                                    width="80"
                                    radius="10"
                                    color="#fff"
                                    wrapperStyle
                                    wrapperClass
                                  />
                                ) : (
                                  <>{showEditModal ? "Update" : "Save Item"}</>
                                )}
                              </Button>
                            </div>
                          </Form>
                        </Modal.Body>
                      </Modal>
                      <Modal show={showModal || deleteAllShow} centered>
                        <Modal.Header>
                          <Modal.Title>Delete Inventory</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {deleteAllShow
                            ? "Do you want to Delete All Selected Inventory?"
                            : "Do you want to Delete this Inventory?"}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="danger" onClick={handleDelete}>
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
export default ProductInventory;
