import React, { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as staffServices from "../../services/staffServices";
import { BiEdit, BiPlus } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import MaterialReactTable from "material-react-table";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./myStaff.scss";
import { Form } from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import AddStafModal from "../../modals/addStaff";
import EditStafModal from "../../modals/editStaff";

const MyStaff = () => {
  const [val, setVal] = useState("");
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [isLoading, setIsLoading] = useState(false);
  const [staffData, setStaffdata] = useState([]);
  const [editStaffData, setEditStaffdata] = useState([]);
  const [selectedEditPermission, setSelectedEditPermission] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [Editerror, setEditError] = useState([]);

  const [staffAddData, setstaffAddData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    userId: "",
  });
  const [addError, setAddError] = useState([]);

  const [selectedPermission, setSelectedPermission] = useState({
    toDo: false,
    goals: false,
    number: false,
    bookings: false,
    calender: false,
    users: false,
    settings: true,
    inventory: false,
    myAccount: false,
    payment: false,
    rollManagement: false,
    link:false,
    report:false
  });
  const reduxToken = useSelector((state) => state?.auth?.token);
  const userId = useSelector((state) => state?.auth?.user?._id);
  const getstaff = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await staffServices.getAllstaffsList(userId);
      if (response?.status == 200) {
        setStaffdata(response?.data.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } else {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    getstaff();
  }, [reduxToken]);
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row?.firstName,
        id: "name",
        header: "name",
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        header: "email",
      },
      {
        accessorFn: (row) => <>{`${row.mobile}`}</>,
        id: "phoneNumber",
        header: "phoneNumber",
      },
      {
        accessorFn: (row) => row.action,
        id: "action",
        header: "Action",
        Cell: ({ cell }) => (
          <div className="action-btn">
            <Button
              onClick={() => {
                handleEditshowstaff(cell);
              }}
            >
              <BiEdit />
            </Button>
            <Button onClick={() => handleDeleteshowstaff(cell)}>
              <RiDeleteBinLine />
            </Button>
          </div>
        ),
      },
    ],
    []
  );
  const handleDelete = async () => {
    let id = deleteId;
    if (id) {
      const response = await staffServices.removestaff(userId, id);
      if (response.success == true) {
        createNotification("success", response.message);
        setShowModal(false);
        getstaff();
      }
    }
  };
  const handleDeleteshowstaff = (row) => {
    setDeleteId(row?.row?.id);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const inputChange = async (e) => {
    const { name, value } = e.target;
    setVal(value);
    const response = await staffServices.searchstaff(userId, value);
    setStaffdata(response?.data);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  const [modalShow, setModalShow] = useState(false);
  const [editmodalShow, setEditModalShow] = useState(false);
  const handleshowstaffModal = () => {
    setModalShow(true);
  };
  const handleHidestaffModal = () => {
    setModalShow(false);
    setstaffAddData({
      name: "",
      email: "",
      phoneNumber: "",
      userId: "",
    });
    setAddError([]);
    setSelectedPermission({
      toDo: false,
      goals: false,
      number: false,
      bookings: false,
      calender: false,
      users: false,
      settings: true,
      inventory: false,
      myAccount: false,
      payment: false,
      rollManagement: false,
      link:false,
      report : false
    });
  };
  const handleEditshowstaff = async (cell) => {
    setEditModalShow(true);

    const response = await staffServices.getOnestaffs(userId, cell.row.id);
    if (response?.status == 200) {
      setEditStaffdata(response?.data?.data);
      setSelectedEditPermission(response?.data?.data?.permission);
    }
  };

  const handleEditHidestaff = () => {
    setEditModalShow(false);
    setEditError([]);
  };
  return (
    <>
      <div className="billing_wrapper">
        <div className="billing_heading">
          <h4>Staff Member List</h4>
          <Button
            className="invoice_btn border-0"
            variant="primary"
            onClick={() => handleshowstaffModal()}
          >
            <AddRoundedIcon /> Staff
          </Button>
        </div>
        <div className="billing_table_heading staff-list-wrap d-flex">
          <div className="user-search">
            <Form
              className="d-flex align-items-center gap-4"
              onSubmit={handleFormSubmit}
            >
              <label>Search</label>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 rounded-0"
                aria-label="Search"
                onChange={inputChange}
                value={val}
              />
            </Form>
          </div>
        </div>
        <div className="billing_table">
          <div className="billing_table">
            <MaterialReactTable
              columns={columns}
              pageSize={20}
              data={staffData}
              getRowId={(row) => row._id}
              enablePagination={true}
              enableColumnActions={false}
              enableSorting={false}
              enableTopToolbar={false}
              enableColumnOrdering={false}
              positionActionsColumn="last"
            />
            <Modal show={showModal}>
              <Modal.Header>
                <Modal.Title>Delete Staff</Modal.Title>
              </Modal.Header>
              <Modal.Body>Do you want to Delete Staff ?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="table_pagination"></div>
          </div>
          <div className="table_pagination">{/* <Pagination /> */}</div>
        </div>
      </div>
      <AddStafModal
        addError={addError}
        setAddError={setAddError}
        setstaffAddData={setstaffAddData}
        staffAddData={staffAddData}
        selectedPermission={selectedPermission}
        setSelectedPermission={setSelectedPermission}
        getstaff={getstaff}
        modalShow={modalShow}
        handleHidestaffModal={handleHidestaffModal}
      />
      <EditStafModal
        Editerror={Editerror}
        setEditError={setEditError}
        getstaff={getstaff}
        selectedEditPermission={selectedEditPermission}
        setSelectedEditPermission={setSelectedEditPermission}
        setEditStaffdata={setEditStaffdata}
        editStaffData={editStaffData}
        editmodalShow={editmodalShow}
        handleEditHidestaff={handleEditHidestaff}
      />
    </>
  );
};
export default MyStaff;
