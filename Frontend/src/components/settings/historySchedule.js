import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import * as calenderService from "../../services/calenderServices";

import { useSelector } from "react-redux";
import moment from "moment";
import { Rings } from "react-loader-spinner";

const HistorySchedule = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [isLoading, setIsLoading] = useState(false);
  const [calenderData, setCalenderData] = useState([]);
  const [error, setError] = useState([]);
  const [loader, setLoader] = useState(false);

  const [formItems, setFormItems] = useState([
    {
      startDate: moment().format("ll"),
      startTime: moment().format("hh:mm:a"),
      endTime: "",
      startTimeError: "",
      endTimeError: "",
    },
  ]);
  useEffect(() => {
    getSchedule();
  }, [reduxToken]);

  const getSchedule = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await calenderService.getSchedule(reduxToken);
      if (response?.status == 200) {
        let data1 = response?.data?.data[0]?.scheduledData;
        const currentDate = new Date();
        const filteredData = data1?.filter((item) => {
          const itemDate = new Date(item.startDate).toLocaleString("en-US");

          return new Date(itemDate).getTime() >= new Date().getTime();
        });
        setCalenderData(data1);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const InvoiceSubmit = async (event) => {
    event.preventDefault();
    const validation = () => {
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
      } else if (response.response.data.status === 500) {
        createNotification("error", response?.response?.data?.message);
        setLoader(false);
      } else {
        setLoader(false);

        console.log("erro");
      }
    }
  };

  const scheduleHistoryFunction = () => {
    const calenderDataList = calenderData?.map((formItem, index) => {
      return (
        <>
                    <>
                      <div className="inovie-time-list" key={index}>
                        <Form.Group className="mb-3 inoice-field date-field">
                          <Form.Label>Date</Form.Label>
                          <div className="selectdate-field">
                            <InputGroup>
                              <div className="input__group">
                                <input
                                  className="input1"
                                  type="text"
                                  name="email"
                                  disabled
                                  placeholder="Email"
                                  value={formItem.startDate}
                                />
                              </div>
                              <span className="error">
                                {error[index]?.startDate}
                              </span>
                            </InputGroup>
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3 inoice-field">
                          <Form.Label>Start Time</Form.Label>
                          <input
                            className="input1"
                            type="text"
                            name="email"
                            placeholder="Email"
                            disabled
                            value={formItem.startTime}
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
                          <Form.Label>End Time</Form.Label><br/>
                          <input
                            className="input1"
                            type="text"
                            name="email"
                            placeholder="Email"
                            disabled
                            value={formItem?.endTime}
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
                      </div>
                    </>

        </>
      );
    });
    return calenderDataList;
  };
  return (
    <>
      {isLoading ? (
        // <>
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
                <b>Schedule History :</b> This section show your Schedule
                History.
              </p>
            </div>
            <Form onSubmit={InvoiceSubmit}>
              {calenderData ? (
                <div className="invoice-listbox cl-dslist">
                  {scheduleHistoryFunction()}
                </div>
              ) : (
                "No Schedule History"
              )}
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
export default HistorySchedule;
