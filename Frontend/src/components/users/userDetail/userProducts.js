import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, Modal, InputGroup } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import AddProduct from "./modal/addProduct";
import Loader from "../../../helper/loader";
import { useSelector } from "react-redux";
import * as productServices from "../../../services/productServices";
import { RiDeleteBinLine } from "react-icons/ri";
import { createNotification } from "../../../helper/notification";
import { useParams } from "react-router-dom";
import moment from "moment";

import MaterialReactTable from "material-react-table";
const UserProducts = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const ProductClose = () => setShow(false);
  const ProductShow = () => setShow(true);
  const [rowSelection, setRowSelection] = useState({});
  const [deleteId, setDeleteId] = useState("");

  const reduxToken = useSelector((state) => state?.auth?.token);
  const [inventoryList, setInventoryList] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const AddProductClose = () => setShow(false);
  const [val, setVal] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);
  const [err, setErr] = useState({});

  useEffect(() => {
    getInverteryList();
    getProductList();
  }, [reduxToken]);

  const getInverteryList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await productServices.InventeryList(reduxToken);
      if (response?.status == 200) {
        setInventoryList(response?.data?.data);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getProductList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await productServices.ProductList(id, reduxToken);
      setLoader(true);

      if (response?.status == 200) {
        setProductList(response?.data?.data);
        setLoader(false);
      } else {
        setIsLoading(false);
        setLoader(false);
      }
    }
  };

  const Deleted = async (id) => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await productServices.DeleteList(deleteId, reduxToken);
      if (response?.status == 200) {
        createNotification("success", response?.data?.message);
        getInverteryList();
        getProductList();
        handleClose();
      } else {
        setIsLoading(false);
        createNotification("success", response?.data?.message);
      }
    }
  };
  const inputChange = async (e) => {
    e.preventDefault();
    const { value } = e.target;
    setVal(value);
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id?.row?.original?._id);
    setDeleteShow(true);
  };

  const handleClose = () => setDeleteShow(false);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row?.inventory?.name,
        id: "productname",
        header: "Product Name",
        size: 150,
      },
      {
        accessorFn: (row) => `$${row.price}` ,
        id: "productprice",
        header: "Product Price",
        size: 200,
      },
      {
        accessorFn: (row) => row.quantity,
        id: "qty",
        header: "QTY",
        size: 180,
      },
      {
        accessorFn: (row) => moment(row.createdAt).format("MMMM D, YYYY"),
        id: "Created At",
        header: "Created At",
        size: 180,
      },
      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
            <Button
              className="removebtn"
              type="submit"
              onClick={() => handleDeleteClick(cell)}
            >
              <RiDeleteBinLine />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const filterSearch = async (e) => {
    e.preventDefault();
    const validate = () => {
      let isValid = true;
      const formError = {};
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!val?.match(pattern)) {
        isValid = false;
        formError["name"] = "Special character not Allowed";
      }
      setErr(formError);
      return isValid;
    };
    if (validate()) {
      let start_date = moment(startDate).format("YYYY-MM-DD");
      const date = start_date == "Invalid date" ? "" : start_date;

      const response = await productServices.searchProductByName(
        date,
        val,
        id,
        reduxToken
      );
      if (response.status == 200) {
        setProductList(response?.data?.data);
        setLoader(false);
      } else {
        setLoader(false);
      }
    }
  };
  const clearFilter = (e) => {
    e.preventDefault();
    setStartDate("");
    setVal("");
    getProductList();
    setErr();
  };

  return (
    <>
      <div className="appointment-wrapper">
        <div className="form-wrapper">
          <Form>
            <Row>
              <Col xs={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="search"
                    placeholder="Search by name..."
                    value={val}
                    onChange={inputChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="msb-3">
                  <Form.Label>Select Dates</Form.Label>
                  <div className="selectdate-field">
                    <InputGroup>
                      <div className="input__group">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          name="date"
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Search by Date"
                        />
                      </div>
                    </InputGroup>
                  </div>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <div className="app-searchbtn">
                  <Button
                    type="submit"
                    onClick={filterSearch}
                    className="searchbtn"
                  >
                    <MdOutlineSearch />
                  </Button>
                  <Button
                    type="submit"
                    onClick={clearFilter}
                    className="clearbtn"
                  >
                    <AiOutlineClear />
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          <span className="error" style={{ color: "red" }}>
            {err && err.name}
          </span>
        </div>
        <div className="add-product">
          <Button className="addproduct-btn" onClick={ProductShow}>
            Add Product
          </Button>
        </div>

        <div className="appointment-table-wrap">
          <div className="rvn-table-wrap userproduct-list">
            {loader ? (
              <Loader />
            ) : (
              <MaterialReactTable
                columns={columns}
                pageSize={20}
                data={ProductList}
                manualPagination
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                enableColumnActions={false}
                enableSorting={false}
                enableTopToolbar={false}
                enableColumnOrdering={false}
              />
            )}
          </div>
        </div>
      </div>
      <AddProduct
        inventoryList={inventoryList}
        show={show}
        ProductClose={ProductClose}
        getProductList={getProductList}
        AddProductClose={AddProductClose}
      />
      <Modal show={deleteShow}>
        <Modal.Header>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to Delete this Product ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={Deleted}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UserProducts;
