
import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, Modal, InputGroup } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import {  AiOutlineClear } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

import AddFiles from "./modal/addFiles";
import EditFiles from "./modal/editFiles";

import Loader from "../../../helper/loader";
import { useSelector } from "react-redux";
import * as FilesService from "../../../services/userFiles";

import { RiDeleteBinLine } from "react-icons/ri";
import { createNotification } from "../../../helper/notification";
import { useParams } from "react-router-dom";
import moment from "moment";

import MaterialReactTable from "material-react-table";
const UserFiles = () => {
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
  const EditModalClose = () => setEditModal(false);

  const [val, setVal] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);
  const [err, setErr] = useState({});
  const [filesData, setFilesData] = useState();
  const [editModal, setEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState("");
    useEffect(() => {
    getFileslist();
  }, [reduxToken]);

  const getFileslist = async () => {
    setLoader(true)
    const response = await FilesService.GettingFilesById(id);

    if (response?.status == 200) {
      setFilesData(response?.data?.data);
    setLoader(false)
    } else {
    setLoader(false)

    }
  };
  const Deleted = async (id) => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await FilesService.DeleteList(deleteId, reduxToken);
      if (response?.status == 200) {
        createNotification("success", response?.data?.message);
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
  const EditFileShow = (val) => {
    setEditModal(true);
    setEditDetails(val);
  };

  const handleClose = () => setDeleteShow(false);
  const FileList = ({ files }) => {
    console.log(files,":{P:{::::::::::::::::::::::::::")
    return (
      <div>
       
          <div className="link-field">
            <a
              href={`${process.env.REACT_APP_API_BASE_URL}/uploads/${files}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            {files}
            </a>
          </div>

      </div>
    );
  };
  const columns = useMemo(
    () => [
      {
        accessorFn: (_, index) => index + 1,
        id: "S.no",
        header: "S.no",
        
      },
      {
        accessorFn: (row) => row?.filesType,
        id: "Files Type",
        header: "Files Type",
        size: 150,
      },
      {
        accessorFn: (row) => `${row?.fileName}` ,
        id: "File Name",
        header: "File Name",
        size: 200,
      },
      {
        accessorFn: (row) => <FileList files={row?.file} /> ,
        id: 'Files',
        header: 'Files',
        size: 180,
      },
      {
        accessorFn: (row) => moment(row?.createdAt).format("MMMM D, YYYY"),
        id: "Created At",
        header: "Created At",
        size: 180,
      },
      {
        accessorFn: (row) => row?.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
           <Button onClick={() => EditFileShow(cell)}>
              <BiEdit />
            </Button>
            <Button onClick={() => handleDeleteClick(cell)}>
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

      const response = await FilesService.searchProductByName(
        date,
        val,
        id,
        reduxToken
      );
      if (response.status == 200) {
        setFilesData(response?.data?.data);
        setLoader(false);
      } else {
        setLoader(false);
      }
    }
  };
  const clearFilter = (e) => {
    e.preventDefault();
    getFileslist()
    setStartDate("");
    setVal("");
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
            Add Files
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
                data={filesData}
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
      <AddFiles
        inventoryList={inventoryList}
        show={show}
        ProductClose={ProductClose}
        getFileslist={getFileslist}
        AddProductClose={AddProductClose}
      />
       <EditFiles
        editDetails={editDetails}
        editModal={editModal}
        ProductClose={ProductClose}
        getFileslist={getFileslist}
        EditModalClose={EditModalClose}
      />
      <Modal show={deleteShow}>
        <Modal.Header>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to Delete this Files data ?</Modal.Body>
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
export default UserFiles;
