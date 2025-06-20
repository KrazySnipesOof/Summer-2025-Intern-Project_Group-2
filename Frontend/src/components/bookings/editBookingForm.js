import { useEffect, useState, useMemo } from "react";
import { Container, Col, Form, Row, Button, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { BsChevronDoubleRight } from "react-icons/bs";
import * as calenderService from "../../services/calenderServices";
import * as bookingService from "../../services/bookingServices";
import * as userServices from "../../services/userServices";
import * as classServices from "../../services/classServices";
import Multiselect from "multiselect-react-dropdown";
import "./bookingForm.scss";
import DatePicker from "react-datepicker";
import moment from "moment";
import Select from "react-select";
import { createNotification } from "../../helper/notification";
import { useSelector } from "react-redux";
import { ScheduleMeeting, timeSlotDifference } from "react-schedule-meeting";
import Modal from "react-bootstrap/Modal";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../customerBooking/checkoutForm";
import { loadStripe } from "@stripe/stripe-js";

const EditBookings = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [startDateTime, setStartDateTime] = useState();
  const [schedule, setSchedule] = useState([]);
  const [price, setPrice] = useState("");
  const [getData, setGetData] = useState({
    name: "",
    email: "",
    service: "",
    phoneNumber: "",
    address: "",
    paymentType: "",
    serviceType: "",
    numberOfSeats: "",
  });

  const [serviceSetting, setServiceSetting] = useState([]);
  const [serviceBooking, setServiceBooking] = useState([]);
  const [Dateselect, setDateselect] = useState("");
  const [selectTime, setSelectTime] = useState("");
  const [formatDate, setFormatDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [error, setError] = useState([]);
  const [showDate, setShowDate] = useState("");
  const [showIncomingDate, setIncomingDate] = useState("");
  const [showIncomingTime, setIncomingTime] = useState("");

  const { id } = useParams();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState();
  const paymentoptions = [
    { value: "UnPaid", label: "UNPAID" },
    { value: "Paid", label: "PAID" },
    { value: "Cash", label: "Cash" },
    { value: "CreditCard", label: "CreditCard" },
  ];
  const bookingoptions = [
    { value: "self", label: "Self" },
    { value: "giftcertificate", label: "Gift Certificate" },
  ];
  const [selectedOption, setSelectedOption] = useState();

  const filteredPaymentOptions = useMemo(() => {
    return paymentoptions?.filter((opt) => opt.value !== "Paid");
  }, []);

  const userID = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  const [publicKey, setPublicKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(publicKey)
  );

  const bookingTypeOption = useMemo(() => {
    let options = [];
    if (serviceSetting?.length > 0 && !isClassSelected) {
      options = serviceSetting.map((item) => ({
        _id: item?._id,
        name: item?.service,
        price: item?.price,
        serviceTime: item?.serviceTime,
        type: "Services",
      }));
    }
    if (classes?.length > 0 && isClassSelected) {
      options.push(
        ...classes.map((item) => ({
          _id: item?._id,
          name: item?.name,
          price: item?.price,
          serviceTime: {
            // Get hours and minutes of class
            hours: Math.floor(
              moment
                .duration(
                  moment(item?.occurrences[0]?.endTime, "hh:mmA").diff(
                    moment(item?.occurrences[0]?.startTime, "hh:mmA")
                  )
                )
                .asHours()
            ),
            minutes: moment
              .duration(
                moment(item?.occurrences[0]?.endTime, "hh:mmA").diff(
                  moment(item?.occurrences[0]?.startTime, "hh:mmA")
                )
              )
              .minutes(),
          },
          type: "Classes",
          occurrences: item?.occurrences,
        }))
      );
    }
    return options;
  }, [serviceSetting, classes, isClassSelected]);

  const filteredOptions = useMemo(() => {
    if (isClassSelected && serviceBooking?.length > 0) {
      return bookingTypeOption.filter(
        (option) => option?._id !== serviceBooking[0]?._id
      );
    }
    return bookingTypeOption;
  }, [isClassSelected, serviceBooking, bookingTypeOption]);

  const handleSelect = (selectedList, selectedItem) => {
    if (selectedItem?.type === "Classes") {
      setServiceBooking([selectedItem]);
      setIsClassSelected(true);
    } else {
      const filteredList = selectedList.filter((i) => i.type !== "Classes");
      setServiceBooking(filteredList);
      setIsClassSelected(false);
    }
  };

  const getClassDuration = () => {
    const selectedClass = classes?.find(
      (cls) => cls._id === serviceBooking[0]?._id
    );
    return moment(selectedClass?.occurrences[0]?.endTime, "hh:mma").diff(
      moment(selectedClass?.occurrences[0]?.startTime, "hh:mma"),
      "minutes"
    );
  };

  const handleEditDate = (date) => {
    setSelectTime("");
    setIncomingDate(false);
    setStartDateTime();
    const date1 = moment(date).format("ll");
    setDateselect(date1);
  };
  const handlePaymentSelect = (selectedPaymentOption) => {
    setSelectedPaymentOption(selectedPaymentOption);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const handleEditStartTime = (time1) => {
    const time = moment(time1).format("hh:mm:A");
    setSelectTime(time);
    setIncomingTime(false);
    if (Dateselect != "") {
      const mergedDateTime = moment(`${Dateselect} ${time}`, "ll hh:mm:A");
      const mergedDateTimeString = mergedDateTime.format(
        "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
      );
      setFormatDate(mergedDateTimeString);
    }
  };
  const handleRemove = (selectedList) => {
    setServiceBooking(selectedList);
  };

  const getUser = async () => {
    const response = await userServices.GetUserByID(userID);
    if (response.success == true) {
      setPublicKey(response?.data?.publicKey);
    } else {
      console.log("error");
    }
  };

  const getClasses = async () => {
    const response = await classServices.getClassList();
    if (response?.data?.success == true) {
      const filteredClasses = response?.data?.data?.filter((item) => {
        const currentDate = new Date();
        if (item?.isReoccurring) {
          const classEndDate = new Date(item?.reoccurringEndDate);
          return classEndDate >= currentDate;
        } else {
          const classDate = new Date(item?.date);
          return classDate >= currentDate;
        }
      });
      setClasses(filteredClasses);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, [publicKey]);
  useEffect(() => {
    getUser();
    getSchedule();
    getClasses();
  }, [reduxToken]);

  const getSchedule = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await calenderService?.getSchedule(reduxToken);
      if (response?.status == 200) {
        let data1 = response?.data?.data[0]?.scheduledData;
        setSchedule(data1);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService?.getServicesSetting(reduxToken);
    if (response?.status == 200) {
      const service = response?.data?.data[0]?.service;
      const selectedService = service?.map((item) => {
        return item?.serviceId;
      });
      setServiceSetting(selectedService);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  function test() {
    const filterStartDate = [];
    if (schedule?.length > 0) {
      for (const item of schedule) {
        const currentDate = new Date(item.startDate);
        const year = currentDate.getFullYear();
        const month = currentDate.toLocaleString("default", {
          month: "short",
        });
        const day = currentDate.getDate();
        const startTime = `${day} ${month} ${year} ${item?.startTime}`;
        const endTime = `${day} ${month} ${year} ${item?.endTime}`;

        const dt = { startTime: startTime, endTime: endTime };
        filterStartDate.push(dt);
      }
      return filterStartDate;
    }
  }

  useEffect(() => {
    if (schedule?.length > 0) {
    }
  }, [schedule]);
  const endTime = new Date(startDateTime);
  endTime.setMinutes(endTime.getMinutes() + 30);

  const unavailableTimeSlots = [
    {
      startTime: startDateTime,
      endTime: endTime,
    },
  ];

  const formattedTimeSlots = unavailableTimeSlots.map((slot) => ({
    startTime: moment(slot.startTime).format("DD MMM YYYY hh:mm:A"),
    endTime: moment(slot.endTime).format("DD MMM YYYY hh:mm:A"),
  }));
  let formattedArray = [];

  const updatedFormattedTimeSlots = formattedTimeSlots.map((slot) => ({
    startTime: moment(slot.startTime).format("DD MMM YYYY hh:mm:A"),
    endTime: moment(slot.endTime).format("DD MMM YYYY hh:mm:A"),
  }));

  function isTimeSlotExist(updatedFormattedTimeSlots, testArray) {
    for (let i = 0; i < updatedFormattedTimeSlots?.length; i++) {
      const updatedStartTime = new Date(
        updatedFormattedTimeSlots[i].startTime
      ).getTime();
      const updatedEndTime = new Date(
        updatedFormattedTimeSlots[i].endTime
      ).getTime();

      for (let j = 0; j < testArray?.length; j++) {
        const testStartTime = new Date(testArray[j].startTime).getTime();
        const testEndTime = new Date(testArray[j].endTime).getTime();
        if (
          (updatedStartTime >= testStartTime &&
            updatedStartTime <= testEndTime) ||
          (updatedEndTime >= testStartTime && updatedEndTime <= testEndTime)
        ) {
          // setInBtw(true);
          return true;
        }
      }
    }

    // setInBtw(false);
    return false;
  }
  const isExist = isTimeSlotExist(updatedFormattedTimeSlots, test());
  // setInBtw(isExist)

  const availableTimeSlotsLessUnavailableTimeSlots = timeSlotDifference(
    test(),
    formattedTimeSlots
  );
  const slotData = [];
  const newSchedule =
    availableTimeSlotsLessUnavailableTimeSlots?.length > 1
      ? availableTimeSlotsLessUnavailableTimeSlots.map((item) => {
          const startDate = new Date(item?.startTime).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const Time = new Date(item?.startTime);
          const changeTime = moment(Time);
          const startTime = changeTime.format("hh:mm:A");

          const Time1 = new Date(item?.endTime);
          const changeTime1 = moment(Time1);
          const endTime = changeTime1.format("hh:mm:A");
          slotData.push({ startDate, startTime, endTime });
        })
      : "";

  const scheduleData =
    schedule?.length > 0
      ? schedule.map((item, id) => {
          let min = item.startTime.split(":");
          let min1 = item.endTime.split(":");

          const currentDate = new Date(item.startDate);
          const year = currentDate.getFullYear();
          const month = currentDate.toLocaleString("default", {
            month: "short",
          });
          const day = currentDate.getDate();
          const startTime = `${day} ${month} ${year} ${item?.startTime}`;
          const endTime = `${day} ${month} ${year} ${item?.endTime}`;

          return {
            id,
            startTime: startTime,
            endTime: endTime,
          };
        })
      : "";

  const filteredClassSchedule = useMemo(() => {
    if (!classes || !isClassSelected) return [];

    const selectedClass = classes?.find(
      (cls) => cls._id === serviceBooking[0]?._id
    );
    if (!selectedClass) return [];

    if (!selectedClass.isReoccurring) {
      const formattedDate = moment(selectedClass.date).format("D MMM YYYY");

      return [
        {
          id: selectedClass._id,
          startTime: moment(
            `${formattedDate} ${selectedClass?.occurrences[0]?.startTime}`,
            "D MMM YYYY hh:mma"
          ).toISOString(),
          endTime: moment(
            `${formattedDate} ${selectedClass?.occurrences[0]?.endTime}`,
            "D MMM YYYY hh:mma"
          ).toISOString(),
        },
      ];
    } else {
      const reoccurringSchedule = selectedClass?.occurrences?.map(
        (instance) => {
          const formattedDate = moment(instance?.date).format("D MMM YYYY");
          return {
            id: selectedClass._id,
            startTime: moment(
              `${formattedDate} ${instance?.startTime}`,
              "D MMM YYYY hh:mma"
            ).toISOString(),
            endTime: moment(
              `${formattedDate} ${instance?.endTime}`,
              "D MMM YYYY hh:mma"
            ).toISOString(),
          };
        }
      );
      return reoccurringSchedule;
    }
  }, [classes, isClassSelected, serviceBooking]);

  const Datepicker = (date) => {
    const selectedTime = moment(date.startTime).format(
      "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
    );
    setStartDateTime(selectedTime);
  };

  const Validation = () => {
    let arr = [];
    serviceBooking?.map((val) => {
      return arr.push(val._id);
    });
    const obj = {
      name: getData.name,
      email: getData.email,
      phoneNumber: getData.phoneNumber,
      service: arr,
      servicePrice: price,
    };
    let err = {};
    let isValid = true;
    let phoneNo = /^\d{10,15}$/;
    let num2 = /^\d+(\.\d+)?$/;
    let regex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!obj.name) {
      err["name"] = "Customer Name required";
      isValid = false;
    } else if (obj.name?.trim() === "") {
      err["name"] = "Customer Name required";
      isValid = false;
    }

    if (!obj.email) {
      isValid = false;
      err["email"] = "Email is required";
    } else if (obj.email?.trim() === "") {
      isValid = false;
      err["email"] = "Email is required";
    } else if (!regex.test(obj.email)) {
      isValid = false;
      err["email"] = "Please enter a valid email address";
    }
    if (showDate == false) {
      if (!Dateselect) {
        err["Dateselect"] = "Date is required";
        isValid = false;
      }
      if (!selectTime) {
        err["formatDate"] = "Time is required";
        isValid = false;
      }
    }

    if (selectedPaymentOption?.value !== "UnPaid") {
      if (!obj.servicePrice) {
        isValid = false;
        err["servicePrice"] = "Price is required";
      } else if (obj.servicePrice?.trim() == 0) {
        err["servicePrice"] = "Price shoud be greater than 0";
        isValid = false;
      } else if (!obj.servicePrice?.trim().match(num2)) {
        err["servicePrice"] = "Please enter the valid price";
        isValid = false;
      }
    }

    if (!obj.phoneNumber) {
      isValid = false;
      err["phone"] = "Phone Number required";
    } else if (!phoneNo.test(obj.phoneNumber.replace(/-/g, ""))) {
      isValid = false;
      err["phone"] = "Phone number must be of 10-12 digits";
    }

    if (obj?.service?.length <= 0) {
      err["service"] = "Services is required";
      isValid = false;
    }

    setError(err);
    return isValid;
  };

  const handleSubmit = async (paidPrice) => {
    let serviceArray = [];
    let classesArray = [];
    serviceBooking.map((val) => {
      if (val.type === "Services") {
        serviceArray.push(val._id);
      }
      if (val.type === "Classes") {
        classesArray.push(val._id);
      }
    });
    const obj = {
      name: getData.name,
      email: getData.email,
      phoneNumber: getData.phoneNumber,
      service: serviceArray,
      classes: classesArray,
      address: getData.address,
      startDateTime: startDateTime
        ? startDateTime
        : formatDate
        ? formatDate
        : getData.startDateTime,
      startDate: startDateTime
        ? startDateTime
        : formatDate
        ? formatDate
        : getData.startDateTime,
      availableSlot: slotData,
      servicePrice: paidPrice ? paidPrice : price,
      paymentType: selectedPaymentOption?.value,
      scheduleTime:
        startDateTime && startDateTime != getData.startDateTime
          ? startDateTime
          : formatDate
          ? formatDate
          : "null",
      prevSchedule: getData.startDateTime,
      scheduleexist:
        startDateTime == undefined ? getData.scheduleexist : isExist,
    };
    if (Validation()) {
      if (reduxToken) {
        setIsLoading(true);
        let response;
        if (!isClassSelected) {
          response = await bookingService.editBooking(id, obj);
        } else {
          response = await bookingService.editClassBooking(id, obj);
        }
        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          setTimeout(() => {
            setIsLoading(false);
            navigate("/booking");
          }, 3000);
        } else if (response?.status == 400) {
          console.log(response, "++++res");
          createNotification("error", "Schedule is already booked");
          setIsLoading(false);
        } else if (response.response == "Request failed with status code 500") {
          createNotification("error", "Something went wrong");
          setIsLoading(false);
        } else {
          console.log(":::error");
        }
      }
    }
  };

  useEffect(() => {
    getBooking();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const getBooking = async () => {
    const response = await bookingService.singleBooking(id);
    if (response?.status == 200) {
      setGetData(response?.data?.data);
      setShowDate(response?.data?.data?.scheduleexist);
      setIncomingDate(response?.data?.data?.scheduleexist);
      setIncomingTime(response?.data?.data?.scheduleexist);
      setIsClassSelected(response?.data?.data?.serviceType === "Class");
      setServiceBooking(() => {
        if (response?.data?.data?.serviceType === "Class") {
          const singleClass = response?.data?.data?.classes[0];
          return [
            {
              _id: singleClass?._id,
              name: singleClass?.name,
              price: singleClass?.price,
              serviceTime: {
                hours: Math.floor(
                  moment
                    .duration(
                      moment(
                        singleClass?.occurrences[0]?.endTime,
                        "hh:mmA"
                      ).diff(
                        moment(singleClass?.occurrences[0]?.startTime, "hh:mmA")
                      )
                    )
                    .asHours()
                ),
                minutes: moment
                  .duration(
                    moment(singleClass?.occurrences[0]?.endTime, "hh:mmA").diff(
                      moment(singleClass?.occurrences[0]?.startTime, "hh:mmA")
                    )
                  )
                  .minutes(),
              },
              type: "Classes",
            },
          ];
        } else {
          return response?.data?.data?.service?.map((service) => ({
            _id: service?._id,
            name: service?.service,
            price: service?.price,
            serviceTime: service?.serviceTime,
            type: "Services",
          }));
        }
      });
      setDateselect(
        moment(response?.data?.data?.startDateTime).format("MMM DD, YYYY")
      );
      setSelectTime(
        moment(response?.data?.data?.startDateTime).format("hh:mm:A")
      );
      const paymentType = paymentoptions.filter(
        (item) => item.value == response?.data?.data?.paymentType
      );
      setSelectedPaymentOption(paymentType[0]);
      const bookingType = bookingoptions.filter(
        (item) => item.value == response?.data?.data?.bookingType
      );
      setSelectedOption(bookingType);
      setPrice(response?.data?.data?.servicePrice);
    } else {
      console.log(":::error");
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setGetData({ ...getData, [name]: value });
  };

  const specialTime = () => {
    setStartDateTime("");
    setDateselect("");
    setIncomingDate(getData?.scheduleexist);
    setIncomingTime(getData?.scheduleexist);
    setShowDate(!showDate);
    setError([]);
  };
  const filterOptionsEdit = (time) => {
    const currentTime = moment();
    let roundedTime =
      currentTime.minute() >= 30
        ? currentTime.startOf("hour").add(1, "hour")
        : currentTime.startOf("hour").add(30, "minutes");

    roundedTime = roundedTime.subtract(30, "minutes"); // Subtract 30 minutes from the rounded time
    const selectedDate = moment(Dateselect).startOf("day");
    const currentDate = moment().startOf("day");
    const isFutureDate = selectedDate.isAfter(currentDate);

    if (selectedDate.isSame(currentDate)) {
      if (currentTime.isSame(roundedTime)) {
        return moment(time).isAfter(roundedTime);
      } else {
        return moment(time).isSameOrAfter(roundedTime);
      }
    }

    if (isFutureDate) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <h2>
                  <b>My Bookings</b>
                </h2>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Bookings</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="layout-content-wrapper booking-layout gg">
              <div>
                <div className="main-heading">
                  <h1>Edit Booking</h1>
                  <p>Fill the following fields to edit a booking</p>
                </div>
                <div className="bookingform-wrapper addbooking-fwr">
                  <div className="addbooking-form">
                    <div className="form-wrapper addbooking">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (
                            selectedPaymentOption?.value === "CreditCard" &&
                            Validation()
                          ) {
                            setShowModal(true);
                          } else {
                            handleSubmit();
                          }
                        }}
                      >
                        <Row>
                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Edit/Search Customer Name</Form.Label>
                              <input
                                type="text"
                                name="name"
                                value={getData.name}
                                disabled={getData.paymentType !== "UnPaid"}
                                onChange={onInputChange}
                              />
                              <span className="error"> {error?.name} </span>
                            </Form.Group>
                          </Col>
                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Edit / Get Email ID</Form.Label>
                              <input
                                type="text"
                                value={getData.email}
                                name="email"
                                disabled={getData.paymentType !== "UnPaid"}
                                onChange={onInputChange}
                              />
                              <span className="error"> {error?.email} </span>
                            </Form.Group>
                          </Col>

                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone Number</Form.Label>
                              <div className="selectinput-field">
                                <Form.Select name="state" disabled={true}>
                                  <option>{getData.selectedCountry}</option>
                                </Form.Select>
                                <Form.Control
                                  type="text"
                                  placeholder="Add Phone Number"
                                  name="phoneNumber"
                                  value={getData.phoneNumber}
                                  disabled={getData.paymentType !== "UnPaid"}
                                  onChange={onInputChange}
                                />
                              </div>
                              <span className="error">{error?.phone}</span>
                            </Form.Group>
                          </Col>

                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Select Booking Type</Form.Label>
                              <div className="bktype-form">
                                <Select
                                  options={bookingoptions}
                                  value={selectedOption}
                                  onChange={handleSelectChange}
                                  isDisabled={true}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          {getData?.bookingType === "giftcertificate" ? (
                            <>
                              <Col xs={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Benificial Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    pattern="[0-9]*"
                                    placeholder="Add Benificial Name"
                                    name="phone"
                                    value={getData?.benificialName}
                                    disabled={true}
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Benificial Email</Form.Label>
                                  <Form.Control
                                    type="text"
                                    pattern="[0-9]*"
                                    placeholder="Add Benificial Email"
                                    name="phone"
                                    value={getData?.benificialEmail}
                                    disabled={true}
                                  />
                                </Form.Group>
                              </Col>

                              <Col xs={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    Benificial Phone Number
                                  </Form.Label>
                                  <div className="selectinput-field">
                                    <Form.Select name="state" disabled={true}>
                                      <option>{getData.selectedCountry}</option>
                                    </Form.Select>
                                    <Form.Control
                                      type="text"
                                      placeholder="Add Phone Number"
                                      name="phone"
                                      value={getData?.benificialPhone}
                                      disabled={true}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </>
                          ) : (
                            ""
                          )}

                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Service</Form.Label>
                              {serviceSetting && serviceSetting.length > 0 ? (
                                <Multiselect
                                  options={filteredOptions}
                                  selectedValues={serviceBooking}
                                  onSelect={handleSelect}
                                  onRemove={handleRemove}
                                  displayValue="name"
                                  groupBy="type"
                                  className="input-control multiselect"
                                  disable={getData.paymentType !== "UnPaid"}
                                />
                              ) : (
                                <p>...</p>
                              )}
                              <span className="error">{error?.service}</span>
                            </Form.Group>
                          </Col>

                          <Col xs={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Payment Type</Form.Label>
                              <Select
                                options={filteredPaymentOptions}
                                defaultValue={getData.paymentType}
                                value={selectedPaymentOption}
                                onChange={handlePaymentSelect}
                                className="basic-multi-select"
                                isDisabled={getData.paymentType !== "UnPaid"}
                                classNamePrefix="select"
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={12} className="mb-3 mb-xl-0">
                            <Form.Group className="mb-3 privacypolicy">
                              <input
                                type="checkbox"
                                id="showDateCheck"
                                checked={!showDate === true}
                                value={showDate}
                                onChange={specialTime}
                                name="example1"
                                disabled={getData.paymentType !== "UnPaid"}
                              />

                              <label htmlFor="showDateCheck">
                                <span>
                                  {" "}
                                  Do you want to make special schedule
                                </span>
                              </label>
                            </Form.Group>
                          </Col>
                          {getData.paymentType !== "UnPaid" ? (
                            <Col xs={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Total Price</Form.Label>
                                <Form.Control
                                  type="number"
                                  pattern="[0-9]*"
                                  placeholder="Enter price"
                                  name="price"
                                  value={price}
                                  disabled={true}
                                  onChange={(e) => setPrice(e.target.value)}
                                />

                                <span className="error">
                                  {error?.servicePrice}
                                </span>
                              </Form.Group>
                            </Col>
                          ) : selectedPaymentOption?.value !== "UnPaid" ? (
                            <Col xs={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Total Price</Form.Label>
                                <Form.Control
                                  type="number"
                                  pattern="[0-9]*"
                                  placeholder="Enter price"
                                  name="price"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                />

                                <span className="error">
                                  {error?.servicePrice}
                                </span>
                              </Form.Group>
                            </Col>
                          ) : (
                            ""
                          )}
                          {showDate ? (
                            getData?.show == false ? (
                              <Col xs={12}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Time & Date</Form.Label>
                                  <div className="selecttime-field">
                                    <ScheduleMeeting
                                      borderRadius={10}
                                      primaryColor="#3f5b85"
                                      eventDurationInMinutes={
                                        isClassSelected
                                          ? getClassDuration()
                                          : 30
                                      }
                                      availableTimeslots={
                                        isClassSelected
                                          ? filteredClassSchedule
                                          : scheduleData
                                      }
                                      onStartTimeSelect={Datepicker}
                                      startTimeListStyle="grid"
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            ) : (
                              ""
                            )
                          ) : (
                            <>
                              <Col xs={12} md={6}>
                                <Form.Group className="mb-3 inoice-field date-field">
                                  <Form.Label>Date</Form.Label>
                                  <DatePicker
                                    value={
                                      !showIncomingDate
                                        ? Dateselect
                                          ? Dateselect
                                          : ""
                                        : ""
                                    }
                                    onChange={(date) => handleEditDate(date)}
                                    dateFormat="MMMM d, yyyy"
                                    minDate={new Date()}
                                    placeholderText="Start Date"
                                  />
                                  <span className="error">
                                    {error?.Dateselect}
                                  </span>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={6}>
                                <Form.Group className="mb-3 inoice-field">
                                  <Form.Label>Start Time</Form.Label>
                                  <DatePicker
                                    value={
                                      !showIncomingTime
                                        ? selectTime
                                          ? selectTime
                                          : ""
                                        : ""
                                    }
                                    className="w-75%"
                                    onChange={(time) =>
                                      handleEditStartTime(time)
                                    }
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Time"
                                    timeFormat="hh:mm aa"
                                    use12Hours={true}
                                    filterTime={(time) =>
                                      filterOptionsEdit(time)
                                    }
                                  />

                                  <span className="error">
                                    {error?.formatDate}
                                  </span>
                                </Form.Group>
                              </Col>
                            </>
                          )}
                          <div className="submitbtn">
                            <Button
                              className="nextbtn"
                              disabled={
                                isLoading || getData?.paymentType !== "UnPaid"
                              }
                              type="submit"
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Pay ${price}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Payment Info</h5>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              paymentData={{
                name: getData?.name,
                email: getData?.email,
              }}
              phone={getData?.phoneNumber}
              service={serviceBooking}
              userId={userID}
              paymentType={selectedPaymentOption?.value}
              handlePyment={handleSubmit}
              numberOfSeats={getData?.numberOfSeats}
              totalPrice={Number(price)}
            />
          </Elements>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EditBookings;
