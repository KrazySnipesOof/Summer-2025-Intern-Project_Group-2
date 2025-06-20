import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Col, Form, Row, Button, Modal, InputGroup } from "react-bootstrap";
import { MdOutlineSearch } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

import soapService from '../../../../services/soapService'
import { DeleteSoap , SoapList , searchSoapByName } from "../../../../services/soapService";
import AddSoap from "./addsoap";
import { useSelector } from "react-redux";


import moment from "moment";
import EditSoap from "./editsoap";
import MaterialReactTable from "material-react-table";
const SoapForm = (props) => {
  const id = props.id
  const [startDate, setStartDate] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const SoapClose = () => setShow(false);
  const SoapShow = () => setShow(true);
  const [rowSelection, setRowSelection] = useState({});
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const reduxToken = useSelector((state) => state?.auth?.token);
  const [inventoryList, setInventoryList] = useState([]);
  const [ProductList, setProductList] = useState([]);
  const AddSoapClose = () => setShow(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState({});
  const [EditDetails, setEditDetails] = useState(null);
  const [Selectedid, setSelectedid] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [DeleteId, setDeleteId] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);

const EditSoapClose = () => setShowEdit(false);

  useEffect(() => {
    getProductList();
  }, [reduxToken]);
  const handleDeleteClick = async (id) => {
    setDeleteId(id._id);
    setDeleteShow(true);
  };

  const Deleted = async () => {
    setIsLoading(true);
    try {
      if (!DeleteId) {
        console.error("ID is undefined or null.");
        return;
      }
      if (!reduxToken) {
        console.error("JWT token is missing.");
        return;
      }

      const response = await DeleteSoap(DeleteId, reduxToken);
      if (response?.status === 200) {
        console.log("Item deleted successfully.");
        getProductList();
      } else {
        console.error("Error deleting item:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);

      handleClose();
    }
  };

  const getProductList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await SoapList(reduxToken)
      setLoader(true);
      if (response?.status == 200) {
        console.log(response)
        setProductList(response.data.msg);
        setLoader(false);
      } else {
        setIsLoading(false);
        setLoader(false);
      }
    }
  };

  const handleEdit = (soap) => {
    console.log(soap,":::::::::::::::::::{{{{{{{{{{{{{{{{{")
    setEditDetails(soap);
    setSelectedid(soap?.row?.original?._id)
    setShowEdit(true);
  };


 
  const handleClose = () => setDeleteShow(false);
  const FileList = ({ files }) => {
    console.log(files,":::::::::::filesfilesfiles::::::::::::::::")
    return (
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <a
              href={`${process.env.REACT_APP_API_BASE_URL}/uploads/${file.filename}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {index + 1}. {file.originalname}
            </a>
          </div>
        ))}
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
        accessorFn: (row) => row?.subjective,
        id: "Subjective",
        header: "Subjective",
        size: 200,
      },
      {
        accessorFn: (row) => row?.plan,
        id: "Plan",
        header: "Plan",
        size: 180,
      },
      {
        accessorFn: (row) => row?.level,
        id: "Severity/Pain Level",
        header: "Severity/Pain Level",
        size: 150,
      },
      {
        accessorFn: (row) => row.additionalNotes,
        id: "Additional Notes",
        header: "Additional Notes",
        size: 180,
      },
      {
        accessorFn: (row) => row?.files?.length > 0 ? <FileList files={row.files} /> : "Not added",
        id: 'Files',
        header: 'Files',
        size: 180,
      },
      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
           <Button onClick={() => handleEdit(cell)}>
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


  const inputChange = (e) => {
    setVal(e.target.value);

  };

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
      let startDateFormatted = "";
      if (startDate) {
        startDateFormatted = moment(startDate).format("YYYY-MM-DD");
      }
      try {
        const response = await searchSoapByName(val , reduxToken)
        if (response.status === 200) {
            setProductList(response.data.msg); 
        }
      } catch (error) {
        console.error("Error searching soaps:", error);
        setLoader(false);
      }
    }
  };

  const clearFilter = (e) => {
    e.preventDefault();
    setStartDate("");
    setVal("");
    getProductList();
    setErr({});
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
                {/* <Form.Group className="msb-3">
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
                </Form.Group> */}
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
          <Button className="addproduct-btn" onClick={SoapShow}>
            Add Soap
          </Button>
        </div>

        <div className="appointment-table-wrap">
          <div className="rvn-table-wrap userproduct-list">
            {/* {loader ? (
              <Loader />
            ) : ( */}
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

            {/* </>
 )} */}
            {showEdit && <EditSoap getProductList={getProductList}  EditSoapClose={EditSoapClose} Selectedid={Selectedid} editDetails={EditDetails} showEdit={showEdit} setShowEdit={setShowEdit} />}

            {/* )} */}
          </div>
        </div>
      </div>
      <AddSoap
        inventoryList={inventoryList}
        show={show}
        SoapClose={SoapClose}
        getProductList={getProductList}
        AddProductClose={AddSoapClose}
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
          <Button variant="danger"
            onClick={Deleted}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SoapForm;
