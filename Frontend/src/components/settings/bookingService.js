import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { BiEdit } from "react-icons/bi";
import { useSelector } from "react-redux";
import Multiselect from "multiselect-react-dropdown";
import * as businessService from "../../services/businessServices";
import { createNotification } from "../../helper/notification";
import { BsChevronDoubleRight } from "react-icons/bs";
import * as bookingService from "../../services/bookingServices";
import { Rings } from "react-loader-spinner";
import Settingserviceedit from "./settingServiceEdit";
import { AddServiceModal } from "../../modals/addServices";
import { BsPlusCircle } from "react-icons/bs";

const BookingService = () => {

  const [error, setError] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceSetting, setServiceSetting] = useState([]);
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [userfilterData, setUserFilterData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [editItemId, setEditItemId] = useState(null);
  const [editprice, setEditPrice] = useState("");
  const [editServiceHours, setEditServiceHours] = useState("");
  const [editServiceMinute, setEditServiceMinute] = useState("");
  const [priceid, setPriceID] = useState(null);
  const [input_price, setInput] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [warning,setWaning]=useState(false)
  const [inputTime,setInputTime]=useState(false)
  const [inputminute,setInputMinute]=useState(false)
  const [priceloading,setPriceLoading]=useState(false)
  
  const [ openServiceModel,  setOpenServicesModel] =useState(false)

  useEffect(() => {}, [rowSelection]);

  const EditShow = (itemId) => {
    setEditItemId(itemId);
    setShowModal(true);
    setInputTime(false);
    setInputMinute(false)
    setInput(false)
  };
 
  const closeeditmodel =()=>{
    setShowModal(false);
    setError([])
    setInput(false);
    setInputTime(false);
    setInputMinute(false);
  }
  useEffect(() => {
    getAdminService(reduxToken);
  }, [reduxToken]);

  useEffect(() => {
    getUserService(reduxToken);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setError([]);
    setEditPrice("");
    setEditServiceHours("")
    setEditServiceMinute("")

  };

  const getAdminService = async (reduxToken) => {
    if (reduxToken) {
      let arr = [];
      setLoader(true);
      const response = await businessService.getAdminServices(reduxToken);

      if (response?.status == 200) {
        setLoader(false);
        response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0 &&
          response?.data?.data.map((val) => {
            if (val?.service) {
              arr.push(val);
            }
          });
        setFilterData(arr);
      } else {
        setLoader(false);
      }
    }
  };

  const getUserService = async (reduxToken) => {
    if (reduxToken) {
      let arr = [];
      setLoader(true);
      const response = await businessService.getUserServices(reduxToken);
      if (response?.status == 200) {
        setLoader(false);
        response &&
          response.data &&
          response.data.data &&
          response.data.data &&
          response.data.data.length > 0 &&
          response.data.data.map((val, index) => {
            if (val?.service) {
              arr.push(val);
            }
            setUserFilterData(arr);
          });
      } else {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    getServicesSetting(reduxToken);
  }, [reduxToken]);

  const getServicesSetting = async (reduxToken) => {
    const response = await bookingService.getServicesSetting(reduxToken);

    if (response?.status == 200) {
      if (response?.data?.data?.length > 0) {
        setServiceSetting(response?.data?.data[0].service);
        let check_warning = response?.data?.data[0].service.filter((obj) => {
          return obj.price === 0;
        });
        if(check_warning?.length>0){
          setWaning(true)
        } else{ setWaning(false) } 
        const data1 = response?.data?.data[0].service.filter(
          (obj) => obj.serviceId.role === 1
        );
        const serviceIds1 = data1.map((item) => item.serviceId);
        setItems(serviceIds1);
        const data2 = response?.data?.data[0].service.filter(
          (obj) => obj.serviceId.role === 2
        );
        const serviceIds2 = data2.map((item) => item.serviceId);
        setItems2(serviceIds2);
      }
    } else {
      console.log("error");
    }
  };
  const handleSelectAdmin = (selectedList, selectedItem) => {
    setItems(selectedList);
  };
  const handleRemoveAdmin = (selectedList, removedItem) => {
    setItems(selectedList);
  };
  const handleSelectUser = (selectedList, index) => {
    setItems2(selectedList);
  };
  const handleRemoveUser = (selectedList, removedItem) => {
    setItems2(selectedList);
  };


  const handleSubmitService = async () => {
   
    let SelectedServicessArr = [
      ...items.map((item) => item._id),
      ...items2.map((item) => item._id),
    ];

  

    const obj = {
      service: SelectedServicessArr,
    };

    const Validation = () => {
      let err = {};
      let isValid = true;

      if (SelectedServicessArr.length == 0) {
        err["service"] = "Please select atleast one service";
        isValid = false;
      }

      setError(err);
      return isValid;
    };

    if (Validation()) {

      setIsLoading(true);
      const response = await businessService.createServiceSetting(
        obj,
        reduxToken
      );

      if (response.status == 200) {
        
        createNotification("success", response?.data?.message);
        getServicesSetting(reduxToken);
      }
      setTimeout(function() {
        setIsLoading(false);
      }, 2000)
     
    }
  };
  

  const handleSubmitPrice = async () => {

    let service = serviceSetting
      ?.filter((item) => item._id === editItemId)
      .map((item) => {
        return {
          price: item.price,
          serviceTime: item.serviceTime,
        };
      });

    const obj = {
      id: input_price ? priceid : editItemId,
      price: input_price ? editprice : service[0].price,
      serviceHours:inputTime? editServiceHours ? editServiceHours :service[0].serviceTime?.hours :  service[0].serviceTime?.hours,
      serviceMinutes:inputminute? editServiceMinute?editServiceMinute:service[0].serviceTime?.minutes : service[0].serviceTime?.minutes
    };


    const Validation = () => {

      let isValid = true;
      let err = {};
      if (obj.price === "") {
        err["price"] = "Price is required for this service";
        isValid = false;
      } else if (obj.price === 0) {
        err["price"] = "Service price is required";
        isValid = false;
      } 

      if(obj.serviceHours == "0" && obj.serviceMinutes =="0"){
       err["hours"] ="Service Time can not be 0"
       isValid = false;
      }

      setError(err)
      return isValid;
    };


    if (Validation()) {

      setPriceLoading(true);
      setShowModal(true);
      const response = await businessService.updateServiceSetting(
        obj,
        reduxToken
      );

      if (response.status == 200) {
        setPriceLoading(false);
        setShowModal(false);
        createNotification("success", response?.data?.message);
        getServicesSetting(reduxToken);
      }
      
  
    }
  };
  const serviceSettingData = () => {
    const serviceSettingListData =
    serviceSetting &&
    serviceSetting.length > 0 &&
    serviceSetting?.map((item,index) => {
        
        return (
          <>
                          <tr key={item.id}>
                            <td>{item?.serviceId?.service}</td>
                            <td>
                              <p>${item.price}</p>
                              <span className="error">
                              </span>
                            </td>
                            <td>{`${item?.serviceTime?.hours} hour ${item?.serviceTime?.minutes} minutes`}</td>
                            <td>
                              <div className="action-btn">
                                <Button className="border-0" onClick={() => EditShow(item._id)} style={{backgroundColor:"#00573f"}}>
                                  <BiEdit />
                                </Button>
                              </div>
                            </td>
                          </tr>
                  </>
        );
      });
    return serviceSettingListData;
  };
  const serviceListData = () => {
    const serviceSettingListViewData =
    serviceSetting &&
                serviceSetting.length > 0 &&
                serviceSetting.map((item,index) => {
        
        return (
          <>
              {(
                  item._id === editItemId ? (
                    <Settingserviceedit
                      key={item.id}
                      item={item}
                      setEditPrice={setEditPrice}
                      setEditServiceHours={setEditServiceHours}
                      setEditServiceMinute={setEditServiceMinute}
                      errors={error.price}
                      timeerror ={error.hours}
                      setPriceID={setPriceID}
                      editprice={editprice}
                      setInput={setInput}
                      setInputTime={setInputTime}
                      setInputMinute={setInputMinute}
                    />
                  ) : (
                    ""
                  )
                )}
                  </>
        );
      });
    return serviceSettingListViewData;
  };

  const ServiceModel = () =>{
    setOpenServicesModel(true)
  }
 

  return (
    <>
      {loader ? (
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
        <div className="service-form">
          <div className="user-information-desc">
            <p>
              <b>Service Setting:</b> Use this section to choose the services
              you'd like displayed on your booking link.
            </p>
          </div>
          <h1>Select Service For Booking Form</h1>
          <div className="bkservice">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Admin Service</Form.Label>

                <Multiselect
                  options={filterData}
                  selectedValues={items}
                  onSelect={handleSelectAdmin}
                  onRemove={handleRemoveAdmin}
                  displayValue="service"
                  className="input-control multiselect"
                  name="genres"
                />
              </Form.Group>
             {warning && <span className="error">{"Please Edit admin Service to avoid loss"}</span>}

              <Form.Group className="mb-3">
                <div className="heading  d-flex justify-content-between">
                <Form.Label>Your Service</Form.Label> 
             <div className="add-ad-service d-flex justify-content-end align-items-center">
             <h3>add additional service </h3>
             <Button
        onClick={ServiceModel}
        // disabled={props.loader == true ? props.loadDisabled : props.disabledBtn}
      >
        <BsPlusCircle />
      </Button>
              </div>    
        </div>
                <AddServiceModal
                openServiceModel={openServiceModel}
                setOpenServicesModel={setOpenServicesModel}
         getUserService={getUserService}
        />
                <Multiselect
                  options={userfilterData}
                  selectedValues={items2}
                  onSelect={handleSelectUser}
                  onRemove={handleRemoveUser}
                  displayValue="service"
                  className="input-control multiselect"
                  name="genres"
                  value={items2}
                />
              </Form.Group>
              <span className="error">{error.service}</span>

             
              <div className="mt-3">
                {serviceSetting && serviceSetting.length > 0 && (
                  <Table striped bordered hover className="service-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Service Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceSettingData()}
                    </tbody>
                  </Table>
                )}
              </div>

              <div className="submitbtn">
                <Button
                  className="nextbtn h-40 mb-4"
                  disabled={isLoading}
                  onClick={handleSubmitService}
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
        
            </Form>
          </div>
        </div>
      )}
      <div>
        <Modal show={showModal} onHide={closeeditmodel}> 
          <Modal.Header>
            <Modal.Title>Edit service</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              {serviceListData()}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            <Button
            style={{backgroundColor:"#005941",borderColor:"#005941"}}
              className="nextbtn h-40"
              disabled={priceloading}
              onClick={handleSubmitPrice}
            >
              {priceloading ? (
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
                <> Edit</>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      

       
      </div>
    </>
  );
};
export default BookingService;
