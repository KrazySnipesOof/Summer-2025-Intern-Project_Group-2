import React, { useState, useEffect } from "react";
import { BiEdit, BiCloudUpload } from "react-icons/bi";
import { FiChevronRight } from "react-icons/fi";
import { TbNotes } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import EventStatusOption from "./eventStatusOption";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
} from "react-bootstrap";
import * as bookingService from "../../services/bookingServices";
import * as bookingUserService from "../../services/bookingUserService";

import { createNotification } from "../../helper/notification";
import moment from "moment";


const   Eventoption = ({
  info,
  getDetails,
  setIdModal,
  setShowEvent,
  filterData,
  data
}) => {
  const [showOption, SetShowOption] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [color, setColor] = useState("#cf0018");

  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deletedDate, setDeleteddate] = useState("");

  const Statusoptiontoggle = () => {
   if(status !== "Show" || status !== "Appointment Cancelled")
    {SetShowOption(!showOption);}
  };
  const navigate = useNavigate();

  useEffect( () => {
    let date = new Date(info?._instance?.range?.start).toDateString();
    let timeinHour = new Date(info?._instance?.range?.start)
      .toTimeString()
      ?.split(":")[0];
    let timeinMinute = new Date(info?._instance?.range?.start)
      .toTimeString()
      ?.split(":")[1];
    let nTime = timeinHour.concat(":", timeinMinute);
    setDate(date);
    setTime(nTime);
    setEventId(info?._def?.groupId);
  }, [info]);

const EditBookings  =  (info) =>{
let  id  =  info?._def?.groupId
  navigate(`/editbooking/${id}`);
}

const DeleteBookings  = async  (info) =>{
  let  id  =  info?._def?.groupId
const response  =  await bookingService.getSingleBooking(id);
setDeleteddate(response?.data?.data?.startDateTime)
    setDeleteId(id)
    setShow(true);
  }
  const handleClose = () => {
    setShow(false);
  };

  const handleDelete = async () => {
    let id = deleteId;
    let data = deletedDate
    if (id) {
      const response = await bookingService.removeBooking(id,data);
      if (response.status == 200) {
        createNotification("success", response?.data?.message);
        handleClose();
        getDetails();
        setShowEvent(false)
      
      }
    }

  };

    const handleClickNotes  =  async (info) =>{
      let  id  =  info?._def?.groupId;
      const response  =  await bookingService.getSingleBooking(id);
    const userid  =   response?.data?.data?.customerId;
    const userFind  =  await bookingUserService.BookingUserGetById(userid)
    if (userFind?.data?.status != "404"){
    navigate(`/clientdetail/${userid}?tab=5`);
    }else {
      createNotification("warning","User is already deleted");
    }}
    const handleClickAppointment  =  async (info) =>{
      let  id  =  info?._def?.groupId;
      const response  =  await bookingService.getSingleBooking(id);
    const userid  =   response?.data?.data?.customerId;
    const userFind  =  await bookingUserService.BookingUserGetById(userid)
    if (userFind?.data?.status != "404"){
      navigate(`/clientdetail/${userid}?tab=8`);
    }else {
      createNotification("warning","User is already deleted");
    }
    }
  useEffect(() => {
    let color = "";
let status ="";
    if (filterData !== null && filterData.length > 0) {
      color = filterData[0]?.color;
      status =  filterData[0]?.status;
    }
    switch (color) {
      case (color = "#b6b6b6"):
        setColor("#b6b6b6")
        setStatus("Appointment Cancelled");
        break;
    
      case (color = "#a4e8b9"):
        setColor("#a4e8b9")

        setStatus("Show");
        break;
   
      default:
        
 
    setColor("#cf0018")
        setStatus("No-Show");
 
  }
  }, [filterData]);
  return (
    <>
     <div className="event-list-opt">
      <div className="event-option-list">
        <ul>
          <li className="event-option-heading">
            <div className="event-option-field">
              <span className="eventname">{filterData ? filterData[0]?.name.substring(0, 2).toUpperCase() : "" }</span>
              <div className="event-head">
                <h3>{info?._def?.title}</h3>
               
                <p className="date">
                {moment.utc(info?._instance?.range?.start).format('ddd MMM DD YYYY h:mm A')}
                 
                </p>
              </div>
            </div>
          </li>
          <li className="change-status">
            <div className="event-option-field" onClick={Statusoptiontoggle}>
              <span className="statusicon"  style={{backgroundColor:color}}></span>
              {status === "Show" || status === "Appointment Cancelled" ?   <div className="event-head">
                <h3>Status</h3>
                 <p>{status}</p>
               <p>(Checked Out)</p>
              </div> :
              <div className="event-head">
                <h3>Change Status</h3>
                 <p>{status}</p>
               <p>(Checked Out)</p>
              </div>
                  }
              <span className="ch-arrow">
              {status === "Show" || status === "Appointment Cancelled" ? "" : <FiChevronRight />}
              </span>
            </div>
          </li>
          {status == "Appointment Cancelled" ? "" :
          <li className="event-spt">
            <div className="event-option-field">
              <span className="event-icon">
                <BiEdit />
              </span>
              <div className="event-head">
              <button onClick={ () => EditBookings(info)}><h3>Edit</h3>
                <p>Edit Appointment</p></button> 
              </div>
            </div>
            
          </li>
          }
          <li className="event-spt">
            <div className="event-option-field">
              <span className="event-icon">
                <TbNotes />
              </span>
              <div className="event-head">
              <button onClick={ () => handleClickNotes(info)}> <h3>Notes</h3>
                <p>Client Notes</p></button>
              </div>
            </div>
          </li>
          {status == "Show" ? "" :
          <li className="event-spt">
            <div className="event-option-field">
              <span className="event-icon">
                <RiDeleteBinLine />
              </span>
              <div className="event-head">
              <button onClick={ () => DeleteBookings(info)}><h3>Delete</h3>
                <p>Delete Appointment</p></button>
              </div>
            </div>
          </li>
}
          <li className="event-spt">
            <div className="event-option-field">
              <span className="event-icon">
                <BiCloudUpload />
              </span>
              <div className="event-head">
              <button onClick={ () => handleClickAppointment(info)}> <h3>Upload</h3>
                <p>Upload file to Appointment</p></button>
              </div>
            </div>
          </li>
        </ul>
      </div>
        
      {showOption ?   status == "Show" ||  status == "Appointment Cancelled" ? "" : (
        <div className="event-option-list sub-option-list">
          <EventStatusOption
            id={eventId}
            getDetails={getDetails}
            setShowEvent={setShowEvent}
            setIdModal={setIdModal}
            filterData={filterData}
          />
        </div>
        ) : null}
      </div>
      <Modal show={show}>
                <Modal.Header>
                  <Modal.Title>Delete Booking</Modal.Title>
                </Modal.Header>
                  <Modal.Body>Do you want to Delete this Booking ?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
    </>
  );
};
export default Eventoption;
