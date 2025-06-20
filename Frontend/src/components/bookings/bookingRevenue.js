import React, { useState, useMemo, useEffect } from "react";
import moment from "moment";
import { BiMessageRoundedError } from "react-icons/bi";
import { Form, Modal, Button, ButtonGroup, InputGroup } from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import DatePicker from "react-datepicker";
import { BiCalendar, BiPlus } from "react-icons/bi";
import { HiOutlineChevronDown } from "react-icons/hi";
import MaterialReactTable from "material-react-table";
import * as bookingService from "../../services/bookingServices";
import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { MenuItem } from "@mui/material";
import Loader from "../../helper/loader";
import { useSelector } from "react-redux";
import * as getCompanyGoalservice from "../../services/goalCompanyBudgetService";
import GoalsRowDisplay from "../goals/goalsRowDisplay";

const BookingRevenue = (props) => {
  const userId = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const FilterType = ["Day", "Week", "Month"];
  const [isActive, setIsActive] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  const [filterGoal, setFilterGoal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteData, setDeleteData] = useState("");
  const [accurateGoals, setAccurateGoals] = useState("");
  const [companyBudget, setCompanyBudget] = useState({});
  const handleClose = () => {
    setShow(false);
    setDeleteAllShow(false);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: "Email",
      },
      {
        accessorFn: (row, index) => {
          if (row?.serviceType !== "Class") {
            let serviceLength = row?.service?.length;
            let servicess = row?.service?.map((val) => {
              return val?.service;
            });
            let servicesString = servicess.join(
              serviceLength > 1 ? " , " : " "
            );
            if (serviceLength > 1) {
              servicesString = servicesString.replace(/,(\s+)?$/, "");
            }
            return servicesString;
          } else {
            const className = `${row?.classes[0]?.name ?? ""} Class`;
            return className;
          }
        },

        id: "service",
        header: "Service",
      },
      {
        accessorFn: (row) => row.bookingStatus,
        id: "bookingStatus",
        header: "Booking Status",
      },
      {
        accessorFn: (row) => (
          <>
            {moment(
              row?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).format("D MMM, h:mm A")}
          </>
        ),
        id: "timedate",
        header: "Time & Date",
      },

      {
        accessorFn: (row) => (
          <span className={row.paymentType}>{row.paymentType}</span>
        ),
        id: "status",
        header: "Status",
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
      if (response?.data?.code === 200) {
        setLoader(false);
        const sortedData = response?.data?.data[0]?.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setFilterData(sortedData);
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
  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response.status == 200) {
      const data1 = response?.data?.data[0]?.service;
      const serviceIds1 = data1.map((item) => item?.serviceId);
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleClick = () => {
    navigate("/addbooking");
  };
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

  const setFilterWeeks = (e, filterType) => {
    setIsActive(filterType);
    setFilterGoal(!filterGoal);
    if (filterType == "Week") {
      setDay("");
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        inline
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
      />;
      setMonth("");
      setWeek(moment(new Date()).format("YYYY-MM-DD"));
    } else if (filterType == "Month") {
      setDay("");
      setWeek("");
      setMonth(moment(new Date()).format("YYYY-MM-DD"));
    } else if (filterType == "Day") {
      setWeek("");
      setMonth("");
      setDay(moment(new Date()).format("YYYY-MM-DD"));
    }
  };

  const handleDelete = async () => {
    let id = deleteId;
    let data = moment(deleteData.startDateTime).format(
      "ddd MMM D YYYY hh:mm:ss A ZZ"
    );
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
          setCompanyBudget(val?.companyBudget);
        });
    }
  };
  useEffect(() => {
    getGoalById();
  }, [reduxToken]);

  const filterDatafunction = () => {
    const filtertData = FilterType?.map((FilterType) => {
      return (
        <>
          <Button
            className={`${isActive === FilterType ? "active" : ""}`}
            onClick={(e) => setFilterWeeks(e, FilterType)}
          >
            <span>{FilterType}</span>
          </Button>
        </>
      );
    });
    return filtertData;
  };

  return (
    <>
      <div className="booking-layout-wrapper">
        <div className="main-heading">
          <h1>Your Bookings List</h1>
        </div>
        <div>
          <GoalsRowDisplay
            dailyGoals={
              Math.round(
                accurateGoals?.monthlyGoals / 4 / companyBudget?.workPerWeek
              ) ?? 0
            }
            monthlyGoals={accurateGoals?.monthlyGoals ?? 0}
            yearlyGoals={companyBudget?.revenueEarn ?? 0}
            daysToWork={companyBudget?.daysToWork ?? 0}
            showDailyBar={true}
          />
        </div>
        <div className="revenue-list-section">
          <div className="revenue-btn-wrap">
            <ButtonGroup>{filterDatafunction()}</ButtonGroup>
            <Button className="addbtn" onClick={handleClick}>
              <BiPlus />
              Add
            </Button>
          </div>
          <div className="rvn-table-list">
            <div className="rvn-filter">
              <h2>Filter:</h2>
              <div className="filter-list">
                <div className="filter-field">
                  <div className="selectoption">
                    <Form.Select
                      name="service"
                      onChange={handleChange}
                      aria-label="Default select example"
                    >
                      <option value="">Categories</option>

                      {serviceSetting && serviceSetting?.length > 0
                        ? serviceSetting?.map((state) => (
                            <option key={state?.service} value={state?._id}>
                              {state?.service}
                            </option>
                          ))
                        : []}
                    </Form.Select>
                    <span className="slarrow">
                      <HiOutlineChevronDown />
                    </span>
                  </div>
                </div>
                <div className="filter-field">
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
                    <InputGroup.Text id="basic-addon1">
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
                      <option value="">Payment Status</option>
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

            <div className="rvn-table-wrap">
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
                  data={filterData}
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
export default BookingRevenue;
