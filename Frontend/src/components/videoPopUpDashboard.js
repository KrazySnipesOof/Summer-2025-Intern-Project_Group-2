import React from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { Button } from "react-bootstrap";
import ReactPlayer from "react-player";

const VideopopupDashboard = (props) => {
  const [modalIsOpen, setIsOpen] = React.useState(props.show);
  const closeModal = async () => {
    props.setShow(false);
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

export default VideopopupDashboard;
