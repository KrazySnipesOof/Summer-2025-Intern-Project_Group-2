import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import { BiEdit, BiPlus, BiShow } from "react-icons/bi";
import { useSelector } from "react-redux";
import Loader from "../../helper/loader";
import { createNotification } from "../../helper/notification";
import * as userBookingService from "../../services/bookingUserService";
import * as bookingService from "../../services/bookingServices";
import { RiDeleteBinLine } from "react-icons/ri";
import MaterialReactTable from "material-react-table";
import Adduser from "./addUser";
import Edituser from "./editUser";
const Userlist = () => {
  const [show, setShow] = useState(false);
  const [deleteAllShow, setDeleteAllShow] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [val, setVal] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [editDetails, setEditDetails] = useState("");

  const UserShow = () => setShow(true);
  const EditShow = (val) => {
    setEditModal(true);
    setEditDetails(val);
  };
  const handleViewClick = (val) => {
    navigate(`/clientdetail/${val?.row?.id}`);
  };
  const [bookingUser, setBookingUser] = useState();
  const navigate = useNavigate();

  const reduxToken = useSelector((state) => state?.auth?.token);
  const userId = useSelector((state) => state?.auth?.user?._id);
  const handleRoute = () => {
    navigate("/clientdetail");
  };
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row?.name,
        accessorKey: "client",
        header: "Client",
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        header: "Email",
      },
      {
        accessorFn: (row) => row?.phoneNumber,
        id: "phone",
        header: "Phone",
      },
      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
            <Button onClick={() => EditShow(cell)}>
              <BiEdit />
            </Button>
            <Button onClick={() => handleDeleteClick(cell)}>
              <RiDeleteBinLine />
            </Button>
            <Button
              className="viewshow-icon"
              onClick={() => handleViewClick(cell)}
            >
              <BiShow />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    getUser();
  }, [reduxToken]);

  const getUser = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await bookingService.getAllCustomers({ userId: userId });
      if (response?.status == 200) {
        setTimeout(() => {
          setBookingUser(response?.data?.data);
          setIsLoading(false);
        }, 3000);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setDeleteAllShow(false);
  };

  const handleDelete = async () => {
    let id = deleteId;
    if (id) {
      const response = await bookingService.removeCustomer(id);
      if (response.status == 200) {
        createNotification("success", response.data.message);
        handleClose();
        getUser();
        setVal("");
      }
    } else {
      removeBookingUser();
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteId(row?.row?.original?._id);
    setRowSelection({});
    setShowModal(true);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const inputChange = async (e) => {
    const { name, value } = e.target;
    setVal(value);
    const response = await bookingService.searchBookingUserByName(
      reduxToken,
      value
    );
    setBookingUser(response?.data?.data);
  };
  const deleteAll = () => {
    setDeleteAllShow(true);
  };

  const removeBookingUser = async () => {
    const val = Object.keys(rowSelection);
    const response = await userBookingService.removeMultiBookingUser(
      val,
      reduxToken
    );
    setRowSelection({});
    if (response.status == 200) {
      createNotification("success", response.data.message);
      getUser();
      setVal("");
      setDeleteAllShow(false);
    }
  };

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {}, [rowSelection]);

  const tableInstanceRef = useRef(null);
  return (
    <div>
      <div className="userlist_wrapper">
        <div className="adduser-btn">
          <Button onClick={UserShow}>
            <BiPlus />
            Add Client
          </Button>
        </div>
        <div className="userlist-layout">
          <div className="user-table">
            <div className="user-tableheading">
              <div className="entrie-field"></div>
              <div className="user-search">
                <Form className="d-md-flex" onSubmit={handleFormSubmit}>
                  <label>Search</label>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={inputChange}
                    value={val}
                  />
                </Form>
              </div>
            </div>

            {Object.keys(rowSelection).length >= 1 ? (
              <button className="inventory-remove" onClick={deleteAll}>
                delete
              </button>
            ) : (
              ""
            )}
            <div className="rvn-table-wrap">
              {isLoading ? (
                <Loader />
              ) : (
                <MaterialReactTable
                  columns={columns}
                  getRowId={(row) => row._id}
                  data={bookingUser ? bookingUser : ""}
                  enablePagination={true}
                  enableRowSelection
                  onRowSelectionChange={setRowSelection}
                  onRowClick={handleRoute}
                  state={{ rowSelection }}
                  enableColumnActions={false}
                  enableSorting={false}
                  enableTopToolbar={false}
                  enableColumnOrdering={false}
                  positionActionsColumn="last"
                />
              )}
              <Modal
                show={
                  showModal ? showModal : deleteAllShow ? deleteAllShow : ""
                }
              >
                <Modal.Header>
                  {deleteAllShow ? (
                    <Modal.Title>Delete Clients</Modal.Title>
                  ) : (
                    <Modal.Title>Delete Client</Modal.Title>
                  )}
                </Modal.Header>
                {deleteAllShow ? (
                  <Modal.Body>Do you want to Delete All Clients ?</Modal.Body>
                ) : showModal ? (
                  <Modal.Body>Do you want to Delete this Client ?</Modal.Body>
                ) : (
                  ""
                )}

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
      <Adduser
        show={show}
        setShow={setShow}
        getUser={getUser}
      />
      <Edituser
        editModal={editModal}
        setEditModal={setEditModal}
        getUser={getUser}
        editDetails={editDetails}
      />
    </div>
  );
};
export default Userlist;
