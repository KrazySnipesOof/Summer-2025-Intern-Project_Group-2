import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { Button } from "react-bootstrap";
import ReactPlayer from "react-player";
import * as userService from "../services/userServices";

const Videopopup = () => {
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const closeModal = async () => {
    const user = {
      loginStatus: 1,
    };
    const response = await userService.changeLoginStatus(user);
    if (response.status == 200) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="video-popup"
      >
        <div className="popup-box">
          <h2>Welcome to the first day of the rest of your PROFITABLE LIFE</h2>
          <Button className="closebtn" onClick={closeModal}>
            <MdClose />
          </Button>
          <div className="videolink">
            <ReactPlayer
              controls={true}
              width="700"
              url="https://www.youtube.com/watch?v=HoPL0DiCL-Q"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Videopopup;
