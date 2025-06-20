import React from "react";
import * as bookingService from "../../services/bookingServices";
import { ToastContainer } from "react-toastify";
import { createNotification } from "../../helper/notification";
import moment from "moment";

const EventStatusOption = ({
  id,
  getDetails,
  setIdModal,
  setShowEvent,
  filterData,

}) => {
 

 
  const handleStatusChange = async (status, color) => {
    console.log(status, ":::::::::::::::::::::")
   const  startdate  = moment(filterData[0].start).format('ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ');
    const resp = await bookingService.updateBooking(status, color, id , startdate);
    if (resp.status == 200) {
      setShowEvent(false);
      setIdModal(0);
      getDetails();
      createNotification("success", resp?.data?.message);
    }
  };
  

  const status = [

    {
      status: "show",
      color: "#a4e8b9",
      tag: "Show",
    },
    {
      status: "Noshow",
      color: "#cf0018",
      tag: "No-Show",
    },
  
    {
      status: "Cancelled",
      color: "#b6b6b6",
      tag: "Cancel Appointment",
    },
  ];

  const statusDatafunction = () => {
    const statusData =
    status?.length > 0 && status.map((st, i) => {
        return (
          <>
                  <li className={st.status} key={i}>
                 
                    <input
                        type="checkbox"
                        class="styled-checkbox"
                        id={st.tag}
                        checked={filterData[0].color == st.color}
                        onChange={() => handleStatusChange(st.status, st.color)}
                      />
                   <label for={st.tag}><span className="coloroption" style={{backgroundColor:st.color}}></span>{st.tag}</label>
                  </li>
          </>
        );
      });
    return statusData;
  };
  return (
    <>
      <ToastContainer />
      <div className="color-setting-list">
        <div className="csl-list">
          <ul>
            {status?.length > 0
              ? statusDatafunction()
              : null}
          </ul>
        </div>
      </div>
    </>
  );
};
export default EventStatusOption;
