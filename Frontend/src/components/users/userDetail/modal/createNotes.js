import React , { useState  }  from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createNotification } from "../../../../helper/notification";
import { Rings } from "react-loader-spinner";
import * as NotesServices from "../../../../services/notesServices";
const CreateNotes = (props) => {
  const [err, setErr] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const tokenResponse = useSelector((state) => state.auth.token);
  const { id } = useParams();
  const [notesData, setNotesData] = useState({
    title: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotesData({
      ...notesData,
      [name]: value,
    });
  };
  const validate = () => {
    let isValid = true;
    const formError = {};
    if (!notesData?.title?.trim()) {
      formError["title"] = "Title is required";
      isValid = false;
    } 
    if (!notesData?.description?.trim()) {
      formError["description"] = "Description is required";
      isValid = false;
    } 
    setErr(formError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if(validate()){
    e.preventDefault();
    setIsLoading(true);
    const obj = {
      title: notesData.title,
      description: notesData.description,
    userId:id,
    };
    const response = await NotesServices.createNotes(obj, tokenResponse);
    if (response.status == 200) {
      createNotification("success", response?.data?.message);
      props.getNotes()
      props.NotesClose()
      setIsLoading(false);
      setNotesData({
        title: "",
        discription: "",
      })
    } else {
    createNotification("error", response?.response?.data?.message);
    }
  }
  };
  const onHide = () =>{
    props.NotesClose()
    setNotesData({
      title: "",
      discription: "",
    })
    setErr([]);
   }  
  return (
    <Modal
      className="adduser-wrapper"
      show={props.show}
      onHide={onHide}
      
    >
      <Modal.Header closeButton>
        <h2>Add Notes</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={6}>
              <Form.Group className="mb-3">
                  <Form.Label>Title </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    onChange={handleChange}
                    />
                    </Form.Group>
                    <span className="error" style={{ color: "red" }}>
                      {err && err.title}
                    </span>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    name="description"
                    onChange={handleChange}
                  />
                </Form.Group>
                <span className="error" style={{ color: "red" }}>
                      {err && err.description}
                    </span>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="submitbtn">
          <Button type="submit"  disabled={isLoading ? true : false} onClick={handleSubmit} className="nextbtn">
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
      </Modal.Footer>
    </Modal>
  );
};
export default CreateNotes;
