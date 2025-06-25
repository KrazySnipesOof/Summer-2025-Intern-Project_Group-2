import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import "@fullcalendar/daygrid/main.css";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import listPlugin from "@fullcalendar/list";
import { Button, Modal } from "react-bootstrap";
import Eventoption from "./eventOption";
import * as bookingService from "../../services/bookingServices";
import { MdClose } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";

const CalenderApp = () => {
  const calendarRef = useRef();
  const ref = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showEvent, setShowEvent] = useState(false);
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [info, setInfo] = useState({});
  const [idmodal, setIdModal] = useState(0);
  const [filterData, setFilterData] = useState(null);
  const [activeView, setActiveView] = useState("timeGridWeek"); //initialize with "timeGridWeek", to match initialView value
  
  // holds currently visible date range of calendar
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const handlemodalcls = () => {
    setShowEvent(false);
  };
  const getServiceEndDateTime = (startDateTime, servicesOrClass, type) => {
    let startTime = moment(startDateTime, "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ");

    if (type === "Class") {
      const { startTime: classStart, endTime: classEnd } =
        servicesOrClass?.occurrences ? servicesOrClass?.occurrences[0] : {};
      const duration = moment.duration(
        moment(classEnd, "hh:mmA").diff(moment(classStart, "hh:mmA"))
      );
      startTime.add(duration);
    } else {
      servicesOrClass.forEach((service) => {
        const { hours = 0, minutes = 0} = service?.serviceTime || {};
        startTime.add(hours, "hours").add(minutes, "minutes");
      });
    }

    return startTime;
  };

  const getDetails = async (start = null, end = null) => { //set start and end values to null
    const resp = await bookingService.bookingList(start && end ? { start, end } : {});
    if (resp.status == 200) {
      const response = resp?.data?.data;
      let arr = [];
      if (response.length > 0) {
        response.map((res) => {
          let obj = {
            title: res?.service?.map((serv) => serv?.service).join(", ")
              || "",
            groupId: res?._id,
            start: moment(
              res?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            )
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            end: getServiceEndDateTime(
              res?.startDateTime,
              res?.serviceType === "Class" ? res?.classes[0] : res?.service,
              res?.serviceType
            )
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            borderColor:
              activeView == "listMonth" || activeView == "dayGridMonth"
                ? res?.eventColor || "#CCCCCC"  //default gray color
                : "#00000040",
            textColor:
              res?.bookingStatus == "Cancelled"
                ? "#777981"
                : res?.show
                ? "#2F3033"
                : "#FFFFFF",
            color:
              res?.bookingStatus == "Cancelled"
                ? "#BCBFC7"
                : res?.show
                ? "#9FD19F"
                : "#D95B30",
            name: res?.name,
          };
          arr.push(obj);
        });
      }
      setData(arr);
    }
  };
  //Effect to fetch bookings when view or date range changes
  useEffect(() => {
    //getDetails();
    if (dateRange.start && dateRange.end) {
      getDetails(dateRange.start, dateRange.end); //Fetch based on visible date range
    } else {
      getDetails(); //Initial load fallback
    }
  }, [activeView, dateRange]); //Re-fetch if view or visible range changes

  //updated to capture view and visible date range
  const onDatesSet = (info) => {
    setActiveView(info.view.type); //Track current view
    setDateRange({ start: info.startStr, end: info.endStr }); //Track visible calendar date range
  };
  
  const datepickerRef = useRef(null);

  useEffect(() => {
    const button = document.querySelector(".fc-calendar-button");
    if (button) {
      button.innerHTML = "";

      const icon = document.createElement("span");
      icon.innerHTML = `<i class="fa fa-caret-down"></i>`;

      button.addEventListener("click", () => {
        if (datepickerRef.current) {
          datepickerRef.current.setOpen(true);
        }
      });

      button.appendChild(icon);
    }

    return () => {
      if (button) {
        button.removeEventListener("click", () => {
          if (datepickerRef.current) {
            datepickerRef.current.setOpen(true);
          }
        });
      }
    };
  }, []);

  const getServices = async () => {
    const resp = await bookingService.getServices();
    const response =
      resp?.data &&
      resp?.data?.data &&
      resp?.data?.data.length > 0 &&
      resp?.data?.data[0]?.service;
    if (resp.status == 200) {
      setServices(response);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleChange = async (e) => {
    let data = { service: e.target.value };
    const resp = await bookingService.filterBooking(data);

    if (resp.status == 200) {
      const response = resp?.data?.data;
      let arr = [];
      if (response.length > 0) {
        response.map((res) => {
          let obj = {
            title: res?.service?.map((serv) => serv.service),
            groupId: res._id,
            start: moment(
              res?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            )
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            end: getServiceEndDateTime(
              res?.startDateTime,
              res?.serviceType === "Class" ? res?.classes[0] : res?.service,
              res?.serviceType
            )
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            borderColor:
              activeView == "listMonth" || activeView == "dayGridMonth"
                ? res?.eventColor
                : "#00000040",
            textColor:
              res?.bookingStatus == "Cancelled"
                ? "#777981"
                : res?.show
                ? "#2F3033"
                : "#FFFFFF",
            color:
              res?.bookingStatus == "Cancelled"
                ? "#BCBFC7"
                : res?.show
                ? "#9FD19F"
                : "#D95B30",
            name: res?.name,
          };
          arr.push(obj);
        });
      }
      setData(arr);
    }
  };
  const handleEventClick = ({ event }) => {
    let id = event?._def?.defId;
    if (Number(idmodal) == Number(id)) {
      setShowEvent(false);
      setIdModal(0);
    } else {
      setShowEvent(true);
      setInfo(event);
      setIdModal(id);
    }
    const filteredData = data.filter((d) => d.groupId == event?._def?.groupId);
    setFilterData(filteredData);
  };

  return (
    <div className="full-calendar-layout">
      <div className="flc-layout-wrap" ref={ref}>
        <div className="calendar-selectdate">
          <DatePicker
            ref={datepickerRef}
            peekNextMonth
            showYearDropdown
            showMonthDropdown
            todayButton="Today"
            selected={startDate}
            dropdownMode="select"
            dateFormat="yyyy/MM/dd"
            onChange={(date) => {
              setStartDate(date);
              calendarRef.current.getApi().gotoDate(new Date(date));
            }}
          />
        </div>
        <div className="appointment-colors-container">
          <div className="appointment-colors">
            <span className="color color1"></span>
            <h3>Show</h3>
          </div>
          <div className="appointment-colors">
            <span className="color color2"></span>
            <h3>No-Show</h3>
          </div>
          <div className="appointment-colors">
            <span className="color color3"></span>
            <h3>Canceled</h3>
          </div>
        </div>
        <div className="fcl-btn">
          <div className="fl-btn">
            <div className="fl-sels-field">
              <Form.Select
                className="form-select"
                name="services"
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                {services?.length > 0 &&
                  services.map((service, i) => (
                    <option key={i} value={service?.serviceId?._id}>
                      {service?.serviceId?.service}
                    </option>
                  ))}
              </Form.Select>
            </div>
            {/* For Users when it's available */}
            {/* <div className="fl-sels-field">
              <Form.Select
                className="form-select"
                name="services"
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                {services?.length > 0 &&
                  services.map((service, i) => (
                    <option key={i} value={service?.serviceId?._id}>
                      {service?.serviceId?.service}
                    </option>
                  ))}
              </Form.Select>
            </div> */}
          </div>
        </div>
        <FullCalendar
          ref={calendarRef}
          initialView="timeGridWeek"
          hideOnOutsideClick={true}
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            listPlugin,
          ]}
          editable={false}
          headerToolbar={{
            right: "listMonth,timeGridDay,timeGridWeek,dayGridMonth",
            center: `prev,title,calendar,next${
              activeView == "timeGridDay" ? ",today" : ""
            }${activeView == "timeGridWeek" ? ",thisWeek" : ""}`,
            left: "",
          }}
          customButtons={{
            thisWeek: {
              text: "This Week",
              click: function () {
                calendarRef.current.getApi().gotoDate(new Date());
              },
            },
          }}
          //Callback to set view + date range
          datesSet={onDatesSet}
          eventClick={handleEventClick}
          events={data}
          goToDate={startDate}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          slotDuration={"00:15:00"}
          slotLabelInterval={"01:00"}
          eventContent={
            activeView !== "dayGridMonth" ? renderEventContent : undefined
          }
        />
        <Modal
          show={showEvent}
          onHide={handlemodalcls}
          className="eventlist-modal"
        >
          <Modal.Header>
            <div className="event-heading">
              <Button className="clsbtn" onClick={handlemodalcls}>
                <MdClose />
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Eventoption
              info={info}
              getDetails={getDetails}
              data={data}
              setShowEvent={setShowEvent}
              setIdModal={setIdModal}
              filterData={filterData}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
export default CalenderApp;

function renderEventContent(eventInfo) {
  const currentView = eventInfo.view.type;
  if (currentView != "listMonth") {
    return (
      <div className="custom-event">
        <div className="event-top">
          <div className="event-time">
            {moment(eventInfo.event?.start).format("hh:mm A")}{" "}
            <FaArrowRight className="mb-1" />{" "}
            {moment(eventInfo.event?.end).format("hh:mm A")}
          </div>
          <div className="event-name">
            {eventInfo.event?.extendedProps?.name}
          </div>
          <div className="event-title">{eventInfo.event.title}</div>
        </div>
        {/* <div className="event-footer">Extra Details</div>{" "} */}
      </div>
    );
  } else {
    return (
      <div className="custom-list-event">
        <div className="event-name">{eventInfo.event?.extendedProps?.name}</div>
        <div className="event-title">{eventInfo.event.title}</div>
      </div>
    );
  }
}
