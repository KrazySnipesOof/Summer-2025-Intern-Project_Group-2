import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import { createNotification } from "../../helper/notification";
import * as calenderService from "../../services/calenderServices";
import * as bookingService from "../../services/bookingServices";
import { BsChevronDoubleRight, BsPlusLg } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import moment from "moment";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Rings } from "react-loader-spinner";
import { GetUserByID } from "../../services/userServices";
import { updateSettings, getSettings } from "../../services/emailServices";
import ReactTooltip from "react-tooltip";
import EmailImg from "../../assets/img/emailtemplate-img.png"
import EmailModal from "../../modals/email-modal";
const CustomEmail = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  let authData = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [ending, setEnding] = useState("");
  const [userId, setUserId] = useState(authData?._id);
  const [error, setError] = useState([]);
  const [unActivedata, setUnactivedata] = useState("");
  const currentTime = moment();
  const [emailModal,setEmailModal] = useState(false);
  const EmailShowModal = () => {
    setEmailModal(true)
  }
  const EmailHideModal = () => {
    setEmailModal(false)
  }
  const [formItems, setFormItems] = useState([
    {
      startDate: moment().format("ll"),
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
    fetchSettingData();
  }, []);

  async function fetchSettingData() {
    setIsLoading(true);
    const response = await getSettings();
    if (response?.status === 200) {
      let data = response?.emailSettingData;
      if (data?.description1 !== undefined) {
        setDescription1(data?.description1);
      }
      if (data?.description2 !== undefined) {
        setDescription2(data?.description2);
      }
      if (data?.endsWith !== undefined) {
        setEnding(data?.endsWith);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    setError({})
    setIsLoading(true);
    e.preventDefault();
    let err = {};
    // Check if ending is not empty
    const isEndingEmpty = ending.trim() === "";

    // Check if at least one of the descriptions contains the exact service name string
    const hasServiceName =
      description1.includes("#SERVICE_NAME#") ||
      description2.includes("#SERVICE_NAME#");

    // Check if at least one of the descriptions contains the exact date string
    const hasDate =
      description1.includes("#DATE#") || description2.includes("#DATE#");

    if (isEndingEmpty) {
      
      err["ending"] = "Footer Signature cannot be empty";
      
    }

    
    if (!hasServiceName && !hasDate) {
      
      
      err["paragraph"] = "Must include '#SERVICE_NAME#' and '#DATE#' in either Paragraph1 or Paragraph2.";
      
    }else if(!hasServiceName){
      err["paragraph"] = "Must include '#SERVICE_NAME#' in either Paragraph1 or Paragraph2.";
    }else if(!hasDate){
      err["paragraph"] = "Must include '#DATE#' in either Paragraph1 or Paragraph2.";
    }else{}

    if (Object.keys(err).length > 0) {
      // The object is not empty
      setIsLoading(false);
      setError(err)
      return  // or any other operation you want to perform
    }


    if (reduxToken) {
      const response = await updateSettings({
        description1,
        description2,
        ending,
      });
      if (response?.status === 200) {
        let data = response?.data;
        console.log(data, "11111111111111");
        createNotification("success", "Settings updated");
        setIsLoading(false);
      } else {
        createNotification("error", "Cant update");
        setIsLoading(false);
      }
    }
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
        <div className="appointment-wrapper setting-layout email-setting">
          <div className="userinvoice-list-wrap mb-4">
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <p className="mb-0"><strong>Booking Email Setting:</strong> Use this section to set your customize
                message in email.</p>
                
              </div>
              <p>
            <strong>Note:</strong> Please use these placeholders <b>#SERVICE_NAME#</b> for service name and <b>#DATE#</b> for booking
            appointment date
          </p>
          <div className="d-flex justify-content-end w-100 position-relative">
          <span className="email-btn" onClick={EmailShowModal}>Click here to see email template</span>
            {/* <ReactTooltip id="imageTooltip" class="email-template-tooltip" data-tooltip-place="bottom-start">
        <img src={EmailImg} alt="Example" />
      </ReactTooltip> */}
          </div>
          </div>
         <div className="email-description-box">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={12} className="mb-3 mb-xl-0">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Paragraph 1
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description1}
                    name="description1"
                    onChange={(e) => setDescription1(e.target.value)}
                    placeholder="Enter Paragraph1"
                    rows={3}
                    style={{ resize: "none" }}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} className="mb-3 mb-xl-0">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Paragraph 2
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description2}
                    name="description2"
                    onChange={(e) => setDescription2(e.target.value)}
                    placeholder="Enter Paragraph2"
                    rows={3}
                    style={{ resize: "none" }}
                  />
                  <span className="error"> {error.paragraph} </span>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} className="mb-3 mb-xl-0">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Footer Signature</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={ending}
                    onChange={(e) => setEnding(e.target.value)}
                    name="endswith"
                    placeholder="Enter Footer Signature"
                    rows={3}
                    style={{ resize: "none" }}
                  />
                  <span className="error"> {error.ending} </span>
                </Form.Group>
              </Col>
              <div className="submitbtn" style={{marginTop:"25px"}}>
                <Button
                  className="nextbtn"
                  disabled={isLoading ? true : false}
                  type="submit"
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
                    <>Submit</>
                  )}
                  <BsChevronDoubleRight />
                </Button>
              </div>
            </Row>
          </Form>
          </div>
        </div>
      )}
      <EmailModal ending={ending} description1={description1} description2={description2} show={emailModal} handleClose={EmailHideModal}/>
    </>
  );
};
export default CustomEmail;