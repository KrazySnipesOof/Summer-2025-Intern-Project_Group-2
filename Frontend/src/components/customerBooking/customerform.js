import React, { useState, useEffect, useMemo } from "react";
import "./customerForm.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Customloader from "../../helper/customLoader";
import Modal from "react-bootstrap/Modal";
import LinkExpired from "../../pages/linkExpired";
import CheckoutForm from "./checkoutForm";
import "react-datepicker/dist/react-datepicker.css";
import { timeSlotDifference } from "react-schedule-meeting";
import { Form, Button } from "react-bootstrap";
import { Rings } from "react-loader-spinner";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useSelector } from "react-redux";
import Multiselect from "multiselect-react-dropdown";
import moment from "moment";
import { createNotification } from "../../helper/notification";
import * as bookingService from "../../services/bookingServices";
import * as calenderService from "../../services/calenderServices";
import { useParams } from "react-router-dom";
import { postEncryptedData } from "../../services/userServices";
import { getUserServicesById } from "../../services/businessServices";
import { ToastContainer } from "react-toastify";
import { getTokens } from "../../helper/firebase";
import { FaShoppingCart } from "react-icons/fa";
import ConfirmBooking from "./confirmBooking";
import ScheduleCalendar from "../scheduleCalendar";
import Cart from "./cart";
import Select from "react-select";
import Store from "./store";
import { useDebouncedCallback } from "use-debounce";

const imgUrl = process.env.REACT_APP_IMAGE_URL;

const CustomerForm = () => {
  const [fcmToken, setFCMToken] = useState("");
  const [dbToken, setDbToken] = useState("");
  const [customizeData, setCustomizeData] = useState();
  const queryParams = new URLSearchParams(window.location.search);
  const term = queryParams.get("userId");
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [viewToShow, setViewToShow] = useState("book");
  const [cartProducts, setCartProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [classOccurenceId, setClassOccurenceId] = useState();
  const [availableSeats, setAvailableSeats] = useState(1);
  const [isClassSelected, setIsClassSelected] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState({
    value: "UnPaid",
    label: "Offline",
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [options, setOptions] = useState([]);
  const [startDateTime, setStartDateTime] = useState();
  const [serviceSetting, setServiceSetting] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState([]);
  const [items, setItems] = useState([]);
  const [activestatus, setActivestatus] = useState(false);
  const [deletedstatus, setDeletedstatus] = useState(false);

  const userCountry = new Intl.DateTimeFormat("en", {
    timeZoneName: "long",
  }).resolvedOptions().timeZone;

  const [paymentData, setPaymentData] = useState({
    name: "",
    email: "",
  });

  const [customloading, setCustomLoding] = useState(true);
  const [stripeData, setStripeData] = useState({
    secretKey: "",
    publicKey: "",
  });

  const [publicKey, setPublicKey] = useState("");
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(publicKey)
  );

  // const [clientSecret, setClientSecret] = useState("");

  const Onlinepaymentoptions = [
    customizeData?.Paymentonline === "true" &&
    stripeData.publicKey &&
    stripeData.secretKey
      ? { value: "Paid", label: "Online" }
      : null,
    customizeData?.Paymentoffline === "true"
      ? { value: "UnPaid", label: "Offline" }
      : null,
  ].filter((option) => option !== null);

  const getUser = async () => {
    const userId = term;
    const response = await bookingService.getExternalUser(userId);
    setActivestatus(response?.data.isActivateAccount);
    setDeletedstatus(response?.data.isDeleted);
    if (response.success == true) {
      localStorage.setItem("userId", term);
      setStripeData({
        secretKey: response.data.secretKey,
        publicKey: response.data.publicKey,
      });
      setPublicKey(response?.data?.publicKey);
      setFCMToken(response?.data?.fcmToken);
    } else {
      console.log("error");
    }
  };

  const getProducts = async () => {
    const response = await bookingService.getExternalInventory(term);
    if (response?.status == 200) {
      setAllProducts(response?.data?.data?.[0]?.data);
    } else {
      console.log("Error fetching products");
    }
  };

  const getClassess = async () => {
    const response = await bookingService.getExternalClasses(term);
    if (response?.status == 200) {
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
      console.log("Error fetching classes");
    }
  };

  const toggleView = (view) => {
    const url = new URL(window.location);
    url.searchParams.set("view", view);

    window.history.pushState({}, "", url.toString());
    setViewToShow(view);
  };

  useEffect(() => {
    const view = queryParams.get("view");
    if (view) {
      setViewToShow(view);
    }
    const handlePopState = () => {
      setViewToShow(window.location.search.split("=")[1]);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [viewToShow]);

  useEffect(() => {
    getUser();
    getProducts();
    getClassess();
  }, [reduxToken]);

  useEffect(() => {
    setStripePromise(loadStripe(publicKey));
  }, [publicKey]);

  const validateForm = () => {
    let isValid = true;
    let err = {};
    let regex = new RegExp(
      /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
    );
    let arr = [];
    items.map((val) => {
      return arr.push(val._id);
    });
    const obj = {
      name: name,
      email: email,
      service: arr,
      startDateTime: startDateTime,
    };

    if (!obj.name || obj.name.trim().length === 0) {
      err["name"] = "Customer Name required";
      isValid = false;
    }
    if (!obj.email || obj.email.trim().length === 0) {
      err["email"] = "Email is required";
      isValid = false;
    } else if (!regex.test(obj.email)) {
      err["email"] = "Please enter a valid email address";
      isValid = false;
    }
    if (Onlinepaymentoptions.length > 1) {
      if (!selectedPaymentOption) {
        err["paymentType"] = "Payment type is required";
        isValid = false;
      }
    }
    if (obj?.service?.length <= 0 && cartProducts?.length <= 0) {
      err["service"] = "Service required";
      isValid = false;
    }
    if (obj?.service?.length > 0 && !obj.startDateTime) {
      err["startDateTime"] = "Schedule time is required";
      isValid = false;
    }
    setError(err);
    return isValid;
  };

  const handleSubmitPyment = async (paymentPrice) => {
    let serviceArray = [];
    let classesArray = [];
    items.map((val) => {
      if (val.type === "Services") {
        serviceArray.push(val._id);
      }
      if (val.type === "Classes") {
        classesArray.push(val._id);
      }
    });
    const productsIdAndQuantityArray = cartProducts.map((item) => ({
      productId: item?.product?._id,
      price: item?.product?.price,
      quantity: item?.quantity,
    }));
    const obj = {
      name: name,
      email: email,
      service: serviceArray,
      classes: classesArray,
      numberOfSeats: numberOfSeats,
      classOccurenceId: classOccurenceId,
      products: productsIdAndQuantityArray,
      phoneNumber: phone ?? null,
      userId: term,
      servicePrice: paymentPrice ?? null,
      token: matchedToken ? matchedToken : "",
      serviceType: isClassSelected ? "Class" : "Service",
      paymentType: selectedPaymentOption?.value,
      availableSlot: slotData,
      startDateTime: startDateTime,
      bookingType: "self", // self or giftcertificate
      endDateTime: startDateTime,
      startDate: startDateTime,
      endDate: startDateTime,
      selectedCountry: selectedCountry,
      scheduleexist: true,
    };

    if (validateForm()) {
      localStorage.setItem("Id", term);
      setIsLoading(true);
      let response;
      try {
        if (serviceArray?.length > 0 || classesArray?.length > 0) {
          response = await bookingService?.createExternalBooking(obj);
        } else if (cartProducts?.length > 0) {
          response = await bookingService?.createExternalProducts(obj);
        } else {
          createNotification("error", "Please select service");
          setIsLoading(false);
          return;
        }
        if (response?.status == 200) {
          createNotification("success", response?.data?.message);
          // setClientSecret(response?.data?.clientSecret);
        } else if (response?.status == 400) {
          createNotification("warning", "Link is expired");
          console.error("Error:", response);
          setActivestatus(true);
        } else {
          createNotification("error", response?.response);
          console.error("Error:", response?.response);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        if (response?.status == 200) {
          setTimeout(() => {
            setIsLoading(false);
            window.location.reload(false);
          }, 3000);
        } else {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getTokens();
      if (data) {
        setDbToken(data);
      }
      return data;
    }
    tokenFunc();
    const url = new URL(window.location);
    if (url.searchParams.has("view")) {
      url.searchParams.delete("view");
      window.history.replaceState({}, "", url.toString());
      setViewToShow("book");
    }
  }, []);

  let matchedToken = null;

  for (const token of fcmToken) {
    if (token === dbToken) {
      matchedToken = token;
      break;
    }
  }

  const { id } = useParams();

  const postEncryptedValue = async (encryptedData) => {
    const resp = await postEncryptedData(encryptedData);
    if (resp.status == 200) {
      if (resp?.data) {
        const resp2 = await getUserServicesById(resp.data);
        let arr = [];
        if (resp2.status == 200) {
          resp2.data.data.map((data) => arr.push(data));
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      postEncryptedValue(id);
    }
  }, [id]);

  const handleSelect = (selectedList, selectedItem) => {
    if (selectedItem?.type === "Classes") {
      setItems([selectedItem]);
      setIsClassSelected(true);
      setNumberOfSeats(1);
      setAvailableSeats(selectedItem?.occurrences[0]?.seats?.availableSeats);
    } else {
      const filteredList = selectedList.filter((i) => i.type !== "Classes");
      setItems(filteredList);
      setIsClassSelected(false);
    }
  };

  const handleRemove = (selectedList) => {
    setItems(selectedList);
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const filterBy = () => true;

  useEffect(() => {
    getSchedule();
  }, [reduxToken]);

  const getSchedule = async () => {
    const obj = { userId: term };
    setIsLoading(true);
    const response = await calenderService.getExternalSchedule(obj);
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
  };

  const getServicesSetting = async () => {
    const obj = { userId: term };
    const response = await bookingService.getExternalServicesSetting(obj);
    if (response.status == 200 && response.data?.data.length > 0) {
      const data1 = response?.data?.data[0]?.service;
      const serviceIds1 =
        data1 && data1?.length > 0 && data1?.map((item) => item?.serviceId);
      setServiceSetting(serviceIds1);
    } else {
      console.log("error");
    }
  };

  const getCustomizationData = async () => {
    setCustomLoding(true);
    const obj = { userId: term };
    const response = await bookingService.customizeData(obj);
    if (response?.status == 200 && response?.data?.data?.length > 0) {
      setCustomizeData(response.data?.data[0]);
      setCustomLoding(false);
      setSelectedPaymentOption(
        response?.data?.data[0]?.Paymentoffline === "true"
          ? {
              value: "UnPaid",
              label: "Offline",
            }
          : { value: "Paid", label: "Online" }
      );
    } else {
      console.log("error");
      setCustomLoding(false);
    }
  };
  useEffect(() => {
    getCustomizationData();
  }, []);
  useEffect(() => {
    getServicesSetting();
  }, [reduxToken]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--customer-theme",
      customizeData?.Theme || "#1C5141"
    );
  }, [customizeData?.Theme]);

  const bookingTypeOption = useMemo(() => {
    let options = [];
    if (serviceSetting?.length > 0) {
      options = serviceSetting.map((item) => ({
        _id: item?._id,
        name: item?.service,
        price: item?.price,
        serviceTime: item?.serviceTime,
        type: "Services",
      }));
    }
    if (classes?.length > 0) {
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
  }, [serviceSetting, classes]);

  const filteredOptions = useMemo(() => {
    if (isClassSelected && items?.length > 0) {
      return bookingTypeOption.filter(
        (option) => option?._id !== items[0]?._id
      );
    }
    return bookingTypeOption;
  }, [isClassSelected, items, bookingTypeOption]);

  const test = () => {
    if (!schedule?.length) return [];

    return schedule.map((item) => {
      const startDateTime = moment(
        `${item.startDate} ${item.startTime}`,
        "MMM DD, YYYY hh:mm:A"
      );
      const endDateTime = moment(
        `${item.startDate} ${item.endTime}`,
        "MMM DD, YYYY hh:mm:A"
      );

      return {
        startTime: startDateTime.isValid() ? startDateTime.toISOString() : null,
        endTime: endDateTime.isValid() ? endDateTime.toISOString() : null,
      };
    });
  };

  const formattedTimeSlots = () => {
    let timeSlots = [];
    const currentDate = moment(
      startDateTime,
      "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
    ).toISOString();
    const endScheduleTime = moment(
      startDateTime,
      "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
    )
      .add(30, "minutes")
      .toISOString();
    const dt = { startTime: currentDate, endTime: endScheduleTime };
    timeSlots.push(dt);
    return timeSlots;
  };

  const availableTimeSlotsLessUnavailableTimeSlots = timeSlotDifference(
    test(),
    formattedTimeSlots()
  );

  const slotData =
    availableTimeSlotsLessUnavailableTimeSlots?.length >= 1
      ? availableTimeSlotsLessUnavailableTimeSlots.map((item) => {
          const startMoment = moment(item?.startTime);
          const endMoment = moment(item?.endTime);

          const startDate = startMoment.format("MMM D, YYYY");
          const startTime = startMoment.format("hh:mm A");
          const endTime = endMoment.format("hh:mm A");

          return { startDate, startTime, endTime };
        })
      : [];

  const scheduleData =
    schedule?.length > 0
      ? schedule.map((item, id) => {
          const startDate = moment(item?.startDate).format("D MMM YYYY");
          const startTime = moment(
            `${startDate} ${item.startTime}`,
            "D MMM YYYY hh:mma"
          ).toISOString();
          const endTime = moment(
            `${startDate} ${item.endTime}`,
            "D MMM YYYY hh:mma"
          ).toISOString();

          return {
            id,
            startTime: startTime,
            endTime: endTime,
          };
        })
      : "";

  const generateRecurringSlots = (item) => {
    const slots = [];
    const startDate = moment(item?.date);
    const endDate = moment(item?.reoccurringEndDate);
    const recurrence = item?.reoccurringDays?.toLowerCase();

    let current = startDate.clone();

    while (current.isSameOrBefore(endDate, "day")) {
      const formattedDate = current.format("D MMM YYYY");

      const slot = {
        id: `${item?._id}-${slots.length}`, // unique ID
        startTime: moment(
          `${formattedDate} ${item.startTime}`,
          "D MMM YYYY hh:mma"
        ).toISOString(),
        endTime: moment(
          `${formattedDate} ${item.endTime}`,
          "D MMM YYYY hh:mma"
        ).toISOString(),
      };

      slots.push(slot);

      if (recurrence === "daily") {
        current.add(1, "day");
      } else if (recurrence === "weekly") {
        current.add(1, "week");
      } else if (recurrence === "monthly") {
        current.add(1, "month");
      } else {
        break;
      }
    }

    return slots;
  };

  const filteredClassSchedule = useMemo(() => {
    if (!classes || !isClassSelected) return [];

    const selectedClass = classes?.find((cls) => cls._id === items[0]?._id);
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
  }, [classes, isClassSelected, items]);

  const getClassDuration = () => {
    const selectedClass = classes?.find((cls) => cls._id === items[0]?._id);
    return moment(selectedClass?.occurrences[0]?.endTime, "hh:mma").diff(
      moment(selectedClass?.occurrences[0]?.startTime, "hh:mma"),
      "minutes"
    );
  };

  const DatePicker = (date) => {
    const selectedTime = moment(date.startTime).format(
      "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)"
    );
    setStartDateTime(selectedTime);
  };

  const onDaySelect = (date) => {
    const classItem = items?.find((item) => item?.type === "Classes");

    if (classItem) {
      const occurrence = classItem.occurrences.find((occ) =>
        moment(occ.date).isSame(moment(date), "day")
      );

      if (occurrence) {
        setClassOccurenceId(occurrence._id);
        setAvailableSeats(occurrence.seats?.availableSeats ?? 1);
      } else {
        setClassOccurenceId(undefined);
        setAvailableSeats(1);
      }
    }
  };

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
          {data.name ? data.name : ""}
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
          {data.email ? data.email : ""}
        </span>{" "}
      </>
    );
  };

  const handleSearch = async (query) => {
    const userId = term;
    try {
      const response = await bookingService.searchExternalName(query, userId);
      if (response?.data?.data) {
        const data = response?.data?.data?.map((i) => ({
          id: i._id,
          name: i.name,
          email: i.email,
          phoneNumber: i.phoneNumber,
        }));
        setOptions(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setOptions([]);
    }
  };

  const debounced = useDebouncedCallback((value) => {
    handleSearch(value);
  }, 700);

  const handleFieldSelection = (selected) => {
    if (selected.length > 0) {
      const user = selected[0];

      if (user.customOption) {
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
        setPhone(null);
        setSelectedCountry(null);
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phoneNumber);
        setSelectedCountry(user.selectedCountry);
      }
    }
  };

  const totalCosts = useMemo(() => {
    let productCost = 0;
    let serviceCost = 0;
    let total = 0;
    for (const item of items) {
      serviceCost += item?.price;
      // if its a class, multiply by number of seats
      if (isClassSelected) {
        serviceCost = serviceCost * numberOfSeats;
      }
    }
    for (const item of cartProducts) {
      productCost += item?.product?.price * item?.quantity;
    }
    total = serviceCost + productCost;
    return { total, serviceCost, productCost };
  }, [items, cartProducts, numberOfSeats]);

  const handlePaymentSelect = (selectedPaymentOption) => {
    setSelectedPaymentOption(selectedPaymentOption);
  };

  return (
    <>
      {customloading ? (
        <Customloader />
      ) : activestatus || deletedstatus ? (
        <LinkExpired />
      ) : (
        <>
          <div className="customer-booking-wrapper">
            <div className="cb-wrap">
              <div className="cb-box">
                <div className="cb-profile">
                  <div className="logo-circle">
                    <img
                      src={`${imgUrl}/${customizeData?.logo}`}
                      className="img-fluid"
                      alt="logo"
                    />
                  </div>
                  <h2>{customizeData?.Title}</h2>
                </div>
                <div
                  className="cart"
                  onClick={() => {
                    if (validateForm()) {
                      toggleView(viewToShow === "cart" ? "book" : "cart");
                    }
                  }}
                >
                  <FaShoppingCart />
                  {(items?.length || cartProducts?.length) > 0 ? (
                    <div className="items">
                      {items?.length + cartProducts?.length}
                    </div>
                  ) : null}
                </div>
              </div>
              <ToastContainer />
              {viewToShow === "confirm" ? (
                <ConfirmBooking
                  isLoading={isLoading}
                  onEditClick={() => {
                    toggleView("book");
                  }}
                  paymentMethod={selectedPaymentOption?.value}
                  services={items}
                  startDateTime={startDateTime}
                  onConfirmClick={() => {
                    if (selectedPaymentOption?.value === "Paid") {
                      if (stripeData.publicKey && stripeData.secretKey) {
                        toggleView("cart");
                      } else if (totalCosts?.total <= 0) {
                        createNotification(
                          "error",
                          "Please select service with price  to book"
                        );
                      } else {
                        createNotification(
                          "error",
                          "Stripe/Payment data not found"
                        );
                      }
                    } else if (cartProducts?.length > 0) {
                      toggleView("cart");
                    } else {
                      handleSubmitPyment();
                    }
                  }}
                />
              ) : viewToShow === "cart" ? (
                <Cart
                  isLoading={isLoading}
                  totalCosts={totalCosts}
                  cartProducts={cartProducts}
                  paymentMethod={selectedPaymentOption?.value}
                  services={items}
                  numberOfSeats={numberOfSeats}
                  onPayNow={() => {
                    if (selectedPaymentOption?.value === "Paid") {
                      setPaymentData({
                        name: name,
                        email: email,
                      });
                      setShowModal(true);
                    } else {
                      handleSubmitPyment();
                    }
                  }}
                  onAdd={(product) => {
                    setCartProducts((prevCart) => {
                      // check if quantity doesn't exceed available productstock
                      const existingProduct = prevCart?.find(
                        (item) => item.product === product
                      );
                      const availableStock = product?.productstock;
                      const newQuantity = existingProduct?.quantity + 1 || 1;
                      if (newQuantity > availableStock) {
                        createNotification(
                          "error",
                          "Product quantity exceeds available stock"
                        );
                        return prevCart;
                      }
                      return prevCart.map((item) =>
                        item.product === product
                          ? { ...item, quantity: newQuantity }
                          : item
                      );
                    });
                  }}
                  onMinus={(product) => {
                    // check if quantity will be less than one and do nothing
                    setCartProducts((prevCart) => {
                      const existingProduct = prevCart?.find(
                        (item) => item.product === product
                      );
                      const newQuantity = existingProduct?.quantity - 1;
                      if (newQuantity < 1) {
                        return prevCart;
                      }
                      return prevCart.map((item) =>
                        item.product === product
                          ? { ...item, quantity: newQuantity }
                          : item
                      );
                    });
                  }}
                  startDateTime={startDateTime}
                />
              ) : (
                <div className="bookForm">
                  <div className="form">
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Name</Form.Label>
                      <AsyncTypeahead
                        filterBy={filterBy}
                        id="selections-example"
                        isLoading={isLoading}
                        labelKey="name"
                        minLength={1}
                        onSearch={() => {}}
                        options={options}
                        onChange={handleFieldSelection}
                        onInputChange={(text) => {
                          setName(text);
                          debounced(text);
                        }}
                        selected={name ? [{ name: name }] : []}
                        allowNew
                        placeholder="Enter Name"
                        renderMenuItemChildren={(option, props) => (
                          <React.Fragment>
                            <Item data={option} />
                          </React.Fragment>
                        )}
                        newSelectionPrefix="New user name: "
                      />
                      <span className="error"> {error?.name} </span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="label">Email</Form.Label>
                      <AsyncTypeahead
                        filterBy={filterBy}
                        id="selections-example"
                        isLoading={isLoading}
                        labelKey="email"
                        minLength={1}
                        onSearch={() => {}}
                        options={options}
                        onChange={handleFieldSelection}
                        onInputChange={(text) => {
                          setEmail(text);
                          debounced(text);
                        }}
                        selected={email ? [{ email: email }] : []}
                        allowNew
                        placeholder="Enter Email"
                        renderMenuItemChildren={(option, props) => (
                          <React.Fragment>
                            <Item2 data={option} />
                          </React.Fragment>
                        )}
                        newSelectionPrefix="New user mail: "
                      />
                      <span className="error">{error?.email}</span>
                    </Form.Group>
                    <Form.Group className="mb-3 multiselectField">
                      <Form.Label className="label">Booking Type</Form.Label>
                      <Multiselect
                        key={isClassSelected ? "single" : "multi"}
                        options={filteredOptions}
                        placeholder="Select Service or Class"
                        selectedValues={items}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        displayValue="name"
                        groupBy="type"
                        className="input-control multiselect"
                        showArrow={true}
                        singleSelect={isClassSelected}
                      />
                      <span className="error">{error?.service}</span>
                    </Form.Group>
                    {isClassSelected ? (
                      <Form.Group className="mb-3 multiselectField">
                        <Form.Label className="label">
                          Number of Class Seats
                        </Form.Label>
                        <Multiselect
                          isObject={false}
                          selectedValues={[numberOfSeats]}
                          onSelect={(selectedList) => {
                            setNumberOfSeats(selectedList[0]);
                          }}
                          options={Array.from(
                            { length: availableSeats },
                            (_, i) => i + 1,
                            1
                          )}
                          singleSelect
                          avoidHighlightFirstOption
                        />
                      </Form.Group>
                    ) : null}
                    {Onlinepaymentoptions.length > 1 ? (
                      <Form.Group className="mb-3">
                        <Form.Label className="label">Payment Type</Form.Label>
                        <Select
                          options={Onlinepaymentoptions}
                          value={selectedPaymentOption}
                          onChange={handlePaymentSelect}
                          className="field"
                          classNamePrefix="select"
                        />
                        <span className="error">{error?.paymentType}</span>
                      </Form.Group>
                    ) : null}
                  </div>
                  <div className="calendar">
                    <Form.Group className="h-100">
                      {schedule?.length > 0 || classes?.length > 0 ? (
                        <>
                          <ScheduleCalendar
                            eventDurationInMinutes={
                              isClassSelected ? getClassDuration() : 30
                            }
                            availableTimeslots={
                              isClassSelected
                                ? filteredClassSchedule
                                : scheduleData
                            }
                            onStartTimeSelect={DatePicker}
                            onDaySelect={onDaySelect}
                            filterTime={filterPassedTime}
                            selectedStartTime={moment(startDateTime).toDate()}
                            primaryColor={customizeData?.Theme}
                          />
                          <span className="error">{error?.startDateTime}</span>
                        </>
                      ) : (
                        <div className="no-schedule">
                          <h5>No schedule available</h5>
                        </div>
                      )}
                    </Form.Group>
                  </div>
                  <Button
                    className="submitBtn"
                    disabled={
                      (!schedule && !classes) || isLoading ? true : false
                    }
                    type="button"
                    onClick={() => {
                      if (validateForm()) {
                        toggleView(items.length <= 0 ? "cart" : "confirm");
                      }
                    }}
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
                      <>Continue</>
                    )}
                  </Button>
                </div>
              )}
              {allProducts?.length > 0 ? (
                <div className={`${viewToShow !== "cart" ? "" : "invisible"}`}>
                  <Store
                    storName={customizeData?.Title}
                    cartProducts={cartProducts}
                    allProducts={allProducts}
                    handleClickProduct={(product) => {
                      setCartProducts((prevCart) => {
                        const existingProduct = prevCart.find(
                          (item) => item.product === product
                        );

                        if (existingProduct) {
                          return prevCart.filter(
                            (item) => item.product !== product
                          );
                        } else {
                          return [...prevCart, { product, quantity: 1 }];
                        }
                      });
                    }}
                    goToCart={() => {
                      if (validateForm()) {
                        toggleView("cart");
                      }
                    }}
                  />
                </div>
              ) : null}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title className="text-center">
                  Pay ${totalCosts?.total}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>Payment Info</h5>
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    paymentData={paymentData}
                    selectedBenificialCountry={selectedCountry}
                    selectedCountry={selectedCountry}
                    phone={phone}
                    service={items}
                    cartProducts={cartProducts}
                    userId={term}
                    paymentType={selectedPaymentOption?.value}
                    handlePyment={handleSubmitPyment}
                    // clientSecret={clientSecret}
                    numberOfSeats={numberOfSeats}
                    totalPrice={totalCosts?.total}
                  />
                </Elements>
              </Modal.Body>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};
export default CustomerForm;
