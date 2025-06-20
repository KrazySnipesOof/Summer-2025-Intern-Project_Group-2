import React, { useMemo, useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  InputGroup,
  Table,
  Card,
} from "react-bootstrap";
import { FaRegSquarePlus } from "react-icons/fa6";
import MaterialReactTable from "material-react-table";
import { FaEllipsisVertical } from "react-icons/fa6";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import * as classServices from "../../services/classServices";
import * as bookingService from "../../services/bookingServices";
import Loader from "../../helper/loader";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Rings } from "react-loader-spinner";

export default function Classes() {
  // All States
  const [classesList, setClassesList] = useState([]);
  const [allBookingList, setAllBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [classToShow, setClassToShow] = useState({});
  const [classBookings, setClassBookings] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState([]);
  const [classFormData, setClassFormData] = useState({
    name: "",
    instructor: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "0",
    seats: {
      totalSeats: 0,
      availableSeats: 0,
      bookedSeats: 0,
    },
    location: "Online",
    difficultyLevel: "Beginner",
    description: "",
    isReoccurring: false,
    reoccurringDays: "Weekly",
    reoccurringEndDate: "",
  });

  // All Functions and API Calls
  const getClasses = async () => {
    setClassLoading(true);
    try {
      const response = await classServices.getClassList();
      const bookedClasses = await bookingService.bookingList();
      if (response.status === 200) {
        setClassesList(response?.data?.data);
        const filterClasses = bookedClasses?.data?.data[0]?.data?.filter(
          (item) => {
            return item?.serviceType == "Class";
          }
        );
        setAllBookingList(filterClasses);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setClassLoading(false);
    }
  };

  const handleEdit = (row) => {
    const data = row?.original;
    setSelectedId(data?._id);
    setClassFormData({
      name: data?.name,
      instructor: data?.instructor,
      date: data?.date,
      startTime: data?.occurrences[0]?.startTime,
      endTime: data?.occurrences[0]?.endTime,
      price: `$${data?.price}`,
      seats: {
        totalSeats: data?.occurrences[0]?.seats?.totalSeats,
        availableSeats: data?.occurrences[0]?.seats?.availableSeats,
        bookedSeats: data?.occurrences[0]?.seats?.bookedSeats,
      },
      location: data?.location,
      difficultyLevel: data?.difficultyLevel,
      description: data?.description,
      isReoccurring: data?.isReoccurring,
      reoccurringDays: data?.reoccurringDays,
      reoccurringEndDate: data?.reoccurringEndDate,
    });
    setIsEdit(true);
  };

  const handleAdd = () => {
    setClassFormData({
      name: "",
      instructor: "",
      date: "",
      startTime: "",
      endTime: "",
      price: "0",
      seats: {
        totalSeats: 0,
        availableSeats: 0,
        bookedSeats: 0,
      },
      location: "",
      difficultyLevel: "Beginner",
      description: "",
      isReoccurring: false,
      reoccurringDays: "Weekly",
      reoccurringEndDate: "",
    });
    setIsAdd(true);
    setError({});
    setSelectedId("");
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await classServices.deleteClass(id);
      if (response.status === 200) {
        toast.success("Class deleted successfully");
        getClasses();
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Error deleting class");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowDeleteModal(false);
    setSelectedId("");
    setClassFormData({
      name: "",
      instructor: "",
      date: "",
      startTime: "",
      endTime: "",
      price: "0",
      seats: {
        totalSeats: 0,
        availableSeats: 0,
        bookedSeats: 0,
      },
      location: "",
      difficultyLevel: "Beginner",
      description: "",
      isReoccurring: false,
      reoccurringDays: "Weekly",
      reoccurringEndDate: "",
    });
    setIsEdit(false);
    setIsAdd(false);
    setError({});
  };

  const handleDateChange = (date) => {
    if (date) {
      setClassFormData({
        ...classFormData,
        date: moment(date).format("ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"),
      });
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setClassFormData({
        ...classFormData,
        reoccurringEndDate: moment(date).format(
          "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
        ),
      });
    }
  };

  const handleTimeChange = (time, field) => {
    if (time) {
      const formattedTime = moment(time).format("hh:mmA");
      setClassFormData({
        ...classFormData,
        [field]: formattedTime,
      });
    }
  };

  const filterPassedTime = (time) => {
    const selectedDate = moment(classFormData?.date, "ddd, MMM D, YYYY");
    const currentDate = moment();
    return (
      selectedDate.isAfter(currentDate, "day") ||
      moment(time).isSameOrAfter(currentDate, "minute")
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const priceValue = classFormData?.price?.replace(/[^0-9.]/g, "");
    const validate = () => {
      let err = {};
      let isValid = true;
      let num2 = /^\d+(\.\d+)?$/;

      if (!classFormData?.name) {
        isValid = false;
        err.name = "Class name is required";
      }
      if (!classFormData?.instructor) {
        isValid = false;
        err.instructor = "Instructor name is required";
      }
      if (!classFormData?.price) {
        isValid = false;
        err.price = "Price is required";
      } else if (!num2.test(priceValue)) {
        isValid = false;
        err.price = "Invalid price value";
      } else if (Number(priceValue) < 1) {
        isValid = false;
        err.price = "Price must be greater than 0";
      }
      if (!classFormData?.seats?.totalSeats) {
        isValid = false;
        err.totalSeats = "Total seats is required";
      } else if (Number(classFormData?.seats?.totalSeats) < 1) {
        isValid = false;
        err.totalSeats = "Total seats must be greater than 0";
      } else if (!num2.test(classFormData?.seats?.totalSeats)) {
        isValid = false;
        err.totalSeats = "Invalid seats value";
      }
      if (!classFormData?.date) {
        isValid = false;
        err.date = "Date is required";
      }
      if (!classFormData?.startTime) {
        isValid = false;
        err.startTime = "Start time is required";
      }
      if (!classFormData?.endTime) {
        isValid = false;
        err.endTime = "End time is required";
      }
      if (classFormData?.isReoccurring && !classFormData?.reoccurringEndDate) {
        isValid = false;
        err.reoccurringEndDate = "End date is required";
      }
      setError(err);
      setIsLoading(false);
      return isValid;
    };
    if (!validate()) {
      setIsLoading(false);
      return;
    } else {
      const obj = {
        ...classFormData,
        price: Number(priceValue),
      };
      try {
        if (isEdit) {
          classServices.updateClass(selectedId, obj).then((response) => {
            if (response.status === 200) {
              toast.success("Class updated successfully");
              getClasses();
              handleClose();
            } else {
              console.error(response);
              toast.error("Error updating class");
            }
          });
        }
        if (isAdd) {
          classServices.createClass(obj).then((response) => {
            if (response.status === 200) {
              toast.success("Class created successfully");
              getClasses();
              handleClose();
            } else {
              console.error(response);
              toast.error("Error creating class");
            }
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error submitting form");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Initial API Calls
  useEffect(() => {
    getClasses();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row?.name,
        id: "class",
        header: "Class",
        size: 180,
      },
      {
        accessorFn: (row) => `${moment(row?.date).format("ddd, MMM DD, YYYY")}`,
        id: "date",
        header: "Date",
        size: 160,
      },
      {
        accessorFn: (row) => row?.instructor,
        id: "instructor",
        header: "Instructor",
        size: 160,
      },

      {
        accessorFn: (row) => `$${row?.price}`,
        id: "price",
        header: "Price",
        size: 100,
      },
      {
        accessorFn: (row) => row?.seats,
        id: "seats",
        header: "Seats",
        size: 100,
        Cell: ({ row }) => (
          <div className="action-btn">
            {row?.original?.occurrences?.[0]?.seats?.bookedSeats} /{" "}
            {row?.original?.occurrences?.[0]?.seats?.totalSeats}
          </div>
        ),
      },
      {
        accessorFn: (row) => row?.action,
        id: "action",
        header: "",
        size: 140,
        Cell: ({ row }) => (
          <div className="action-btn">
            <Button
              onClick={(e) => {
                handleEdit(row);
              }}
            >
              <BiSolidEdit />
            </Button>
            <Button
              onClick={(e) => {
                setSelectedId(row?.original?._id);
                setShowDeleteModal(true);
              }}
            >
              <RiDeleteBinLine />
            </Button>
            <Button
              onClick={(e) => {
                setClassToShow(row?.original);
                setClassBookings(
                  allBookingList?.filter((booking) => {
                    return booking?.classes[0]?._id == row?.original?._id;
                  })
                );
                setShowBooking(true);
              }}
            >
              <FaEllipsisVertical />
            </Button>
          </div>
        ),
      },
    ],
    [classesList, allBookingList]
  );

  return (
    <div className="appointment-wrapper classes">
      <div className="classes-header">
        <p className="classes-header-title">
          <strong>Class Management</strong> Use this section to create, edit or
          remove the classes you offer.{" "}
        </p>
        <Button
          onClick={() => {
            handleAdd();
          }}
          disabled={classLoading}
          className="bisi-btn"
        >
          <FaRegSquarePlus />
          Add Class
        </Button>
      </div>
      <div>
        {classLoading ? (
          <Loader />
        ) : (
          <div className="rvn-table-wrap">
            <MaterialReactTable
              columns={columns}
              enableBottomToolbar={false}
              data={classesList}
              enableColumnActions={false}
              enableSorting={false}
              enableTopToolbar={false}
              muiTableBodyRowProps={{
                sx: {
                  height: "50px",
                  alignItems: "center",
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  border: "1px solid rgba(81, 81, 81, .5)",
                  textAlign: "center",
                  textTransform: "capitalize",
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  padding: "4px",
                  textAlign: "center",
                },
              }}
              muiTablePaperProps={{
                sx: {
                  backgroundColor: "#E4E4E4",
                },
              }}
            />
          </div>
        )}
      </div>
      <Modal
        show={showDeleteModal}
        centered
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="sm"
        className="classes-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this class? This action cannot be
          undone.
        </Modal.Body>
        <div className="footer">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(selectedId);
              handleClose();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Rings
                height="30"
                width="80"
                radius="10"
                color="#fff"
                wrapperStyle
                wrapperClass
              />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Modal>
      <Modal
        centered
        show={isEdit || isAdd}
        onHide={handleClose}
        backdrop="static"
        dialogClassName="classes-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Class" : "Add New Class"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <small>Class Name</small>
                <Form.Control
                  placeholder="Enter Class Name"
                  value={classFormData?.name}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      name: e.target.value,
                    })
                  }
                />
                <span className="error">{error?.name}</span>
              </Col>
              <Col xs={8} md={4} className="mt-3 mt-md-0">
                <small>Instructor</small>
                <Form.Control
                  placeholder="Instructor Name"
                  value={classFormData?.instructor}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      instructor: e.target.value,
                    })
                  }
                />
                <span className="error">{error?.instructor}</span>
              </Col>
              <Col xs={4} md={2} className="mt-3 mt-md-0">
                <small>Price</small>
                <Form.Control
                  placeholder="Enter Price"
                  value={classFormData?.price}
                  onChange={(e) => {
                    let price = e.target.value.replace(/[^0-9.]/g, "");
                    setClassFormData({
                      ...classFormData,
                      price: `$${price}`,
                    });
                  }}
                />
                <span className="error">{error?.price}</span>
              </Col>
            </Row>

            <Row className="mb-3">
              <small>Description</small>
              <Col>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="About this class or materials needed."
                  value={classFormData?.description}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      description: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={4}>
                <small>Difficulty Level</small>
                <Form.Select
                  value={classFormData?.difficultyLevel}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      difficultyLevel: e.target.value,
                    })
                  }
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Col>
              <Col xs={2}>
                <small>Total Seats</small>
                <Form.Control
                  type="number"
                  placeholder="Total Seats"
                  value={classFormData?.seats?.totalSeats}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      seats: {
                        totalSeats: Number(e.target.value),
                        availableSeats:
                          Number(e.target.value) -
                          classFormData?.seats?.bookedSeats,
                        bookedSeats: classFormData?.seats?.bookedSeats,
                      },
                    })
                  }
                />
                <span className="error">{error?.totalSeats}</span>
              </Col>
              <Col xs={6}>
                <small>Location</small>
                <Form.Control
                  placeholder="Enter Location"
                  value={classFormData?.location}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      location: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>

            <Row>
              <Col xs={4}>
                <small>Date</small>
                <InputGroup>
                  <DatePicker
                    selected={
                      classFormData?.date
                        ? moment(
                            new Date(classFormData?.date),
                            "ddd, MMM D, YYYY"
                          ).toDate()
                        : null
                    }
                    onChange={handleDateChange}
                    dateFormat="EEE, MMM d, yyyy"
                    minDate={new Date()}
                    onKeyDown={(e) => e.preventDefault()}
                    className="form-control"
                    placeholderText="Date"
                  />
                </InputGroup>
                <span className="error">{error?.date}</span>
              </Col>
              <Col xs={2}>
                <small>Start Time</small>
                <InputGroup>
                  <DatePicker
                    selected={
                      classFormData?.startTime
                        ? moment(classFormData?.startTime, "hh:mmA").toDate()
                        : null
                    }
                    onChange={(time) => handleTimeChange(time, "startTime")}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    minTime={
                      moment(classFormData?.date, "ddd, MMM D, YYYY").isSame(
                        moment(),
                        "day"
                      )
                        ? moment().toDate()
                        : moment().startOf("day").toDate()
                    }
                    maxTime={moment().endOf("day").toDate()}
                    dateFormat="hh:mm a"
                    placeholderText="Start Time"
                    className="form-control"
                    filterTime={filterPassedTime}
                    onKeyDown={(e) => e.preventDefault()}
                    disabled={!classFormData?.date}
                  />
                </InputGroup>
                <span className="error">{error?.startTime}</span>
              </Col>
              <Col xs={2}>
                <small>End Time</small>
                <InputGroup>
                  <DatePicker
                    selected={
                      classFormData?.endTime
                        ? moment(classFormData?.endTime, "hh:mmA").toDate()
                        : null
                    }
                    onChange={(time) => handleTimeChange(time, "endTime")}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    minTime={
                      classFormData?.startTime
                        ? moment(classFormData?.startTime, "hh:mmA")
                            .add(30, "minutes")
                            .toDate()
                        : moment().toDate()
                    }
                    maxTime={moment().endOf("day").toDate()}
                    dateFormat="hh:mm a"
                    placeholderText="End Time"
                    className="form-control"
                    filterTime={filterPassedTime}
                    onKeyDown={(e) => e.preventDefault()}
                    disabled={!classFormData?.startTime}
                  />
                </InputGroup>
                <span className="error">{error?.endTime}</span>
              </Col>
              {classFormData?.isReoccurring && (
                <>
                  <Col xs={4}></Col>
                  <Col xs={3} className="mt-3">
                    <small>Repeat</small>
                    <Form.Select
                      value={classFormData?.reoccurringDays}
                      onChange={(e) =>
                        setClassFormData({
                          ...classFormData,
                          reoccurringDays: e.target.value,
                        })
                      }
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </Form.Select>
                  </Col>
                  <Col xs={4} className="mt-3">
                    <small>End Date</small>
                    <InputGroup>
                      <DatePicker
                        selected={
                          classFormData?.reoccurringEndDate
                            ? moment(
                                new Date(classFormData?.reoccurringEndDate),
                                "ddd, MMM D, YYYY"
                              ).toDate()
                            : null
                        }
                        onChange={handleEndDateChange}
                        dateFormat="EEE, MMM d, yyyy"
                        minDate={new Date(classFormData?.date)}
                        onKeyDown={(e) => e.preventDefault()}
                        className="form-control"
                        placeholderText="End date"
                        disabled={!classFormData?.date}
                      />
                    </InputGroup>
                    <span className="error">{error?.reoccurringEndDate}</span>
                  </Col>
                </>
              )}
              <Col
                xs={classFormData?.isReoccurring ? 4 : 3}
                className={`${classFormData?.isReoccurring ? "mt-3" : "mt-0"}`}
              >
                <small className="invisible">Is Reoccuring</small>
                <Button
                  className=""
                  onClick={() => {
                    setClassFormData({
                      ...classFormData,
                      isReoccurring: !classFormData?.isReoccurring,
                      reoccurringDays: "Weekly",
                    });
                  }}
                >
                  {`${
                    classFormData?.isReoccurring ? "Cancel" : "Make"
                  } Reoccurring`}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <div className="footer">
          {isEdit ? (
            <Button
              className="bisi-btn cancel"
              onClick={() => {
                setIsEdit(false);
                setShowDeleteModal(true);
              }}
              disabled={isLoading}
            >
              <RiDeleteBinLine />
              Cancel Class
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            className="bisi-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Rings
                height="30"
                width="80"
                radius="10"
                color="#fff"
                wrapperStyle
                wrapperClass
              />
            ) : (
              <>
                <FaRegSquarePlus />
                {isEdit ? "Update Class" : "Create Class"}
              </>
            )}
          </Button>
        </div>
      </Modal>
      <Modal
        show={showBooking}
        onHide={() => setShowBooking(false)}
        backdrop="static"
        className="classes-modal"
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{classToShow?.name} Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="class-details-header">
            <h3>Class List</h3>
            <p>
              {classToShow?.seats?.bookedSeats}/{classToShow?.seats?.totalSeats}{" "}
              Seats
            </p>
          </div>
          <div className="class-details">
            {classBookings?.length > 0 ? (
              <div className="table-container">
                {classBookings.map((booking, index) => (
                  <div className="table-row" key={index}>
                    <div className="column">{booking?.name}</div>
                    <div className="column">
                      {booking?.phoneNumber ? booking?.phoneNumber : "-"}
                    </div>
                    <div className="column">{booking?.numberOfSeats}</div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center p-3 empty">
                <Card.Body className="font-weight-bold">
                  Class not yet booked
                </Card.Body>
              </Card>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
