import React, { useEffect, useState } from "react";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { BsChevronDoubleRight } from "react-icons/bs";
import { Rings } from "react-loader-spinner";
import * as calenderService from "../../services/calenderServices";
import * as bookingService from "../../services/bookingServices";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as authServices from "../../services/authServices";
import Multiselect from "multiselect-react-dropdown";
import "./bookingForm.scss";
import moment from "moment";
import { getTokens } from "../../helper/firebase";
import Select from "react-select";
import { createNotification } from "../../helper/notification";
import { useSelector } from "react-redux";
import { ScheduleMeeting, timeSlotDifference } from "react-schedule-meeting";
import { Link } from "react-router-dom";

const SelfBooking = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [startDateTime, setStartDateTime] = useState();
  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");
  const [nameElement, setNameelement] = useState("");
  const [nameBenificialElement, setNameBenificialElement] = useState("");
  const [emailBenificialElement, setEmailBenificialElement] = useState("");
  const [selectName, setSelectName] = useState([]);
  const [emailElement, setEmailElement] = useState("");
  const [data, setData] = useState([]);
  const [serviceSetting, setServiceSetting] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState([]);
  const [Dateselect, setDateselect] = useState("");
  const [selectTime, setSelectTime] = useState("");
  const [formatDate, setFormatDate] = useState("");
  const [exist, setExist] = useState(true);
  const [inBtw, setInBtw] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("US +1");
  const [selectedBenificialCountry, setSelectedBenificialCountry] =
    useState("US +1");
  const bookingoptions = [
    { value: "self", label: "Self" },
    { value: "giftcertificate", label: "Gift Certificate" },
  ];
  const [benificialData, setBenificialData] = useState({
    benificialEmail: "",
    benificialName: "",
    benificialPhone: "",
  });

  const paymentoptions = [
    { value: "UnPaid", label: "UNPAID" },
    { value: "Paid", label: "PAID" },
    { value: "GooglePay", label: "Google pay" },
    { value: "ApplePay", label: "Apple pay" },
    { value: "Paypal", label: "Paypal" },
    { value: "Zelle", label: "Zelle" },
    { value: "CashApp", label: "Cash App" },
    { value: "Venmo", label: "Venmo" },
    { value: "Cash", label: "Cash" },
    { value: "CreditCard", label: "Credit Card" },
  ];
  const [selectedPaymentOption, setSelectedPaymentOption] = useState();

  const [selectedOption, setSelectedOption] = useState(bookingoptions[0]);

  const getServices = async (reduxToken) => {
    const response = await bookingService.getServices(reduxToken);

    if (response?.status == 200) {
      setData(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);
    if (response?.status == 200) {
      const data1 = response?.data?.data[0]?.service;
      const serviceIds1 = data1.map((item) => item?.serviceId);
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  const getAllCountryData = async () => {
    const response = await authServices.getCountryData();

    if (response?.status === 200) {
      setCountryData(response?.data);
    }
  };

  useEffect(() => {
    getAllCountryData();
  }, []);

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    getServices(reduxToken);
  }, [reduxToken]);

  const changeName = async (input) => {
    setNameelement(input);
    if (reduxToken) {
      const response = await bookingService.searchName(input, reduxToken);
      if (response?.data?.data) {
        const name = response?.data?.data?.map((i) => ({
          id: i._id,
          name: i.name,
          email: i.email,
        }));
        setName(name);
      }
    }
  };

  const handleCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedCountry(selectedOption);
  };
  const handleBenificialCountryChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedBenificialCountry(selectedOption);
  };

  const handleChangeEmail = async (term) => {
    setEmailElement(term);
    if (reduxToken) {
      const response = await bookingService.searchName(term, reduxToken);
      if (response?.data?.data) {
        const email = response?.data?.data?.map((i) => ({
          id: i._id,
          name: i.name,
          email: i.email,
        }));
        setName(email);
      }
    }
  };

  const filterBy = () => true;

  const Item = (prop) => {
    const { data } = prop;
    return (
      <>
        <span
          style={{
            background: "skyblue",
            borderRadius: "12px",
            fontSize: "xx-small",
            padding: "inherit",
          }}
        >
          {data?.name ? data?.name : ""}
          {setCustomerName(data?.name)}
        </span>{" "}
      </>
    );
  };
  const Item2 = (prop) => {
    const { data } = prop;

    return (
      <>
        <span
          style={{
            background: "skyblue",
            borderRadius: "12px",
            fontSize: "xx-small",
            padding: "inherit",
          }}
        >
          {data?.email ? data?.email : ""}
          {setCustomerEmail(data?.email)}
        </span>{" "}
      </>
    );
  };

  const [fcmToken, setFCMToken] = useState("");
  const [tokenFound, setTokenFound] = useState("");
  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getTokens(setTokenFound);
      if (data) {
        setFCMToken(data);
      }
      return data;
    }
    tokenFunc();
  }, [setTokenFound]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // return console.log(startDateTime,formatDate,"selectedTimeselectedTimeselectedTimeselectedTime")
    let arr = [];
    items.map((val) => {
      return arr.push(val._id);
    });
    const obj = {
      name: selectName[0]?.name ? selectName[0]?.name : nameElement,
      email: emailElement[0]?.email ? emailElement[0]?.email : emailElement,
      service: arr,
      phoneNumber: phone,
      bookingType: selectedOption?.value,
      availableSlot: slotData,
      servicePrice: price,
      paymentType: selectedPaymentOption?.value,
      startDateTime: startDateTime ? startDateTime : formatDate,
      endDateTime: startDateTime ? startDateTime : formatDate,
      startDate: moment(startDateTime ? startDateTime : formatDate).format(
        "YYYY-MM-DD"
      ),
      endDate: moment(startDateTime ? startDateTime : formatDate).format(
        "YYYY-MM-DD"
      ),
      selectedCountry: selectedCountry,
      scheduleexist: isExist,
    };

    const obj1 = {
      name: selectName[0]?.name ? selectName[0]?.name : nameElement,
      email: emailElement[0]?.email ? emailElement[0]?.email : emailElement,
      service: arr,
      phoneNumber: phone,
      bookingType: selectedOption?.value,
      benificialName: benificialData?.benificialName,
      benificialEmail: benificialData?.benificialEmail,
      benificialPhone: benificialData?.benificialPhone,
      paymentType: selectedPaymentOption?.value,
      servicePrice: price,
      availableSlot: slotData,
      startDateTime: startDateTime,
      endDateTime: startDateTime,
      startDate: moment(startDateTime).format("YYYY-MM-DD"),
      endDate: moment(startDateTime).format("YYYY-MM-DD"),
      selectedBenificialCountry: selectedBenificialCountry,
      selectedCountry: selectedCountry,
      scheduleexist: isExist,

    };
    const Validation = () => {
      let err = {};
      let isValid = true;
      let phoneNo = /^\d{10,15}$/;
      let num2 = /^\d+(\.\d+)?$/;
      let regex = new RegExp(
        /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
      );

      if (!obj.name) {
        err["name"] = "Customer name required";
        isValid = false;
      } else if (obj.name.trim() === "") {
        err["name"] = "Customer name required";
        isValid = false;
      }
      if (!obj.startDateTime) {
        err["startDateTime"] = "Schedule time is required";
        isValid = false;
      }
      if (showDate == false) {
        if (!Dateselect) {
          err["Dateselect"] = "Date is required";
          isValid = false;
        }
        if (!formatDate) {
          err["formatDate"] = "Time is required";
          isValid = false;
        }
      }
      if (!obj.paymentType) {
        err["paymentType"] = "Payment type is required";
        isValid = false;
      }

      if (selectedOption?.value === "giftcertificate") {
        if (!obj1.benificialName.trim()) {
          err["benificialName"] = "Benificial name  required";
          isValid = false;
        }
      }

      if (!obj.email) {
        isValid = false;
        err["email"] = "Email is required";
      } else if (obj.email.length == 0) {
        isValid = false;
        err["email"] = "Email is required";
      } else if (obj.email.trim() === "") {
        isValid = false;
        err["email"] = "Email is required";
      } else if (!regex.test(obj.email)) {
        isValid = false;
        err["email"] = "Please enter a valid email address";
      }

      if (selectedOption?.value === "giftcertificate") {
        if (!obj1.benificialEmail.trim()) {
          isValid = false;
          err["benificialEmail"] = "Benificial email is required";
        } else if (!regex.test(obj1.benificialEmail)) {
          isValid = false;
          err["benificialEmail"] =
            "Please enter a valid benificial email address";
        } else if (obj1.benificialEmail.trim() === obj.email.trim()) {
          isValid = false;
          err["benificialEmail"] =
            "Please enter different benificial email address";
        }
      }

      if (selectedPaymentOption?.value === "Paid") {
        if (!obj.servicePrice.trim()) {
          isValid = false;
          err["servicePrice"] = "Price is required";
        } else if (obj.servicePrice.trim() == 0) {
          err["servicePrice"] = "Price shoud be greater than 0";
          isValid = false;
        } else if (!obj.servicePrice.trim().match(num2)) {
          err["servicePrice"] = "Please enter the valid price";
          isValid = false;
        }
      }

      if (!obj.phoneNumber && !obj.selectedCountry) {
        isValid = false;
        err["phone"] = "Phone number and country code required";
      } else if (!obj.phoneNumber) {
        isValid = false;
        err["phone"] = "Phone number required";
      } else if (!obj.selectedCountry) {
        isValid = false;
        err["phone"] = "Country code required";
      } else if (!phoneNo.test(obj.phoneNumber.replace(/-/g, ""))) {
        isValid = false;
        err["phone"] = "Phone number must be of 10-12 digits";
      }

      if (selectedOption?.value === "giftcertificate") {
        if (!obj1.benificialPhone && !obj1.selectedBenificialCountry) {
          isValid = false;
          err["benificialPhone"] =
            "Benificial phone number and country code is required";
        } else if (!obj1.benificialPhone || obj1.benificialPhone.length == 0) {
          isValid = false;
          err["benificialPhone"] = "Benificial phone number required";
        } else if (!obj1.selectedBenificialCountry) {
          isValid = false;
          err["benificialPhone"] = "Country code required";
        } else if (!phoneNo.test(obj1.benificialPhone.replace(/-/g, ""))) {
          isValid = false;
          err["benificialPhone"] =
            "Benificial Phone number must be of 10-12 digits";
        }
      }

      if (obj?.service?.length <= 0) {
        err["service"] = "Services is required";
        isValid = false;
      }

      setError(err);
      return isValid;
    };
    if (Validation()) {
      if (reduxToken) {
        setIsLoading(true);
        const response = await bookingService.createBooking(
          selectedOption?.value == "self" ? obj : obj1,
          reduxToken
        );

        if (response.status == 200) {
          createNotification("success", response?.data?.message);
          setTimeout(() => {
            setIsLoading(false);
            navigate("/booking");
          }, 3000);
        } else if (response.response == "Request failed with status code 500") {
          createNotification("error", "Something went wrong");
          setIsLoading(false);
        } 
        else if (response?.status == 400) {
          createNotification("error", "Schedule is already booked");
          setIsLoading(false);
        }else {
          console.log(":::error");
          setIsLoading(false);
        }
      }
    }
  };
  const handleSelect = (selectedList, index) => {
    setItems(selectedList);
  };

  const handleRemove = (selectedList) => {
    setItems(selectedList);
  };

  const emailFunc = async () => {
    const res = await bookingService.getCustomerDetails(emailElement[0]?.email);
    let response = res?.data?.data;
    if (selectName.length == 0 && emailElement.length == 0) {
      setNameelement("");
    }
    if (res?.data?.code == 200) {
      setPhone(response[0]?.phoneNumber ? response[0]?.phoneNumber : phone);
    } else {
      console.log("error:");
    }
  };

  useEffect(() => {
    if (emailElement) {
      emailFunc();
    }
  }, [emailElement, selectName]);

  const nameFun = async () => {
    const resp = await bookingService.searchEmailWithName(selectName);
    let response = resp?.data?.data;
    let arr = [];
    if (response?.length > 0) {
      response.map((data) => arr.push(data));
    }
    if (arr) {
      setEmail(arr);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBenificialData(() => {
      return {
        ...benificialData,
        [name]: value,
      };
    });
  };

  const handleChangePhone = (e) => {
    const { name, value } = e.target;
    let formattedNumber = value.replace(/[^0-9]/g, "");

    if (name === "benificialPhone") {
      if (formattedNumber.length > 12) {
        formattedNumber = formattedNumber.slice(0, 12);
      }
      if (formattedNumber.length >= 10) {
        const firstThreeDigits = formattedNumber.slice(0, 3);
        const nextThreeDigits = formattedNumber.slice(3, 6);
        const remainingDigits = formattedNumber.slice(6);

        const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;

        setBenificialData((prevData) => {
          return {
            ...prevData,
            [name]: formattedPhoneNumber,
          };
        });
      } else {
        setBenificialData((prevData) => {
          return {
            ...prevData,
            [name]: formattedNumber,
          };
        });
      }
    }
  };
  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;
    let sanitizedValue = inputValue.replace(/[^0-9]/g, "");
    if (sanitizedValue.length >= 10) {
      if (sanitizedValue.length > 12) {
        sanitizedValue = sanitizedValue.slice(0, 12);
      }
      const firstThreeDigits = sanitizedValue.slice(0, 3);
      const nextThreeDigits = sanitizedValue.slice(3, 6);
      const remainingDigits = sanitizedValue.slice(6);

      const formattedPhoneNumber = `${firstThreeDigits}-${nextThreeDigits}-${remainingDigits}`;
      setPhone(formattedPhoneNumber);
    } else {
      setPhone(sanitizedValue);
    }
  };
  const filterOptionsEdit = (time ) => {
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
  useEffect(() => {
    nameFun();
  }, [selectName]);

  useEffect(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
  }, []);

  useEffect(() => {
    getSchedule();
  }, [reduxToken]);

  const getSchedule = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await calenderService.getBookingSchedule(reduxToken);
      if (response?.status == 200) {
        let data1 = response?.data?.data[0]?.scheduledData;
        const currentDate = new Date();
        const filteredArray = data1?.filter((obj) => {
          const startDate = new Date(obj.startDate);
          const startOfCurrentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          return startDate >= startOfCurrentDate;
        });
        setSchedule(
          filteredArray && filteredArray?.length > 0 ? filteredArray : ""
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };
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
  const handleEditDate = (date) => {
    setSelectTime("")
    setStartDateTime();
    const date1 = moment(date).format("ll");
    setDateselect(date1);
  };
  const handleEditStartTime = (time1) => {
    const time = moment(time1).format("hh:mm:A");
    setSelectTime(time);
    if (Dateselect != "") {
      const mergedDateTime = moment(`${Dateselect} ${time}`, "ll hh:mm:A");
      const mergedDateTimeString = mergedDateTime.format(
        "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
      );
      setFormatDate(mergedDateTimeString);
    }
  };

  const endTime = new Date(startDateTime ? startDateTime : formatDate);
  endTime.setMinutes(endTime.getMinutes() + 30);

  const unavailableTimeSlots = [
    {
      startTime: startDateTime ? startDateTime : formatDate,
      endTime: endTime,
    },
  ];

  let formattedArray = [];

  const formattedTimeSlots = unavailableTimeSlots.map((slot) => ({
    startTime: moment(slot.startTime).format("DD MMM YYYY hh:mm:A"),
    endTime: moment(slot.endTime).format("DD MMM YYYY hh:mm:A"),
  }));

  const updatedFormattedTimeSlots = formattedTimeSlots.map((slot) => ({
    startTime: moment(slot.startTime).format("DD MMM YYYY hh:mm:A"),
    endTime: moment(slot.endTime).format("DD MMM YYYY hh:mm:A"),
  }));

  //   function isTimeSlotExist(updatedFormattedTimeSlots, testArray) {
  //     for (let i = 0; i < updatedFormattedTimeSlots.length; i++) {
  //         const updatedStartTime = new Date(updatedFormattedTimeSlots[i].startTime).getTime();
  //         const updatedEndTime = new Date(updatedFormattedTimeSlots[i].endTime).getTime();

  //         for (let j = 0; j < testArray.length; j++) {
  //             const testStartTime = new Date(testArray[j].startTime).getTime();
  //             const testEndTime = new Date(testArray[j].endTime).getTime();

  //             // Check if there is any overlap
  //             if (
  //                 (updatedStartTime >= testStartTime && updatedStartTime <= testEndTime) ||
  //                 (updatedEndTime >= testStartTime && updatedEndTime <= testEndTime)
  //             ) {
  //                 return true; // Overlapping time slot found
  //             }
  //         }
  //     }

  //     return false; // No overlapping time slot found
  // }

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
  console.log(isExist,"bbbbbbbbbbbbbbbbbbbbbbbbb")
  // setInBtw(isExist)
  // console.log(inBtw , "LLLLLLLLLLLLLLLLJJJJJJJJJJJJJJJJJ")

  const availableTimeSlotsLessUnavailableTimeSlots = timeSlotDifference(
    test(),
    formattedTimeSlots
  );
  const slotData = [];
  const newSchedule =
    availableTimeSlotsLessUnavailableTimeSlots.length > 0
      ? availableTimeSlotsLessUnavailableTimeSlots?.map((item) => {
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
  const bokkingSchedule =
    schedule?.length > 0
      ? schedule?.map((item, id) => {
          let min = item?.startTime?.split(":");
          let min1 = item?.endTime?.split(":");
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
  const handleTimeslotClicked = (startTimeEventEmit) => {
    const selectedTime = moment(startTimeEventEmit.startTime).format(
      "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
    );
    setStartDateTime(selectedTime);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setNameBenificialElement("");
    setEmailBenificialElement("");
  };
  const handlePaymentSelect = (selectedPaymentOption) => {
    setSelectedPaymentOption(selectedPaymentOption);
  };
  const countryDatafunction = () => {
    const countryCode = Object.entries(countryData).map((country) => {
      return (
        <>
          <option key={country} value={country}>
            {country}
          </option>
        </>
      );
    });
    return countryCode;
  };

  const specialTime = () => {
    setDateselect("");
    setStartDateTime("");
    setSelectTime("");
    setFormatDate("");
    setShowDate(!showDate);
    setError([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showDate, setShowDate] = useState(true);
  const handlesetservice  =  () =>{
    navigate("/setting")
    localStorage.setItem("settingbar", "2");
  }
  return (
    <>
      <div className="form-wrapper addbooking">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
                <Form.Label>Add/Search Customer Name</Form.Label>
                <AsyncTypeahead
                  {...customerName}
                  filterBy={filterBy}
                  id="selections-example"
                  className="topbar-search"
                  isLoading={isLoading}
                  labelKey="name"
                  minLength={1}
                  onChange={(term) => {
                    setEmailElement(term);
                    setSelectName(term);
                    setEmail(term);
                  }}
                  onInputChange={changeName}
                  options={name}
                  selected={selectName ? selectName : ""}
                  placeholder="Search ..."
                  renderMenuItemChildren={(option, props) => (
                    <React.Fragment>
                      <Item data={option} />
                    </React.Fragment>
                  )}
                />
                <span className="error"> {error?.name} </span>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
                <Form.Label>Add / Get Email ID</Form.Label>
                <AsyncTypeahead
                  {...customerEmail}
                  filterBy={filterBy}
                  id="selections-example"
                  className="topbar-search"
                  isLoading={isLoading}
                  labelKey="email"
                  minLength={1}
                  onChange={(term) => {
                    setEmailElement(term);
                    setSelectName(term);
                    setEmail(term);
                  }}
                  onInputChange={handleChangeEmail}
                  options={name}
                  selected={selectName ? selectName : ""}
                  placeholder="Search ..."
                  renderMenuItemChildren={(option, props) => (
                    <React.Fragment>
                      <Item2 data={option} />
                    </React.Fragment>
                  )}
                />
                <span className="error">{error?.email}</span>
              </Form.Group>
            </Col>

            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <div className="selectinput-field">
                  <Form.Select
                    name="state"
                    onChange={handleCountryChange}
                    value={selectedCountry}
                  >
                    <option value="US,+1">US +1</option>
                    {countryDatafunction()}
                  </Form.Select>

                  <Form.Control
                    type="text"
                    placeholder="Add Phone Number"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <span className="error">{error?.phone}</span>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
                <Form.Label>Select Booking Type</Form.Label>
                <div className="bktype-form">
                  <Select
                    options={bookingoptions}
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              </Form.Group>
            </Col>
            {selectedOption?.value === "giftcertificate" ? (
              <>
                <Col xs={12} md={6} className="mb-3 mb-xl-0">
                  <Form.Group className="mb-3">
                    <Form.Label>Benificial Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Benificial Name"
                      name="benificialName"
                      value={benificialData?.benificialName}
                      onChange={handleChange}
                    />
                    <span className="error"> {error?.benificialName} </span>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Benificial Email ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Benificial Email Address"
                      name="benificialEmail"
                      value={benificialData?.benificialEmail}
                      onChange={handleChange}
                    />
                    <span className="error">{error?.benificialEmail}</span>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3 mb-xl-0">
                  <Form.Group className="mb-3">
                    <Form.Label>Benificial Phone Number</Form.Label>
                    <div className="selectinput-field">
                      <Form.Select
                        name="state"
                        onChange={handleBenificialCountryChange}
                        value={selectedBenificialCountry}
                      >
                        <option value="US,+1">US +1</option>
                        {countryDatafunction()}
                      </Form.Select>
                      <Form.Control
                        type="text"
                        placeholder="Enter Phone Number"
                        name="benificialPhone"
                        value={benificialData?.benificialPhone}
                        onChange={handleChangePhone}
                      />
                    </div>

                    <span className="error">{error?.benificialPhone}</span>
                  </Form.Group>
                </Col>
              </>
            ) : (
              ""
            )}
            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
              <Form.Label className="d-flex items-center justify-content-between">
                  Service
                 <button onClick={handlesetservice} className="btn-link">Click here to add services</button> 
                </Form.Label>
                <Multiselect
                  options={serviceSetting?.length > 0 ? serviceSetting : []}
                  selectedValues={items}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  displayValue="service"
                  className="input-control multiselect"
                  name="genres"
                />
                <span className="error">{error?.service}</span>
              </Form.Group>
            </Col>

            <Col xs={12} md={6} className="mb-3 mb-xl-0">
              <Form.Group className="mb-3">
                <Form.Label>Payment Type</Form.Label>
                <Select
                  options={paymentoptions}
                  value={selectedPaymentOption}
                  onChange={handlePaymentSelect}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <span className="error">{error?.paymentType}</span>
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
                />

                <label htmlFor="showDateCheck">
                  <span>  Do you want to make special schedule</span>
                </label>
              </Form.Group>
            </Col>

            {selectedPaymentOption?.value == "Paid" ? (
              <Col xs={12} md={6} className="mb-3 mb-xl-0">
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

                  <span className="error">{error?.servicePrice}</span>
                </Form.Group>
              </Col>
            ) : (
              ""
            )}
            {showDate ? (
              <Col xs={12}>
                <Form.Group className="mb-3">
                  {schedule?.length > 0 ? (
                    <>
                      <Form.Label>Time & Date</Form.Label>
                      <div className="selecttime-field">
                        <ScheduleMeeting
                          borderRadius={15}
                          primaryColor="#3f5b85"
                          eventDurationInMinutes={30}
                          availableTimeslots={bokkingSchedule}
                          onStartTimeSelect={handleTimeslotClicked}
                          startTimeListStyle="grid"
                        />
                      </div>
                      <span className="error">{error?.startDateTime}</span>
                    </>
                  ) : (
                    "No schedule available"
                  )}
                </Form.Group>
              </Col>
            ) : (
              <>
                <Col xs={12} md={6} className="mb-3 mb-xl-0">
                <Form.Group className="mb-3 inoice-field date-field">
                  <Form.Label>Date</Form.Label>
                        <DatePicker
                          value={Dateselect}
                          onChange={(date) => handleEditDate(date)}
                          dateFormat="MMMM d, yyyy"
                          minDate={new Date()}
                          placeholderText="Start Date"
                        />
                      <span className="error">{error?.Dateselect}</span>
                  
                </Form.Group>
                </Col>
                <Col xs={12} md={6} className="mb-3 mb-xl-0">
                <Form.Group className="mb-3 inoice-field">
                  <Form.Label>Start Time</Form.Label>

                  <DatePicker
                    value={selectTime}
                    className="w-75%"
                    onChange={(time) => handleEditStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    timeFormat="hh:mm aa"
                    use12Hours={true}
                    filterTime={(time) => filterOptionsEdit(time)}
                  />
                  <span className="error">{error?.formatDate}</span>
                </Form.Group>
                </Col>
              </>
            )}
            <div className="submitbtn">
              <Button
                className="nextbtn"
                disabled={isLoading ? true : false}
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
    </>
  );
};
export default SelfBooking;
