import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FaRegCopy } from "react-icons/fa";

const LinkPopUp = ({ setShowLink, showLink, link }) => {
  const [copy, setCopy] = useState(false);

  const closeModal = () => {
    setShowLink(false);
  };
  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={showLink}
        onRequestClose={closeModal}
        className="video-popup"
      >
        <div className="popup-box">
          <div className="userlink">
            <h2>link to add booking:- </h2>
            <div className="fulllink">
              {link}{" "}
              <span
                className="menuicon"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  setCopy(true);
                }}
              >
                <FaRegCopy />
                {copy ? "Copied" : " "}
              </span>
            </div>
          </div>

          <Button className="closebtn" onClick={closeModal}>
            <MdClose />
          </Button>
          <div className="videolink"></div>
        </div>
      </Modal>
    </>
  );
};

export default LinkPopUp;
