import React, { useState } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createNotification } from "../../../../helper/notification";
import * as productServices from "../../../../services/productServices";
import { Rings } from "react-loader-spinner";
import * as FilesService from "../../../../services/userFiles";

import { FileUploader } from "react-drag-drop-files";

const AddFiles = (props) => {
  const [err, setErr] = useState({});
  const tokenResponse = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const [formFiles, setFormFiles] = useState();
  const [formsErr, setFormsErr] = useState({});

  const { id } = useParams();

  const [filesData, setFilesData] = useState({
    filesType: "",
    fileName: "",
    file : "",
    userId: "",
  });
  const list = [];
  const secondList = [];
  props?.inventoryList?.map((result) => {
    list?.push(result.data);
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilesData({
      ...filesData,
      [name]: value,
    });
  };
  const validate = () => {
    let isValid = true;
    const formError = {};
    if (!filesData.filesType ) {
      isValid = false;
      formError["filesType"] = "Please select filesType";
    } else if (filesData.filesType === "Select") {
      isValid = false;
      formError["filesType"] = "Please select filesType";
    }
    if (!filesData.fileName.trim()) {
      formError["fileName"] = "fileName is required";
      isValid = false;
    }
    if (!formFiles) {
        formError["file"] = "Choose any one ";
        isValid = false;
      }
    setErr(formError);
    return isValid;
  };
  const handleSubmit = async (e) => {
    if (validate()) {
      setIsLoading(true);
      e.preventDefault();
      const obj = {
        fileName: filesData.fileName,
        filesType: filesData.filesType,
        file:formFiles,
        userId: id,
         };
            const form_Data = new FormData();
            form_Data.append("file", formFiles[0]);
            form_Data.append("fileName", filesData.fileName?.trim());
            form_Data.append("filesType", filesData.filesType);
            const added = await FilesService.addFiles(id, form_Data);
      // const response = await productServices.createProduct(obj, tokenResponse);
      if (added?.status == 200) {

        createNotification("success", added?.data?.message);

        props.getFileslist();
        props.AddProductClose();
        setIsLoading(false);
        setFilesData({
          fileName: "",
          price: "",
          filesType: "",
          userId: "",
        });
      } else {
        createNotification("error", added?.response?.data?.message);
        props.getFileslist();
        setIsLoading(false);
      }
    }
  };
  const onHide = () => {
    props.ProductClose();
    setFilesData({
      fileName: "",
      price: "",
      filesType: "",
      userId: "",
    });
    setErr([]);
  };
//     const submitFormfiles = (e) => {
//     formsFilesinputRef.current?.click();
//   };

const handleFormFilesChange = (e) => {
    let isValid = true;
    const formErrors = {};
  
    // Validate file type
    const allowedTypes = [
      "application/vnd.ms-excel",
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const fileType = e.target.files[0]?.type;
    if (fileType && !allowedTypes.includes(fileType)) {
      formErrors["files"] = "Invalid file type.";
      isValid = false;
    }
  
    // Validate if a file has been selected
    if (!e.target.files || e.target.files.length === 0) {
      formErrors["files"] = "Please select a file.";
      isValid = false;
    }
  
    if (isValid) {
      setFormFiles(e.target.files);
    }
  
    setFormsErr(formErrors);
  };



  return (
    <Modal className="addproduct-wrapper" show={props.show} onHide={onHide}>
      <Modal.Header closeButton>
        <h2>Add Files</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="adduser-form">
          <Form>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>File Type</Form.Label>

                  <Form.Select
                    name="filesType"
                    className="basic-multi-select"
                    onChange={handleChange}
                    classNamePrefix="select"
                  >
                    <option>Select</option>

                    <option value="appointmentFiles" >
                    Appointment Files
                      </option>
                       <option value="customerfiles" >
                       Customer Files
                      </option >
                      <option value="formsfile">
                        Forms Files
                      </option>
                 
                  </Form.Select>
                </Form.Group>
                <span className="error" style={{ color: "red" }}>
                  {err && err.filesType}
                </span>
              </Col>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
             
                  name="fileName"
                  onChange={handleChange}
                  placeholder="Please add name"
                />{" "}
                <span className="error" style={{ color: "red" }}>
                  {err && err.fileName}
                </span>
              </Form.Group>
              
               <Form.Control
                  type="file"
                  id="formsFiles"
                //   ref={formsFilesinputRef}
                  accept=".xls,.xlsx,.txt,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFormFilesChange}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
                  <span className="error" style={{ color: "red" }}>
                  {err && err.file}
                </span>
                
            </Row>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="submitbtn">
          <Button
            type="submit"
            disabled={isLoading ? true : false}
            onClick={handleSubmit}
            className="nextbtn"
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
      </Modal.Footer>
    </Modal>
  );
};
export default AddFiles;
