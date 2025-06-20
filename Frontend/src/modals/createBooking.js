import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const CreateBooing = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [startDate, setStartDate] = useState(new Date());

  const compInfo = [
    { hh: "00", mm: "00" },
  ];
  const hrs = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const mins = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
  ];
  const [duration, setDuration] = React.useState(0);
  const [durationMins, setDurationMins] = React.useState(0);

  const handleChangeDuration = (event) => {
    setDuration(event.target.value);
    compInfo[0].hh = event.target.value;
  };
  const handleChangeDurationMins = (event) => {
    setDurationMins(event.target.value);
    compInfo[0].mm = event.target.value;
  };
 
  return (
    <>
      <Button className="bookingbtn" onClick={handleShow}>
        Create Booking
      </Button>
      <Modal show={show} className="user-modal" onHide={handleClose}>
        <div className="login1">
          <Modal.Header>
            <Modal.Title>Create New Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="popup-form-box">
              {" "}
              <div className="mb-3">
                <label className="form-label"> User Name/Email:</label>
                <select>
                  <option>testname@gmail.com</option>
                  <option>admin@gmail.com</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Service Name:</label>
                <input
                  className="input1 form-control"
                  type="text"
                  name="service"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Service Cost:</label>
                <input
                  className="input1 form-control"
                  type="text"
                  name="servicecost"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(Date) => setStartDate(Date)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time:</label>
                <div className="time-duration">
                  <select value={duration} onChange={handleChangeDuration}>
                    <span value={0}>00</span>
                    {hrs.map((info) => (
                      <option value={info}>{info}</option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={durationMins}
                    onChange={handleChangeDurationMins}
                  >
                    <span value={0}>00</span>
                    {mins.map((info) => (
                      <option value={info}>{info}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="close" onClick={handleClose}>
              Create
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default CreateBooing;
