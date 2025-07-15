import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import * as businessService from "../services/businessServices";
import _ from "lodash";
import { createNotification } from "../helper/notification";
import { useSelector } from "react-redux";
import { BsPlusCircle } from "react-icons/bs";
import Form from "react-bootstrap/Form";

export const AddServiceModal = (props) => {
  const [show, setShow] = useState(false);
  const [freeService, setFreeService] = useState(false);
  const [addService, setAddService] = useState({
    service: "",
    price: "",
    hours: "",
    minutes:"",
    inventory: [], //inventory array to store item details
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
    
    if (freeService === false) {
      if(!price) {
        isValid = false;
        formErrors["price"] = "Please Enter service price";
      }else{
        let priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
        if(priceNum < 0.005){
          isValid = false;
          formErrors["price"] = "Service Price should be 0.5 cent at least.";
        }
      }
    }

    if(!hours && !minutes){
      isValid =false
      formErrors["time"] = "Please Enter service Time";
    }else if(hours =='0' && minutes =="0" ||!hours && minutes =="0" || hours=="0" && !minutes){
      formErrors["time"] = "Service Hours is Required";
      isValid =false
    }
    // Validate inventory items
    inventory.forEach((item, index) => {
      if (!item.productName || !item.productName.trim()) {
        isValid = false;
        formErrors[`inventoryProductName${index}`] = `Inventory item #${index + 1} requires a Product Name`;
      }
    });

    setError(formErrors);
    return isValid;
  };

//   useEffect(() => {
//     props.getServiceByUser();
//   }, [tokenResponse]);

  const clickHandleAddService = async (e) => {
    if (formValidation()) {
      try {
        const priceValue = addService.price.replace(/[^0-9.]/g, '');
        let hours =addService.hours == undefined || addService.hours == "" ? "0":addService.hours;
        let minutes =addService.minutes ==undefined || addService.minutes ==""?"0":addService.minutes
        const serviceObj = {
          service: addService.service,
          price: priceValue,
          hours: hours,
          minutes: minutes,
          businessTypeId: JSON.parse(typeId),
          inventory: addService.inventory,
        };
        if (tokenResponse && serviceObj) {
          const response = await businessService.additionalBusinessService(
            serviceObj,
            tokenResponse
          );
          console.log(response,":::::::::::::::::::")
          if (response.status == 200) {
            props.getUserService(tokenResponse);
            createNotification("success", "Service Add succesfully");
            setShow(false);
            props.setOpenServicesModel(false)
            setAddService("");
          
          } else {
            createNotification("error", response.message);
          }
        //   props.getServiceByUser(tokenResponse);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    // props.getServiceByUser();
  };


  const handleCloseOnCloseButton = () => {
    props.setOpenServicesModel(false);
    setError([])
    setAddService({ ...addService, price: "", service: "",hours:"",minutes:"", inventory: [], });  //reset inventory
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "price") {
      let priceValue = value.replace(/[^0-9.]/g, '');
      setAddService({
        ...addService,
        [name]: `$${priceValue}`,
      });
    } else {
      setAddService({
        ...addService,
        [name]: value,
      });
    }
  };

  //Update inventory fields
  const handleInventoryChange = (index, e) => {
    const { name, value } = e.target;
    const newInventory = [...addService.inventory];
    newInventory[index] = { ...newInventory[index], [name]: value };
    setAddService({ ...addService, inventory: newInventory });
  };

  //Add new inventory item
  const addInventoryItem = () => {
    setAddService({
      ...addService,
      inventory: [
        ...addService.inventory,
        {
          productName: "",
          price: "",
          inStock: "",
          servicesUsedIn: "",
          estUses: "",
        },
      ],
    });
  };

  //Remove inventory item
  const removeInventoryItem = (index) => {
    const newInventory = addService.inventory.filter((_, i) => i !== index);
    setAddService({ ...addService, inventory: newInventory });
  };

  
  return (
    <>
    
      <Modal
        show={props.openServiceModel}
        className="add_service_modal"
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
              disabled={freeService}
            />
            <span className="form-error">{error.price}</span>
          </div>
          <div className="free_service">
            <Form.Check
              type="checkbox"
              id="freeService"
              label="Free Service"
              name="free_service"
              checked={freeService}
              onChange={(e) => {
                if(freeService === false){
                  setAddService({
                    ...addService,
                    ["price"]: `$0`,
                  });
                }
                setFreeService(!freeService);
              }}
            />
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

          //Inventory Section
          <div className="popup-form-box mt-4">
            <label className="form-label">Inventory Used in This Service</label>
            {addService.inventory.map((item, index) => (
              <div
                key={index}
                style={{ marginBottom: "16px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
              >
                <input
                  type="text"
                  name="productName"
                  placeholder="Product Name"
                  className="input1 mb-2"
                  value={item.productName}
                  onChange={(e) => handleInventoryChange(index, e)}
                />
                <span className="form-error">{error[`inventoryProductName${index}`]}</span>

                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  className="input1 mb-2"
                  value={item.price}
                  onChange={(e) => handleInventoryChange(index, e)}
                />
                <input
                  type="number"
                  name="inStock"
                  placeholder="In Stock"
                  className="input1 mb-2"
                  value={item.inStock}
                  onChange={(e) => handleInventoryChange(index, e)}
                />
                <input
                  type="text"
                  name="servicesUsedIn"
                  placeholder="Services Product Used In"
                  className="input1 mb-2"
                  value={item.servicesUsedIn}
                  onChange={(e) => handleInventoryChange(index, e)}
                />
                <input
                  type="number"
                  name="estUses"
                  placeholder="Estimated Uses"
                  className="input1 mb-2"
                  value={item.estUses}
                  onChange={(e) => handleInventoryChange(index, e)}
                />
                <button
                  type="button"
                  onClick={() => removeInventoryItem(index)}
                  className="btn btn-sm btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInventoryItem}
              className="btn btn-sm btn-outline-primary"
            >
              + Add Inventory Item
            </button>
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
