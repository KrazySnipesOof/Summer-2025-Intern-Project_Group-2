import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import BisiLogo from "../assets/img/bisi_logo.png";
const EmailModal = ({ handleClose, show ,  ending,  description1 ,  description2 }) => {
  return (
    <>
      <Modal show={show} className="email-modal" onHide={handleClose}>
        <div className="email-template-modal">
          <Modal.Body>
            <div className="email-modal-wrap">
              <Button className="closebtn" onClick={handleClose}>
                <MdClose />
              </Button>
              <div className="email-content">
                <div className="logobar">
                  <img src={BisiLogo} alt="icon" />
                </div>
                <div className="email-user-detail">
                  <h2>user name</h2>
                  <div className="email-paragraph">
                    <p>{description1 != "" ? description1 : "Paragraph 1" }</p>
                    <p>{description2 != "" ? description2 : "Paragraph 2"}</p>
                  </div> 
                </div>
                <div className="email-service-list">
                  <ul>
                    <li>
                      <span className="service-name">Service:</span>
                      <span className="service-value">All Service</span>
                    </li>
                    <li>
                      <span className="service-name">Date:</span>
                      <span className="service-value">Tue May 22 2024</span>
                    </li>
                    <li>
                      <span className="service-name">Time:</span>
                      <span className="service-value">11:00:AM</span>
                    </li>
                    <li>
                      <span className="service-name">Duration:</span>
                      <span className="service-value">2 hour 0 minutes</span>
                    </li>
                    <li>
                      <span className="service-name">Amount Paid:</span>
                      <span className="service-value">UnPaid</span>
                    </li>
                    <li>
                      <span className="service-name">Status</span>
                      <span className="service-value">Confirmed</span>
                    </li>
                  </ul>
                </div>
                <div className="email-signature">
                  <p>{ending != "" ? ending : "Footer Signature"}</p>
                </div>
                <div className="poweredby">
                Powered By <a href="https://bisiblvd.com/">Bi$i Blvd</a> 
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default EmailModal;
