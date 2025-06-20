import React, { useState, useMemo, useEffect } from "react";
import moment from "moment";
import "./reportRevenue.scss";
import { BiMessageRoundedError } from "react-icons/bi";
import {
  Form,
  Modal,
  Button,
  InputGroup,
} from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import DatePicker from "react-datepicker";
import { BiCalendar } from "react-icons/bi";
import { HiOutlineChevronDown } from "react-icons/hi";
import MaterialReactTable from "material-react-table";
import * as bookingService from "../../services/bookingServices";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";


import { MenuItem } from "@mui/material";
import Loader from "../../helper/loader";
import { useSelector } from "react-redux";

import * as getCompanyGoalservice from "../../services/goalCompanyBudgetService";
import SearchIcon from '@mui/icons-material/Search';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const ReportRevenue = (props) => {

  const userId = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userService, setUserService] = useState([]);
  const [filterObj, setfilterObj] = useState({
    service: "",
    status: "",
  });

  const [addressGeo, setAddressGeo] = useState("");
  const [locationLat, setlocationLat] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [week, setWeek] = useState("");
  const [serviceSetting, setServiceSetting] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteAllShow, setDeleteAllShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteData, setDeleteData] = useState("");
 
  const [accurateGoals, setAccurateGoals] = useState("");
  
  const handleClose = () => {
    setShow(false);
    setDeleteAllShow(false);
  };
  const data = [
    {
      name: "John",
      email: "test123@gmail.com",
      service:"test",
      date:"3jul 2019",
      location:"india",
      staffname:"test",
      amount:"100"
    },
  
  ];
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Customer Name",
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: "Email",
      },
      {
       
         accessorFn: (row) => row.service,

        id: "service",
        header: "Service",
      },
     
      {
        accessorFn: (row) => (
          <>
            {moment(row?.startDateTime).format("D MMM, h:mm A")}
          </>
        ),
        id: "timedate",
        header: "Date ",
      },
      {
        accessorFn: (row) => row.location,
        id: "location",
        header: "Location",
      },
      {
        accessorFn: (row) => row.staffname,
        id: "staffname",
        header: "Staff Name",
        size: 100,
      },
      {
        accessorFn: (row) => row.amount,
        id: "amount",
        header: "Amount",
        size: 100,
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState({});

  const getBooking = async (reduxToken) => {
    if (reduxToken) {
      setLoader(true);
      const response = await bookingService.bookingList(reduxToken);
      if (response?.data?.code == 200) {
        setLoader(false);
        setFilterData(response?.data?.data[0]?.data);
      } else {
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    if (!addressGeo) {
      getBooking(reduxToken);
    }
  }, [addressGeo, reduxToken]);


  const getService = async (reduxToken) => {
    const response = await bookingService.getServices(reduxToken);
    if (response.status == 200) {
      setUserService(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response.status == 200) {
      const data1 = response?.data?.data[0]?.service
      const serviceIds1 = data1.map((item) => item.serviceId)
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    getService(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);


  const handleEditClick = (row) => {
    const id = row.original._id;
    navigate(`/editbooking/${id}`);
  };

  const handleBookingDetail = (row) => {
    const id = row.original._id;
    navigate(`/bookingdetail/${id}`);
  };

  const handleDeleteClick = (row) => {
    setDeleteId(row?.original._id);
    setDeleteData(row?.original);
    setShow(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setfilterObj({
      ...filterObj,
      [name]: value,
    });
  };

  const handleStartDateChange = (date) => {
    if (endDate && date?.getTime() > endDate?.getTime()) {
      setEndDate(null);
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (startDate && date?.getTime() < startDate?.getTime()) {
      setStartDate(null);
    }
    setEndDate(date);
  };

  

  useEffect(() => {
    if (
      filterObj.service ||
      filterObj.status ||
      startDate ||
      endDate ||
      locationLat ||
      day ||
      month ||
      week
    ) {
      applyFilters();
    } else if (filterObj.status == "" || filterObj.service == "") {
      getBooking(reduxToken);
    }
  }, [filterObj, startDate, endDate, locationLat, day, month, week]);

  const applyFilters = async () => {
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      inline
      dateFormat="MMMM d, yyyy h:mm aa"
      minDate={new Date()}
    />;
    const { service, status } = filterObj;
    let start_date = moment(startDate).format("YYYY-MM-DD");
    let end_date = moment(endDate).format("YYYY-MM-DD");
    const obj = {
      paymentType: status,
      service: service,
      startDate: start_date == "Invalid date" ? "" : start_date,
      endDate: end_date == "Invalid date" ? "" : end_date,
      lat: locationLat.lat,
      lng: locationLat.lng,
      day: day,
      month: month,
      week: week,
    };

    const response = await bookingService.filterBooking(obj);
    setLoader(true);
    if (response.status == 200) {
      setLoader(false);
      setFilterData(response?.data?.data);
    } else {
      setLoader(false);
    }
  };

  

  const handleDelete = async () => {
    let id = deleteId;
    let data = deleteData.startDateTime


    if (id) {
      const response = await bookingService.removeBooking(id, data);
      if (response.status == 200) {
        createNotification("success", response?.data?.message);
        handleClose();
        applyFilters();
      }
    } else {
      removeAllBooking();
    }
  };


  const deleteAll = () => {
    setDeleteAllShow(true);
  };



  const removeAllBooking = async () => {
    const val = Object.keys(rowSelection);
    setLoader(true);
    const response = await bookingService.removeMultiBooking(val, reduxToken);
    setRowSelection({});
    if (response.status == 200) {
      createNotification("success", response?.data?.message);
      getBooking(reduxToken);
      setLoader(false);
      setDeleteAllShow(false);
    }
  };

  let getGoalById = async () => {
    const response = await getCompanyGoalservice.GoalsById(userId, reduxToken);
    if (response.data.data) {
      response.data &&
        response?.data?.data?.map((val) => {
          setAccurateGoals(val.accurateGoals);
        });
    }
  };
  useEffect(() => {
    getGoalById();
  }, [reduxToken]);
 

  return (
    <>
      <div className="booking-layout-wrapper">
        <div className="main-heading">
          <h1>Reports Data</h1>
          <p>Data of booking and Payments</p>
        </div>
     
        <div className="revenue-list-section" >
          <div className="revenu-btns mb-4">
           <div className="report-btns">
           <Button className="d-block " variant="contained">Booking</Button>

           <Button variant="payment-btn">Payments</Button>
           </div>
             <Button className="addbtn1"> 
            <FileDownloadOutlinedIcon />
              Download Report
            </Button>
          </div>
          <div className="rvn-table-list">
            <div className="rvn-filter">
              <div className="filter-data">
              <h2>Filter:</h2>
              <div className="filter-list"> 
                
                <div className="filter-field align-items-center">
                  <InputGroup>
                    <div className="input__group">
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        maxDate={endDate}
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Start Date"
                      />
                    </div>
                    <InputGroup.Text id="basic-addon1" >
                      <BiCalendar />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
                <div className="filter-field">
                  <InputGroup>
                    <div className="input__group">
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="End Date"
                      />
                    </div>
                    <InputGroup.Text id="basic-addon2">
                      <BiCalendar />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
                
                <div className="filter-field">
                  <div className="selectoption">
                    <Form.Select
                      name="status"
                      onChange={handleChange}
                      aria-label="Default select example"
                    >
                      <option value="">Select Services</option>
                      <option value="Paid">Paid</option>
                      <option value="UnPaid">UnPaid</option>
                    </Form.Select>
                    <span className="slarrow">
                      <HiOutlineChevronDown />
                    </span>
                  </div>
                </div>
              </div>
              </div>
              <div className="search_input1">
              <InputGroup className="">
                <Form.Control
                className="border-end-0 shadow-none rounded-0 py-2"
                  placeholder="Search by customer, staff name or location"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                <InputGroup.Text id="basic-addon2" className="border-start-0 rounded-0 py-2" style={{backgroundColor: "#fff"}}><SearchIcon /></InputGroup.Text>
              </InputGroup>
              </div>  
            </div>

           <div className="rvn-table-wrap report-revenue-table">
              {Object.keys(rowSelection).length >= 1 ? (
                <>  
                  <div className="button-tooltip">
                    <button className="boooking-remove" onClick={deleteAll}>
                      delete

                    </button>
                    <span
                      className="toltip-icon"
                      data-background-color="#1c5141"
                      data-tip="Booking whose status is show will not be deleted"
                      data-place="right"
                      data-for="fool"
                    >
                      <BiMessageRoundedError />
                    </span>
                    <ReactTooltip id="fool" />
                  </div>
                </>
              ) : (
                ""
              )}
              {loader ? (
                <Loader />
              ) : (
                <MaterialReactTable
                  columns={columns}
                  pageSize={20}
                  data={data}
                  getRowId={(row) => row._id}
                  enablePagination={true}
                  enableRowSelection
                  onRowSelectionChange={setRowSelection}
                  state={{ rowSelection }}
                  enableColumnActions={false}
                  enableSorting={false}
                  enableTopToolbar={false}
                  enableColumnOrdering={false}
                  enableRowActions
                  positionActionsColumn="last"
                  renderRowActionMenuItems={({ row, closeMenu }) => [
                    <>
                      {row.original.bookingStatus == "Confirmed" ? (
                        <MenuItem
                          key={0}
                          className="assignbtn"
                          onClick={() => {
                            handleEditClick(row);
                          }}
                          sx={{ m: 0 }}
                        >
                          Edit Booking
                        </MenuItem>
                      ) : (
                        ""
                      )}

                      <MenuItem
                        key={0}
                        className="assignbtn"
                        onClick={() => {
                          handleBookingDetail(row);
                        }}
                        sx={{ m: 0 }}
                      >
                        Booking Detail
                      </MenuItem>
                      {row.original.show === false ? (
                        <MenuItem
                          key={0}
                          className="assignbtn"
                          sx={{ m: 0 }}
                          onClick={() => {
                            closeMenu();
                            handleDeleteClick(row);
                          }}
                        >
                          Delete Booking
                        </MenuItem>
                      ) : (
                        ""
                      )}
                    </>,
                  ]}
                  options={{
                    actionsColumnIndex: -1,
                  }}
                />
              )}
              <Modal show={show ? show : deleteAllShow ? deleteAllShow : ""}>
                <Modal.Header>
                  <Modal.Title>Delete Booking</Modal.Title>
                </Modal.Header>
                {deleteAllShow ? (
                  <Modal.Body>Do you want to Delete All Booking ?</Modal.Body>
                ) : show ? (
                  <Modal.Body>Do you want to Delete this Booking ?</Modal.Body>
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
    </>
  );
};
export default ReportRevenue;
