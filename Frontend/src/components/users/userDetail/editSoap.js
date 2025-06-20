import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import EditUserSoap from "./modal/editsoap";
import SoapForm from "./modal/soapform";
import { BsChevronDoubleRight } from "react-icons/bs";
import * as soapService from "../../../services/soapService";
import { FileUploader } from "react-drag-drop-files";
import { createNotification } from "../../../helper/notification";
import { useParams } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { MdClose } from "react-icons/md";
const fileTypes = ["EXCEL", "TXT", "PDF" ,"WORD"];
const MAX_COUNT = 5;

const EditSoap = (props) => {
  const id = props.id;
  const [isLoading, setIsLoading] = useState(false);
  const [soapId, setSoapId] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(true);
  const inputText = {
    level: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    additionalNotes: "",
  };
  const [data, setData] = useState(inputText);
  const [error, setError] = useState([]);

  useEffect(() => {
    getSoap(id);
  }, [id]);

  const getSoap = async (id) => {
    try {
      setLoader(true);
      const response = await soapService.GettingSoapGetById(id);
      console.log(response, "kfnkdnkxg");
      console.log("SOAP response:", response);
      if (response?.status === 200) {
        setLoader(false);
        const soapDetails = response?.data?.data;
        setData({ ...soapDetails });
        setUploadedFiles(soapDetails?.files || []);
      } else {
        setLoader(false);
        console.error("Error fetching SOAP details:", response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error fetching SOAP details:", error);
    }
  };

  const EditSoapClose = () => {
    console.log("Closing the EditUserSoap component...");
    // Add your closing logic here
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadfiles = (files) => {
    const uploaded = [...uploadedFiles]; // Create a new array to avoid mutating the state directly
    const limitExceeded = false;

    if (files.length + uploaded.length > MAX_COUNT) {
      createNotification("warning", "You can only upload a maximum of 5 files");
      return;
    }

    files.forEach((file) => {
      if (!uploaded.some((f) => f.name === file.name)) {
        // Check if the file is already in the uploadedFiles array
        uploaded.push(file);
      }
    });

    if (uploaded.length > MAX_COUNT) {
      createNotification("warning", "You can only upload a maximum of 5 files");
      setFileLimit(false);
    } else {
      setUploadedFiles(uploaded);
    }
  };

  const handleFileEvent = (file) => {
    const chosseFiles = Array.prototype.slice.call(file);
    handleUploadfiles(chosseFiles);
  };

  const Validation = () => {
    let err = {};
    let isValid = true;
    if (!data?.level && !selectedInt) {
      err["level"] = "Please select Level";
      isValid = false;
    }
    if (typeof data?.subjective === "undefined" && !data?.subjective) {
      err["subjective"] = "Subjective field is required";
      isValid = false;
    } else if (data.subjective.trim() === "") {
      err["subjective"] = "Please enter subjective";
      isValid = false;
    }
    if (typeof data?.objective === "undefined" && !data?.objective) {
      err["objective"] = " Objective field is required";
      isValid = false;
    } else if (data.objective.trim() === "") {
      isValid = false;
      err["objective"] = "Please enter objective";
    }
    if (typeof data?.assessment === "undefined" && !data?.assessment) {
      err["assessment"] = "Assessment field is required";
      isValid = false;
    } else if (data.assessment.trim() === "") {
      isValid = false;
      err["assessment"] = "Please enter assessment";
    }
    if (typeof data?.plan === "undefined" && !data?.plan) {
      err["plan"] = " Plan field is required";
      isValid = false;
    } else if (data.plan.trim() === "") {
      isValid = false;
      err["plan"] = "Please enter plan";
    }
    if (typeof data?.additionalNotes === "undefined" && !data?.additionalNotes) {
      err["additionalNotes"] = "Additional Notes field is required";
      isValid = false;
    } else if (data.additionalNotes.trim() === "") {
      isValid = false;
      err["additionalNotes"] = "Please enter Additional Notes";
    }

    setError(err);
    return isValid;
  };
  console.log(
    uploadedFiles,
    "uploadedFilesuploadedFilesuploadedFilesuploadedFiles"
  );
  const submit = async () => {
    

    if (Validation()) {
      setIsLoading(true);

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        const filename = file.originalname && file.originalname !== '' ? file.originalname : file.name;
        const fileObject = new File([file], filename, { type: file.mimetype });
        formData.append("files", fileObject);
      });
      // uploadedFiles?.map((file) => formData.append("files", file));
      formData.append("level", selectedInt ? selectedInt : data.level);
      formData.append("id", id);
      formData.append("subjective", data.subjective.trim());
      formData.append("objective", data.objective.trim());
      formData.append("assessment", data.assessment.trim());
      formData.append("plan", data.plan.trim());
      formData.append("additionalNotes", data.additionalNotes.trim());

      try {
        const added = await soapService.updateSoap(formData);
        if (added.status === 200) {
          createNotification("success", added?.data?.message);
          props.getProductList();
          props.handleModalClose();
          setUploadedFiles([]);
          setIsLoading(false);
          getSoap(id);
        } else {
          createNotification("error", added?.data?.message);
        }
      } catch (error) {
        console.error("Error updating SOAP:", error);
        createNotification("error", "An error occurred while updating SOAP.");
      }
    }
  };
  
  

  const [activeButtons, setActiveButtons] = useState([]);
  const handleButtonClick = (buttonId) => {
    if (activeButtons.includes(buttonId)) {
      setActiveButtons(activeButtons.filter((id) => id !== buttonId));
    } else {
      setActiveButtons([...activeButtons, buttonId]);
    }
  };

  const handleFileremove = (image) => {
    setUploadedFiles(uploadedFiles.filter((e) => e !== image));
  };

  const update = async () => {

    if (Validation()) {
      setIsLoading(true);
  
      const form_Data = new FormData();
      uploadedFiles.forEach((file) => form_Data.append("files", file));
      const updateLevel = selectedInt ? selectedInt : data.level;
      form_Data.append("level", updateLevel);
      form_Data.append("id", id); 
      form_Data.append("subjective", data.subjective.trim());
      form_Data.append("objective", data.objective.trim());
      form_Data.append("assessment", data.assessment.trim());
      form_Data.append("plan", data.plan.trim());
      form_Data.append("additionalNotes", data.additionalNotes.trim());
      
  
      try {
        const added = await soapService.updateSoap(form_Data); // Send form_Data instead of data
        if (added.status === 200) {
          createNotification("success", added?.data?.message);
          setUploadedFiles([]);
          setIsLoading(false);
          getSoap(); // Refresh SOAP data after successful update
        } else {
          createNotification("error", added?.data?.message);
        }
      } catch (error) {
        console.error("Error updating SOAP:", error);
        createNotification("error", "An error occurred while updating SOAP.");
      }
    }
  };
  

  
  const [selectedInt, setSelectedInt] = useState(null); 

  const handleClick = (event) => {
    setSelectedInt(Number(event.target.value));
  };

  return (
    <>
      <div className="user-soap-wrapper">
        
        {/* <SoapForm/> */}
        <h1>EDIT Soap Notes</h1>
        <div className="user-form-wrapper">
          <div className="nots-field">
            <h3>
              1. Severity/Pain Level (1 being minimal and 10 being exterme):
            </h3>

            {[...Array(10)].map((_, i) => (
              <Button
                key={i}
                value={i + 1}
                onClick={handleClick}
                className={selectedInt === i + 1 ? "active" : ""}
              >
                {i + 1}
              </Button>
            ))}

            <p>
              You selected:<b>{selectedInt ? selectedInt : data ? data.level : ""}</b> 
            </p>
            <span className="error"> {error?.level} </span>
          </div>
          <div className="nots-field">
            <h3>2. Subjective</h3>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={handleChange}
                name="subjective"
                as="textarea"
                rows={4}
                value={data ? data.subjective : ""}
                placeholder="Type your Subjective..."
              />
              <span className="error"> {error?.subjective} </span>
            </Form.Group>
          </div>
          <div className="nots-field">
            <h3>3. Objective</h3>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={handleChange}
                name="objective"
                as="textarea"
                rows={4}
                value={data ? data.objective : ""}
                placeholder="Type your Objective..."
              />
              <span className="error"> {error?.objective} </span>
            </Form.Group>
          </div>
          <div className="nots-field">
            <h3>4. Assessment</h3>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={handleChange}
                name="assessment"
                as="textarea"
                rows={4}
                value={data ? data.assessment : ""}
                placeholder="Type your Assessment..."
              />
              <span className="error"> {error?.assessment} </span>
            </Form.Group>
          </div>
          <div className="nots-field">
            <h3>5. Plan</h3>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={handleChange}
                name="plan"
                as="textarea"
                rows={4}
                value={data ? data.plan : ""}
                placeholder="Type your Plan..."
              />
              <span className="error"> {error?.plan} </span>
            </Form.Group>
          </div>
          <div className="nots-field">
            <h3>6. Additional Notes</h3>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={handleChange}
                name="additionalNotes"
                as="textarea"
                rows={4}
                value={data ? data.additionalNotes : ""}
                placeholder="Type your Additional Notes..."
              />
              <span className="error"> {error?.additionalNotes} </span>
            </Form.Group>
          </div>
          <div className="nots-field">
            <h3>7. Add Up to 5 Files</h3>
            <form
              id="file-upload-form"
              className="uploader"
              onSubmit={(e) => e.preventDefault()}
            >
              <FileUploader
                handleChange={handleFileEvent}
                name="file"
                types={fileTypes}
                multiple={true}
              />
              {uploadedFiles?.map((file) => {
                console.log(file,":::::::::::::::")
                return (
                  <div key={file} className="imgpathurl">
                    <p>{file.name}</p>
                    <button onClick={() => handleFileremove(file)}><MdClose/></button>
                  </div>
                );
              })}
            </form>
          </div>
          <div className="submitbtn">
            {visible ? (
              <Button type="button" disabled={isLoading ? true : false} onClick={update} className="nextbtn">
               
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
            ) : (
              <Button disabled={isLoading ? true : false} type="button" onClick={submit} className="nextbtn">
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default EditSoap;
