import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import * as businessService from "../services/businessServices";
import _ from "lodash";
import { createNotification } from "../helper/notification";
import { useSelector } from "react-redux";
import { BsPlusCircle } from "react-icons/bs";
export const BusinessServiceModal = (props) => {
  const [show, setShow] = useState(false);
  const [addService, setAddService] = useState({
    service: "",
    price: "",
    hours: "",
    minutes:""
  });
  const [error, setError] = useState([]);
  const typeId = localStorage.getItem("business_Type_id");
  let tokenResponse = useSelector((state) => state.auth.token);

  const formValidation = () => {
    const { service, price ,hours,minutes} = addService;
    let formErrors = {};
    let isValid = true;
    if (!service) {
      isValid = false;
      formErrors["service"] = "Please Enter Service";
    } else if (!service.trim()) {
      isValid = false;
      formErrors["service"] = "Please Enter Service";
    }
    if (!price) {
      isValid = false;
      formErrors["price"] = "Please Enter service price";
    }
    if(!hours && !minutes){
      isValid =false
      formErrors["time"] = "Please Enter service Time";
    }else if(hours =='0' && minutes =="0" ||!hours && minutes =="0" || hours=="0" && !minutes){
      formErrors["time"] = "Service Hours is Required";
      isValid =false
    }
    setError(formErrors);
    return isValid;
  };

  useEffect(() => {
    props.getServiceByUser();
  }, [tokenResponse]);

  const clickHandleAddService = async (e) => {
    if (formValidation()) {
      try {
        let hours =addService.hours == undefined || addService.hours == "" ? "0":addService.hours;
        let minutes =addService.minutes ==undefined || addService.minutes ==""?"0":addService.minutes
        const serviceObj = {
          service: addService.service,
          price: addService.price,
          hours: hours,
          minutes: minutes,
          businessTypeId: JSON.parse(typeId),
        };
        if (tokenResponse && serviceObj) {
          const response = await businessService.additionalBusinessService(
            serviceObj,
            tokenResponse
          );
          if (response.status == 200) {
            createNotification("success", response.message);
            setShow(false);
            props.getFunction();
            setAddService("");
          } else {
            createNotification("error", response.message);
          }
          props.getServiceByUser(tokenResponse);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    props.getServiceByUser();
  };

  const handleShow = () => setShow(true);

  const handleCloseOnCloseButton = () => {
    setShow(false);
    setError([])
    setAddService({ ...addService, price: "", service: "",hours:"",minutes:"" });
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "price") {
      if (value === "" || (value === "0" && value.length === 1)) {
        setAddService({
          ...addService,
          [name]: "",
        });
      } else {
        const regex = /^\d{1,5}(\.\d{0,2})?$/;
        if (regex.test(value)) {
          setAddService({
            ...addService,
            [name]: value,
          });
        }
      }
    } else {
      setAddService({
        ...addService,
        [name]: value,
      });
    }
  };

  return (
    <>
      <h3>add additional service </h3>
      <Button
        onClick={handleShow}
        disabled={props.loader == true ? props.loadDisabled : props.disabledBtn}
      >
        <BsPlusCircle />
      </Button>
      <Modal
        show={show}
        className="service-modal"
        onHide={handleCloseOnCloseButton}
      >
        <Modal.Header>
          <Modal.Title>Add Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="popup-form-box mb-3">
            <label className="form-label">Service</label>
            <input
              className="input1 "
              type="text"
              name="service"
              placeholder="Service"
              value={addService.service}
              onChange={handleChange}
            />
            <span className="form-error">{error.service}</span>
          </div>
          <div className="popup-form-box mb-3">
            <label className="form-label">Service Price</label>

            <input
              className="input1"
              type="text"
              name="price"
              placeholder="Service price"
              value={addService.price}
              onChange={handleChange}
            />
            <span className="form-error">{error.price}</span>
          </div>
          <div className="popup-form-box">
            <label className="form-label">Service Time</label>
            <div style={{ display: "flex", alignItems: "center",gap:"8px" }}>
              <select
                className="input1"
                name="hours"
                value={addService.hours}
                onChange={handleChange}
              >
                <option value="">Select Hours</option>
                {[...Array(13).keys()].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} hours
                  </option>
                ))}
              </select>
              <select
                className="input1"
                name="minutes"
                value={addService.minutes}
                onChange={handleChange}
              >
                <option value="">Select Minutes</option>
                {[0,15, 30, 45].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute} minutes
                  </option>
                ))}
              </select>
            </div>
            <span className="form-error">{error.time}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOnCloseButton}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={clickHandleAddService}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
