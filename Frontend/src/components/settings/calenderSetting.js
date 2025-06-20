import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Form, Button, InputGroup } from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import * as calenderService from "../../services/calenderServices";
import * as bookingService from "../../services/bookingServices";

import { BsPlusLg } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import moment from "moment";

import { Rings } from "react-loader-spinner";
import { GetUserByID } from "../../services/userServices";

const Calendarsetting = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  let authData = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [calenderData, setCalenderData] = useState([]);
  const [error, setError] = useState([]);
  const [changeDate, setChangeDate] = useState();
  const [loader, setLoader] = useState(false);
  const [activateAccount, setActivateaccount] = useState(false);
  const [bookingList, setBookingList] = useState(false);

  
  const [userId, setUserId] = useState(authData?._id);

  const [unActivedata, setUnactivedata] = useState("");
  const currentTime = moment();
  const [formItems, setFormItems] = useState([
    {
      startDate: moment().format("MMM DD, YY"),
      startTime:
        currentTime.minute() >= 30
          ? currentTime.startOf("hour").add(1, "hour").format("hh:mm:A")
          : currentTime.startOf("hour").add(30, "minutes").format("hh:mm:A"),
      endTime: "",
      startTimeError: "",
      endTimeError: "",
    },
  ]);
  useEffect(() => {
    getSchedule();
  }, [reduxToken]);
  useEffect(() => {
    setUserId(authData?._id);
  }, [authData]);
  const getUserById = async () => {
    const allbokking = await bookingService.bookingList();
    setBookingList(allbokking.data.data[0].data)
    if (authData?._id !== undefined && authData?._id !== null) {
      const response = await GetUserByID(authData?._id);
      setUnactivedata(response?.data?.email);
      if (response?.data?.status == 0) {
        setActivateaccount(true);
      } else if (response?.data?.status == 1) {
        setActivateaccount(false);
      }
    }
  };

  useEffect(() => {
    getUserById();
    
  }, [userId]);

  const getSchedule = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await calenderService.getSchedule(reduxToken);
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

        setCalenderData(
          filteredArray && filteredArray?.length > 0 ? filteredArray : ""
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  function convertTo24HourFormat(time) {
    const [hours, minutes, period] = time?.split(":");
    const convertedHours =
      (parseInt(hours) % 12) + (period?.toLowerCase() === "pm" ? 12 : 0);
    const formattedHours = convertedHours.toString().padStart(2, "0");
    return `${formattedHours}:${minutes}:${period}`;
  }

  const handleDateChange = (index, date1) => {
    const date = moment(date1).format("ll");
    setChangeDate(date);
    const newField = [...formItems];

    if (newField[index]?.startDate == new Date().toDateString()) {
      newField[index] = {
        startDate: date,
        startTime: "",
        endTime: "",
      };
      setFormItems(newField);
    } else {
      const newFields = [...formItems];
      newFields[index] = {
        startDate: date,
        startTime: "",
        endTime: "",
      };
      setFormItems(newFields);
    }
  };

  const handleEditDate = (index, date1) => {
    const currentDate = moment().format("ll");

    const finalDate = date1 != null ? date1 : currentDate;
    const date = moment(finalDate).format("ll");
    const calenderField = [...calenderData];
    calenderField[index] = {
      startDate: date,
      startTime: "",
      endTime: "",
    };
    setCalenderData(calenderField);
  };

  const handleStartTimeChange = (index, time1) => {

    const time = moment(time1).format("hh:mm:A");

    const newFields = [...formItems];
    newFields[index].startTime = time;



    const lastCalenderField = newFields[newFields.length - 1];
        // Extracting start and end time from the lastCalenderField
        const calenderStartTime = moment(lastCalenderField.startTime, "hh:mm:A");
        const calenderEndTime = moment(lastCalenderField.endTime, "hh:mm:A");
        
        // Checking if any booking in bookingList falls within the specified range
        const isBookingWithinRange = bookingList.map((booking) => {
          // Parsing startDateTime with the correct format and including time zone
          const bookingStartTime = moment(booking.startDateTime, "ddd MMM D YYYY hh:mm:A");
        
          // Extracting only the time component
          const bookingStartTimeOnlyTime = moment(bookingStartTime.format("HH:mm"), "HH:mm");
          
          // Debugging statements
          console.log('calenderStartTime:LLLLLLL', calenderStartTime.format());
          console.log('calenderEndTime:LLLLLLL', calenderEndTime.format());
          console.log('bookingStartTime:LLLLLLL', bookingStartTimeOnlyTime.format());
          
          // Checking if the booking's start time is within the range
          return bookingStartTimeOnlyTime.isBetween(calenderStartTime, calenderEndTime, null, '[]');
        });
        
        // Checking if there's at least one booking within the range
        const anyBookingWithinRange = isBookingWithinRange.includes(true);
        console.log('anyBookingWithinRange:', anyBookingWithinRange);   


        if(newFields[
          index
        ].endTimeError == "" || newFields[
          index
        ].startTimeError == "" ){
          if(anyBookingWithinRange){
            newFields[index].startTime = "";
            newFields[index].endTime = "";
            console.log(anyBookingWithinRange, lastCalenderField,"calenderField[index].endTime")
            createNotification("error", "Selected time is already booked Please check your bookings");
          }
        
         
        }











    setFormItems(newFields);

    if (time == "11:30:PM") {
      newFields[index].startTime = "";
      newFields[index].startTimeError = `Please select time before 11:30 PM `;
      setFormItems(newFields);
    } else {
      newFields[index].startTimeError = ``;
    }

    const startDate = new Date(newFields[index].startDate);
    if (startDate > moment().toDate()) {
      const filteredData = newFields.filter((item) => {
        const itemDate = item.startDate;
        const newFilter = newFields[index].startDate;
        return itemDate == newFilter;
      });
      if (newFields[index].endTime && time) {
        const time1 = convertTo24HourFormat(time);
        const time2 = convertTo24HourFormat(newFields[index].endTime);

        if (time2 < time1) {
          newFields[index].endTime = "";
          setFormItems(newFields);
        } else {
          newFields[index].startTimeError = ``;
        }
      }

      filteredData.slice(0, -1).map((item, i) => {
        if (newFields[index].endTime || (newFields[index].startTime && time)) {
          const indexStartTime = item?.startTime
            ? convertTo24HourFormat(item?.startTime)
            : "";
          const indexEndTime = item?.endTime
            ? convertTo24HourFormat(item?.endTime)
            : "";
          const selectTime = convertTo24HourFormat(time);

          if (selectTime >= indexStartTime && selectTime <= indexEndTime) {
            newFields[index].startTime = "";
            newFields[index].startTimeError = `Select another time `;
            setFormItems(newFields);
          } else {
            newFields[index].startTimeError = ``;
          }
        } else {
          newFields[index].startTime = "";
          newFields[
            index
          ].startTimeError = `Please select different schedule time`;
          setFormItems(newFields);
        }
      });
    } else {
      if (newFields[index].startDate === moment().format("ll")) {
        const currentDate = moment().format("ll");
        const filteredData = newFields.filter((item) => {
          const itemDate = item.startDate;
          return itemDate == currentDate;
        });

        if (newFields[index].endTime && time) {
          const time1 = convertTo24HourFormat(time);

          const time2 = convertTo24HourFormat(newFields[index].endTime);

          if (time2 < time1) {
            newFields[index].endTime = "";
            setFormItems(newFields);
          } else {
            newFields[index].startTimeError = ``;
          }
        }
        filteredData.slice(0, -1).map((item, i) => {
          if (
            newFields[index].endTime ||
            (newFields[index].startTime && time)
          ) {
            const indexStartTime = item?.startTime
              ? convertTo24HourFormat(item?.startTime)
              : "";
            const indexEndTime = item?.endTime
              ? convertTo24HourFormat(item?.endTime)
              : "";
            const selectTime = convertTo24HourFormat(time);

            if (selectTime >= indexStartTime && selectTime <= indexEndTime) {
              newFields[index].startTime = "";
              newFields[index].startTimeError = `Select another time`;
              setFormItems(newFields);
            } else {
              newFields[index].startTimeError = ``;
            }
          } else {
            newFields[index].startTime = "";
            newFields[index].startTimeError = `Select another time`;
            setFormItems(newFields);
          }
        });
      }
    }
  };

  const handleEditStartTime = (index, time1) => {
    const time = moment(time1).format("hh:mm:A");
    const calenderField = [...calenderData];
    calenderField[index].startTime = time;


    const lastCalenderField = calenderField[calenderField.length - 1];
console.log(bookingList, lastCalenderField, "LLLLLLLLLLLKKKKKKKKKKKK");

// Extracting start and end time from the lastCalenderField
const calenderStartTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.startTime, "MMM D, YYYY hh:mm:A");
const calenderEndTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.endTime, "MMM D, YYYY hh:mm:A");

// Checking if any booking in bookingList falls within the specified range
const isBookingWithinRange = bookingList.map((booking) => {
  // Parsing startDateTime with the correct format and including time zone
  const bookingStartTime = moment(booking.startDateTime, "ddd MMM DD YYYY hh:mm:A ZZ");

  // Debugging statements
  console.log('calenderStartTime: LLLLLLL', calenderStartTime.format());
  console.log('calenderEndTime: LLLLLLL', calenderEndTime.format());
  console.log('bookingStartTime: LLLLLLL', bookingStartTime.format());

  // Checking if the booking's start time is within the range
  return bookingStartTime.isBetween(calenderStartTime, calenderEndTime, null, '[]');
});

// Checking if there's at least one booking within the range
const anyBookingWithinRange = isBookingWithinRange.includes(true);
console.log('anyBookingWithinRange:', anyBookingWithinRange);



    if(calenderField[
      index
    ].endTimeError == "" || calenderField[
      index
    ].startTimeError == "" ){
      if(anyBookingWithinRange){
        calenderField[index].startTime = "";
        calenderField[index].endTime = "";
        console.log(anyBookingWithinRange, lastCalenderField,"calenderField[index].endTime")
        createNotification("error", "Selected time is already booked Please check your bookings");
      }
    
     
    }








    setCalenderData(calenderField);
    if (time === "11:30:PM") {
      calenderField[index].startTime = "";
      calenderField[index].startTimeError =
        "Please select a time before 11:30 PM";
      setCalenderData(calenderField);
      return;
    } else {
      calenderField[index].startTimeError = "";
    }

    const startDate = new Date(calenderField[index].startDate);
    if (startDate > moment().toDate()) {
      const filteredData = calenderField.filter(
        (item) => item.startDate === calenderField[index].startDate
      );

      if (calenderField[index].endTime && time) {
        const time1 = convertTo24HourFormat(time);
        const time2 = convertTo24HourFormat(calenderField[index].endTime);

        if (time2 < time1) {
          calenderField[index].endTime = "";
          setCalenderData(calenderField);
        } else {
          calenderField[index].startTimeError = "";
        }
      }

      let hasOverlap = false;
      filteredData.slice(0, -1).forEach((item) => {
        const indexStartTime = item?.startTime
          ? convertTo24HourFormat(item?.startTime)
          : "";
        const indexEndTime = item?.endTime
          ? convertTo24HourFormat(item?.endTime)
          : "";
        const selectTime = convertTo24HourFormat(time);

        if (selectTime >= indexStartTime && selectTime <= indexEndTime) {
          hasOverlap = true;
        }
      });

      if (hasOverlap) {
        calenderField[index].startTime = "";
        calenderField[index].startTimeError = "Select another time";
        setCalenderData(calenderField);
      } else {
        calenderField[index].startTimeError = "";
        setCalenderData(calenderField);
      }
    } else {
      if (calenderField[index].startDate === moment().format("ll")) {
        const currentDate = moment().format("ll");
        const filteredData = calenderField.filter(
          (item) => item.startDate === currentDate
        );

        if (calenderField[index].endTime && time) {
          const time1 = convertTo24HourFormat(time);
          const time2 = convertTo24HourFormat(calenderField[index].endTime);

          if (time2 < time1) {
            calenderField[index].endTime = "";
            setCalenderData(calenderField);
          } else {
            calenderField[index].startTimeError = "";
          }
        }

        let hasOverlap = false;
        filteredData.slice(0, -1).forEach((item) => {
          const indexStartTime = item?.startTime
            ? convertTo24HourFormat(item?.startTime)
            : "";
          const indexEndTime = item?.endTime
            ? convertTo24HourFormat(item?.endTime)
            : "";
          const selectTime = convertTo24HourFormat(time);

          if (selectTime >= indexStartTime && selectTime <= indexEndTime) {
            hasOverlap = true;
          }
        });

        if (hasOverlap) {
          calenderField[index].startTime = "";
          calenderField[index].startTimeError = "Select another time";
          setCalenderData(calenderField);
        } else {
          calenderField[index].startTimeError = "";
          setCalenderData(calenderField);
        }
      }
    }







    
  };

  const handleEndTimeChange = (index, time1) => {
    console.log("handleEndTimeChangehandleEndTimeChange")
    const time = moment(time1).format("hh:mm:A");
    const newFields = [...formItems];
    const startTimeValue = newFields[index]?.startTime;
    const selectTime = convertTo24HourFormat(time);
    const prevTime = convertTo24HourFormat(startTimeValue);
    if (!startTimeValue) {
      newFields[index].endTime = "";
      newFields[index].endTimeError = `Select startTime first`;
      setFormItems(newFields);
      return;
    }

    const filteredData = newFields.filter((item, i) => {
      const itemDate = item.startDate;
      const newFilter = newFields[index].startDate;
      return itemDate === newFilter && i < index;
    });

    let hasOverlap = false;
    let hasRangeBetween = false;

    filteredData.forEach((item) => {
      const itemStartTime = convertTo24HourFormat(item?.startTime);
      const itemEndTime = convertTo24HourFormat(item?.endTime);

      if (itemStartTime && itemEndTime) {
        if (selectTime >= itemStartTime && selectTime <= itemEndTime) {
          hasOverlap = true;
          return;
        }

        if (itemStartTime > prevTime && itemStartTime < selectTime) {
          hasRangeBetween = true;
          return;
        }

        if (itemEndTime > prevTime && itemEndTime < selectTime) {
          hasRangeBetween = true;
          return;
        }
      }
    });

    const startMoment = moment(startTimeValue, "hh:mm:A");
    const endMoment = moment(time1, "hh:mm:A");
    const duration = moment.duration(endMoment.diff(startMoment));
    const diffInMinutes = duration.asMinutes();

    if (diffInMinutes < 30) {
      newFields[index].endTime = "";
      newFields[
        index
      ].endTimeError = `End time should be at least 30 minutes after ${startTimeValue}`;
    } else if (hasOverlap) {
      newFields[index].endTime = "";
      newFields[
        index
      ].endTimeError = `Selected time overlaps with an existing schedule`;
    } else if (hasRangeBetween) {
      newFields[index].endTime = "";
      newFields[
        index
      ].endTimeError = `There is a schedule within the selected time`;
    } else {
      newFields[index].endTime = time;
      newFields[index].endTimeError = "";
    }

    const lastCalenderField = newFields[newFields.length - 1];
    console.log(bookingList, lastCalenderField, "LLLLLLLLLLLKKKKKKKKKKKK");
    
    // Extracting start and end time from the lastCalenderField
    const calenderStartTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.startTime, "MMM D, YYYY hh:mm:A");
    const calenderEndTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.endTime, "MMM D, YYYY hh:mm:A");
    
    // Checking if any booking in bookingList falls within the specified range
    const isBookingWithinRange = bookingList.map((booking) => {
      // Parsing startDateTime with the correct format and including time zone
      const bookingStartTime = moment(booking.startDateTime, "ddd MMM DD YYYY hh:mm:A ZZ");
      const updatedBookingStartTime = bookingStartTime.add(1, 'minutes');
      // Debugging statements
      console.log('calenderStartTime: LLLLLLL', calenderStartTime.format());
      console.log('calenderEndTime: LLLLLLL', calenderEndTime.format());
      console.log('bookingStartTime: LLLLLLL', updatedBookingStartTime.format());
    
      // Checking if the booking's start time is within the range
      return updatedBookingStartTime.isBetween(calenderStartTime, calenderEndTime, null, '[]');
    });
    
    // Checking if there's at least one booking within the range
    const anyBookingWithinRange = isBookingWithinRange.includes(true);
    console.log('anyBookingWithinRange:', anyBookingWithinRange);
     
        // Output 'Yes' or 'No' based on the condition
        if(newFields[
          index
        ].endTimeError == "" || newFields[
          index
        ].startTimeError == "" ){
          if(anyBookingWithinRange){
            newFields[index].endTime = "";
            console.log(anyBookingWithinRange, lastCalenderField,"calenderField[index].endTime")
            createNotification("error", "Selected time is already booked Please check your bookings");
          }
        
         
        }


    setFormItems(newFields);
  };

  const handleEditEndTime = (index, time1) => {
    const time = moment(time1).format("hh:mm:A");
    const calenderField = [...calenderData];

    const startTimeValue = calenderField[index]?.startTime;

    if (!startTimeValue) {
      calenderField[index].endTime = "";
      calenderField[index].endTimeError = "Select startTime first";
      setCalenderData(calenderField);
      return;
    }

    calenderField[index].endTime = time;

    let timeValue = startTimeValue;
    let dateObj = moment(timeValue, "hh:mm:A")
      .add(30, "minutes")
      .format("hh:mm:A");
    let startTime = dateObj;

    const selectTime = convertTo24HourFormat(time);
    const prevTime = convertTo24HourFormat(startTime);

    const filteredData = calenderField.filter((item, i) => {
      const itemDate = item.startDate;
      const newFilter = calenderField[index].startDate;
      return (
        itemDate === newFilter && i !== index && item.startTime && item.endTime
      );
    });

    let hasOverlap = false;
    let hasRangeBetween = false;

    filteredData.forEach((item) => {
      const itemStartTime = convertTo24HourFormat(item.startTime);
      const itemEndTime = convertTo24HourFormat(item.endTime);

      if (selectTime >= itemStartTime && selectTime <= itemEndTime) {
        hasOverlap = true;
        return;
      }

      if (itemStartTime > prevTime && itemStartTime < selectTime) {
        hasRangeBetween = true;
        return;
      }

      if (itemEndTime > prevTime && itemEndTime < selectTime) {
        hasRangeBetween = true;
        return;
      }
    });

    if (prevTime <= selectTime) {
      if (hasOverlap) {
        calenderField[index].endTime = "";
        calenderField[
          index
        ].endTimeError = `Selected time overlaps with an existing schedule`;
      } else if (hasRangeBetween) {
        calenderField[index].endTime = "";
        calenderField[
          index
        ].endTimeError = `There is a schedule within the selected time`;
      } else {
        calenderField[index].endTimeError = "";
      }
    } else if (startTime === time) {
      calenderField[index].endTime = "";
      calenderField[
        index
      ].endTimeError = `End time should be at least 30 minutes after ${timeValue}`;
    } else {
      calenderField[index].endTime = "";
      calenderField[
        index
      ].endTimeError = `End time should be at least 30 minutes after ${timeValue}`;
    }


    const lastCalenderField = calenderField[calenderField.length - 1];
    console.log(bookingList, lastCalenderField, "LLLLLLLLLLLKKKKKKKKKKKK");
    
    // Extracting start and end time from the lastCalenderField
    const calenderStartTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.startTime, "MMM D, YYYY hh:mm:A");
    const calenderEndTime = moment(lastCalenderField.startDate + ' ' + lastCalenderField.endTime, "MMM D, YYYY hh:mm:A");
    
    // Checking if any booking in bookingList falls within the specified range
    const isBookingWithinRange = bookingList.map((booking) => {
      // Parsing startDateTime with the correct format and including time zone
      const bookingStartTime = moment(booking.startDateTime, "ddd MMM DD YYYY hh:mm:A ZZ");
      const updatedBookingStartTime = bookingStartTime.add(1, 'minutes');
      // Debugging statements
      console.log('calenderStartTime: LLLLLLL', calenderStartTime.format());
      console.log('calenderEndTime: LLLLLLL', calenderEndTime.format());
      console.log('bookingStartTime: LLLLLLL', bookingStartTime.format());
    
      // Checking if the booking's start time is within the range
      return updatedBookingStartTime.isBetween(calenderStartTime, calenderEndTime, null, '[]');
    });
    
    // Checking if there's at least one booking within the range
    const anyBookingWithinRange = isBookingWithinRange.includes(true);
    console.log('anyBookingWithinRange:', anyBookingWithinRange);
    



    
    // Output 'Yes' or 'No' based on the condition
    if(calenderField[
      index
    ].endTimeError == "" || calenderField[
      index
    ].startTimeError == "" ){
      if(anyBookingWithinRange){
        calenderField[index].endTime = "";
        console.log(anyBookingWithinRange, lastCalenderField,"calenderField[index].endTime")
        createNotification("error", "Selected time is already booked Please check your bookings");
      }
    
     
    }
      setCalenderData(calenderField);
    
   
  };

  const InvoiceAddItem = () => {
    setFormItems([
      ...formItems,
      { startDate: moment().format("ll"), startTime: "", endTime: "" },
    ]);
  };

  const addSchedule = () => {
    setCalenderData([
      ...calenderData,
      { startDate: moment().format("ll"), startTime: null, endTime: null },
    ]);
  };

  const InvoiceRemoveItem = (index) => {
    const newFormData = [...formItems];
    newFormData.splice(index, 1);
    setFormItems(newFormData);
    setError("");
  };

  const removeSchedule = (index) => {
    const newCalanderData = [...calenderData];
    newCalanderData.splice(index, 1);
    setCalenderData(newCalanderData);
    setError("");
  };

  const InvoiceSubmit = async (event) => {
    event.preventDefault();
    const validation = () => {
      let err = {};
      let isValid = true;
      let arr = [];
      if (calenderData?.length > 0) {
        calenderData?.forEach((element, index) => {
          let errors = {};
          calenderData[index].endTimeError = "";
          if (element.startTime === null || element.startTime === "") {
            errors["startTime"] = "Start time cannot be empty";
            isValid = false;
          }
          if (element.endTime === null || element.endTime === "") {
            errors["endTime"] = "End time cannot be empty";
            isValid = false;
          }
          arr.push(errors);
        });
      } else {
        formItems?.forEach((element, index) => {
          let errors = {};
          formItems[index].endTimeError = "";
          if (element.startTime === null || element.startTime === "") {
            errors["startTime"] = "Start time cannot be empty";
            isValid = false;
          }
          if (element.endTime === null || element.endTime === "") {
            errors["endTime"] = "End time cannot be empty";
            isValid = false;
          }
          arr.push(errors);
        });
      }

      setError(arr);
      return isValid;
    };
    if (validation()) {
      setLoader(true);

      const response = await calenderService.createSchedule(
        { scheduledData: calenderData ? calenderData : formItems },
        reduxToken
      );
      if (response.status == 200) {
        createNotification("success", response?.data?.message);
        setLoader(false);
      } else {
        setLoader(false);

        console.log("erro");
      }
    }
  };
  const filterOptions = (time, index) => {
    const currentTime = moment();
    let roundedTime =
      currentTime.minute() >= 30
        ? currentTime.startOf("hour").add(1, "hour")
        : currentTime.startOf("hour").add(30, "minutes");

    roundedTime = roundedTime.subtract(30, "minutes"); // Subtract 30 minutes from the rounded time

    const newField = [...formItems];
    const lastObjectData = newField[index];

    const selectedDate = moment(lastObjectData.startDate).startOf("day");
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
  const filterOptionsEdit = (time, index) => {
    const currentTime = moment();
    let roundedTime =
      currentTime.minute() >= 30
        ? currentTime.startOf("hour").add(1, "hour")
        : currentTime.startOf("hour").add(30, "minutes");

    roundedTime = roundedTime.subtract(30, "minutes"); // Subtract 30 minutes from the rounded time

    const calenderField = [...calenderData];

    const lastObjectData = calenderField[index];

    const selectedDate = moment(lastObjectData.startDate).startOf("day");
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

  const calenderDataFunction = () => {
    const calenderDataList = calenderData?.map((formItem, index) => {
      console.log("formItem.startDate",formItem.startDate)
      return (
        <>
          <div className="inovie-time-list" key={index}>
            <Form.Group className="mb-3 inoice-field date-field">
              <Form.Label>Date</Form.Label>
              <div className="selectdate-field">
                <InputGroup>
                  <div className="input__group">
                    <DatePicker
                      value={moment(formItem.startDate).format('MMM DD, YYYY')}
                      onChange={(date) => handleEditDate(index, date)}
                      dateFormat="MMM DD, yyyy"
                      minDate={new Date()}
                      placeholderText="Start Date"
                      selected={new Date(formItem.startDate)}
                      is
                    />
                  </div>
                  <span className="error">{error[index]?.startDate}</span>
                </InputGroup>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 inoice-field">
              <Form.Label>Start Time</Form.Label>

              <DatePicker
                className="w-75%"
                value={formItem.startTime}
                onChange={(time) => handleEditStartTime(index, time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                timeFormat="hh:mm aa"
                use12Hours={true}
                filterTime={(time) => filterOptionsEdit(time, index)}
              />
              <span className="error">
                {error &&
                error.length > 0 &&
                error[index] &&
                error[index]?.startTime
                  ? error[index].startTime
                  : formItem.startTimeError
                  ? formItem.startTimeError
                  : ""}
              </span>
            </Form.Group>
            <Form.Group className="mb-3 inoice-field">
              <Form.Label>End Time</Form.Label>

              <DatePicker
                value={formItem.endTime}
                onChange={(time) => handleEditEndTime(index, time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                timeFormat="hh:mm:aa"
                use12Hours={true}
                filterTime={(time) => filterOptionsEdit(time, index)}
              />
              <span className="error">
                {formItem.endTimeError
                  ? formItem.endTimeError
                  : error &&
                    error.length > 0 &&
                    error[index] &&
                    error[index]?.endTime
                  ? error[index].endTime
                  : ""}
              </span>
            </Form.Group>
            <Form.Group className="mb-3"></Form.Group>
                  <div className="close-dlt-btn">
            {calenderData.length - 1 != 0 && (
              <div className="app-invoicebtn remove-btn">
                <Button
                  type="button"
                  className="searchbtn"
                  onClick={() => removeSchedule(index)}
                >
                  <MdClose />
                </Button>
              </div>
              
            )}
             {index == calenderData.length - 1 && (
            <div className="addbtn-invoice">
              <div className="app-invoicebtn">
                <Button
                  type="button"
                  className="searchbtn"
                  disabled={activateAccount}
                  onClick={addSchedule}
                >
                  <BsPlusLg />
                </Button>
              </div>
            </div>
          )}
          </div>
          </div>
         
        </>
      );
    });
    return calenderDataList;
  };
  const formItemsDataListFunction = () => {
    const formItemsDataList = formItems?.map((formItem, index) => {
      return (
        <>
          <div className="inovie-time-list" key={index}>
            <Form.Group className="mb-3 inoice-field date-field">
              <Form.Label>Date</Form.Label>
              <div className="selectdate-field">
                <InputGroup>
                  <div className="input__group">
                    <DatePicker
                      value={formItem.startDate}
                      onChange={(date) => handleDateChange(index, date)}
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                      placeholderText="Start Date"
                      selected={new Date(formItem.startDate)}
                    />
                  </div>
                </InputGroup>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 inoice-field">
              <Form.Label>Start Time</Form.Label>

              <DatePicker
                value={formItem.startTime}
                onChange={(time) => handleStartTimeChange(index, time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                timeFormat="h:mm:aa"
                use12Hours={true}
                filterTime={(time) => filterOptions(time, index)}
              />
              <span className="error">
                {error &&
                error.length > 0 &&
                error[index] &&
                error[index]?.startTime
                  ? error[index].startTime
                  : formItem.startTimeError
                  ? formItem.startTimeError
                  : ""}
              </span>
            </Form.Group>
            <Form.Group className="mb-3 inoice-field">
              <Form.Label>End Time</Form.Label>

              <DatePicker
                value={formItem.endTime}
                onChange={(time) => handleEndTimeChange(index, time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                timeFormat="h:mm:aa"
                use12Hours={true}
                filterTime={(time) => filterOptions(time, index)}
              />
              <span className="error">
                {formItem.endTimeError
                  ? formItem.endTimeError
                  : error &&
                    error.length > 0 &&
                    error[index] &&
                    error[index]?.endTime
                  ? error[index].endTime
                  : ""}
              </span>
            </Form.Group>
            <Form.Group className="mb-3"></Form.Group>

            {formItems.length - 1 != 0 && (
              <div className="app-invoicebtn remove-btn">
                <Button
                  type="button"
                  className="searchbtn"
                  onClick={() => InvoiceRemoveItem(index)}
                >
                  <MdClose />
                </Button>
              </div>
            )}

            {index == formItems.length - 1 && (
              <div className="app-invoicebtn">
                <Button
                  type="button"
                  className="searchbtn"
                  disabled={activateAccount}
                  onClick={InvoiceAddItem}
                >
                  <BsPlusLg />
                </Button>
              </div>
            )}
          </div>
        </>
      );
    });
    return formItemsDataList;
  };
  return (
    <>
      {isLoading ? (
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
      ) : (
        <div className="appointment-wrapper setting-layout">
          <div className="userinvoice-list-wrap">
            <div className="user-information-desc">
              <p>
                <b>Calendar Setting:</b> Use this section to set your daily
                availability.
              </p>
            </div>
            <Form onSubmit={InvoiceSubmit}>
              {calenderData ? (
                <div className={`${calenderData.length > 5 ? 'calendardatascroll invoice-listbox cl-dslist' : 'invoice-listbox cl-dslist'}`}>
               
                  {calenderDataFunction()}
                  <div className="verifydesc">
                    {activateAccount == true ? (
                      <b>Please verify your Account first:</b>
                    ) : (
                      ""
                    )}
                </div>
                </div>
              ) : (
                <div className="invoice-listbox cl-dslist">
                  {formItemsDataListFunction()}
                  <div className="verifydesc">
                    {activateAccount == true ? (
                      <b style={{ color: "red" }}>
                        Warning: Your account is not activated yet. Please
                        verify your account.
                      </b>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
              <div className="submitbtn">
                <Button
                  type="submit"
                  disabled={loader || activateAccount}
                  className="nextbtn clsave-btn"
                >
                  {loader ? (
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
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
export default Calendarsetting;
