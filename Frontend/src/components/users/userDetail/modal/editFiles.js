import React, { useState ,useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { BsChevronDoubleRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createNotification } from "../../../../helper/notification";
import { Rings } from "react-loader-spinner";
import * as FilesService from "../../../../services/userFiles";
import { MdClose } from "react-icons/md";

const EditFiles = (props) => {
    const [err, setErr] = useState({});
    const tokenResponse = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(false);
    const [formFiles, setFormFiles] = useState();
    const [formsErr, setFormsErr] = useState({});
    const [userId, setUserId] = useState("");
    const [uploadedFiles , setUploadedFiles] = useState("")
    const [filesData, setFilesData] = useState({
      filesType: "",
      fileName: "",
      file: "",
    });
    const { id } = useParams();
  
    const list = [];
    const secondList = [];
    props?.inventoryList?.map((result) => {
      list?.push(result?.data);
    });
  
    useEffect(() => {
      const data1 =
        props.editDetails &&
        props.editDetails?.row &&
        props.editDetails?.row.original;
      const obj = {
        filesType: data1 && data1?.filesType,
        fileName: data1 && data1?.fileName,
        file: data1 && data1?.file,
      };
      setUserId(data1 && data1?._id);
      setFilesData(obj);
      setUploadedFiles(data1 && data1?.file)
    }, [
      props.editDetails &&
      props.editDetails.row &&
      props.editDetails.row.original,
      props.editModal,
    ]);
  
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
      if (!filesData?.filesType) {
        isValid = false;
        formError["filesType"] = "Please select filesType";
      } else if (filesData?.filesType === "Select") {
        isValid = false;
        formError["filesType"] = "Please select filesType";
      }
      if (!filesData?.fileName.trim()) {
        formError["fileName"] = "fileName is required";
        isValid = false;
      }
      if (!formFiles &&  !uploadedFiles) {
        formError["file"] = "Choose any one ";
        isValid = false;
      }
      setErr(formError);
      console.log(isValid,":::::::::validate::::::::::")

      return isValid;
    };
    const handleFileremove = (e) => {
      e.preventDefault();
      setFormFiles([]);
      setUploadedFiles("");
    };
    const handleSubmit = async (e) => {
      console.log(":::::::::updated::::::::::")

      if (validate()) {
      console.log("::::::::if:validate::::::::::")
      if(uploadedFiles){
        setIsLoading(true);
        e.preventDefault();
        const obj = {
          file:uploadedFiles,
          fileName: filesData.fileName?.trim(),
          filesType :filesData.filesType
        }
       
       
          const updated = await FilesService.UpdateFileswithnofile(userId, obj);
          if (updated?.status == 200) {
            createNotification("success", updated?.data?.message);
            props.EditModalClose();
            props.getFileslist();
            setIsLoading(false);
            setFilesData({
              fileName: "",
              filesType: "",
              file: "",
            });
          }
        }
        setIsLoading(true);
        e.preventDefault();
        const form_Data = new FormData();
        form_Data.append("file", uploadedFiles ? uploadedFiles : formFiles[0]  );
        form_Data.append("fileName", filesData.fileName?.trim());
        form_Data.append("filesType", filesData.filesType);
       
        const updated = await FilesService.UpdateFiles(userId, form_Data);
        console.log(updated,"::::::::::updated:::::::::")
        if (updated?.status == 200) {
          createNotification("success", updated?.data?.message);
          props.EditModalClose();
          props.getFileslist();
          setIsLoading(false);
          setFilesData({
            fileName: "",
            filesType: "",
            file: "",
          });
        } else {
          createNotification("error", updated?.response?.data?.message);
          props.getFileslist();
          setIsLoading(false);
        }
      }
      console.log("{+++++++++++++++++++++++++++++++++")
    };
  
    const onHide = () => {
      props.EditModalClose();
      setFilesData({
        fileName: "",
        filesType: "",
        file: "",
      });
      setErr([]);
    };
  
    const handleFormFilesChange = (e) => {
      let isValid = true;
      const formErrors = {};
  
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
  
      if (!e.target?.files || e.target?.files?.length === 0) {
        formErrors["files"] = "Please select a file.";
        isValid = false;
      }
  
      if (isValid) {
        setFormFiles(e.target.files);
        setUploadedFiles("")
      }
  
      setFormsErr(formErrors);
    };


  return (
    <Modal
    className="addproduct-wrapper"
    show={props.editModal}
    onHide={onHide}
  >
    <Modal.Header closeButton>
      <h2>Edit Files</h2>
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
                  value={filesData.filesType}
                  onChange={handleChange}
                  classNamePrefix="select"
                >
                  <option>Select</option>
                  <option value="appointmentFiles">Appointment Files</option>
                  <option value="customerfiles">Customer Files</option>
                  <option value="formsfile">Forms Files</option>
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
                value={filesData.fileName}
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
              accept=".xls,.xlsx,.txt,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFormFilesChange}
              onClick={(event) => {
                event.target.value = null;
              }}
            />
    
               <div className="imgpathurl filelinkpath">
  <p className="filelink">{uploadedFiles}</p>
  {uploadedFiles && (
    <button className="closefilelink" onClick={(e) => handleFileremove(e)}>
      <MdClose />
    </button>
  )}
</div>
                {/* );
              })} */}
            <span className="error" style={{ color: "red" }}>
              {formsErr && formsErr?.files}
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
            <>Submit</>
          )}
          <BsChevronDoubleRight />
        </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default EditFiles;
