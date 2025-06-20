import React, { useRef, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { TbInfoOctagon } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDoubleRight } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { BiMessageRoundedError } from "react-icons/bi";
import { Row, Col, Image, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import Tooltip from 'react-bootstrap/Tooltip';
import profile from "../assets/img/profile_logo.jpg";
import * as bookingService from "../services/bookingServices";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineClear } from "react-icons/ai";
import { FadeLoader } from 'react-spinners';
import { Rings } from "react-loader-spinner";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL
const custom_name = {
  title: "title",
  description: "description",
  image: "image",
  logo: "logo",
  color: "color",
  online: "online",
  offline: "offline",
};
const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Simple tooltip
  </Tooltip>
);
export default function GenerateBooking({
  user_ID,
  imageName,
  setImageName,
  setForm,
  form,
  error,
  customValidatiom,
  isModalOpen,
  closeModal,
  setShowButon,
  handleClosemodel,
  stripeData,
  handlegernatelink,
  previewUrl,
  setError,
  setPreviewUrl,
  gernateLInk,
  setCopy,
  copy,
  callapilink,
  loader,
  loading,
  setLoading,
  warning,
  setWarning,
  handleSecretkey,
}) {
  const inputRef = useRef(null);
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const [resetbutton, setResetButton] = useState(false)

  const [editmode, setEditMode] = useState(false)


  const check_warning = localStorage.getItem("WARNING_SECRET_KEY")

  const hanleFormData = (e) => {
    const { value, name } = e.target;

    switch (name) {
      case custom_name.title:
        setForm({ ...form, title: value });
        break;
      case custom_name.description:
        setForm({ ...form, description: value });
        break;
      case custom_name.color:
        setForm({ ...form, color: value });
        break;
      case custom_name.online:
      case custom_name.offline:

        if (custom_name.online === name && !stripeData.publicKey && !stripeData.secretKey && form.online === false) {
          setWarning(true)
          localStorage.setItem("WARNING_SECRET_KEY", false);
        } else if (custom_name.online === name) {
          setWarning(false)
        }
        setForm((prevState) => ({
          ...prevState,
          [name]:
            name === "online" || name === "offline" ? !prevState[name] : value,
        }));
        break;
      case custom_name.logo:
        const selectedLogo = e.target.files[0];
        if (selectedLogo) {
          const fileSize = selectedLogo.size / (1024 * 1024);

          if (fileSize > 10) {
            toast.error("File size exceeds 10 MB. Please choose a smaller file.");
            return;
          }
          let allowedExtensions = /[\/.](jpg|jpeg|png)$/i;
          if (!allowedExtensions.exec(selectedLogo.type)) {
            toast.error(
              "Invalid file type, Please upload only jpg, png file type!"
            );
            return;
          } else {
            setForm({ ...form, logo: selectedLogo });
            const imageUrl = URL.createObjectURL(selectedLogo);
            setPreviewUrl(imageUrl);
          }
        }
        break;
      case custom_name.image:
        const selectedImage = e.target.files[0];
        if (selectedImage) {

          const fileSize = selectedImage.size / (1024 * 1024);

          if (fileSize > 10) {
            toast.error("File size exceeds 10 MB. Please choose a smaller file.");
            return;
          }
          let allowedExtensions = /[\/.](jpg|jpeg|png)$/i;
          if (!allowedExtensions.exec(selectedImage.type)) {
            toast.error(
              "Invalid file type, Please upload only jpg, png file type!"
            );
            return;
          } else {
            setForm({ ...form, image: selectedImage });
            const imageUrl = URL.createObjectURL(selectedImage);
            setImageName(imageUrl);
          }
        }
        break;
      default:
        break;
    }
  };
  const copyPerviousLink = async () => {
    const res = await gernateLInk(user_ID)
    if (res.status == 200) {
      let userId = user_ID
      const link = `${frontEndUrl}/customerbooking/${res.data}?userId=${userId}`
      navigator.clipboard.writeText(link);
      setCopy(true)
      toast.success(
        "Link is copied!"
      );
    }

  }

  const getCustomizationData = async () => {
    const obj = { userId: user_ID };
    const response = await bookingService.customizeData(obj);

    if (response?.status == 200 && response?.data?.data?.length > 0) {

      let custom_data = response.data?.data[0]

      if (custom_data._id) {
        setResetButton(true)
        setEditMode(true)
        setForm({ ...form, logo: custom_data?.logo, image: custom_data?.linkImg, color: custom_data?.Theme, title: custom_data.Title, description: custom_data.Description, online: custom_data?.Paymentonline === "true", offline: custom_data?.Paymentoffline === "true" })
        setImageName(`${imgUrl}/${custom_data?.linkImg}`)
        setPreviewUrl(`${imgUrl}/${custom_data?.logo}`)
        if (custom_data.Paymentonline === "true" && !stripeData.publicKey && !stripeData.secretKey && check_warning === "false") {
          setWarning(true)
        } else {
          setWarning(false)
        }
        if (custom_data?.logo) {

          setLoading(false)
        }
      }
    } else {
      setLoading(false)
    }

  };

  const resetModel = () => {
    setError([])
    setForm({ ...form, logo: null, image: null, color: "#000000", title: "", description: "", online: false, offline: false, })
    setPreviewUrl("")
    setImageName("")
    setCopy(false)
    setWarning(false)
    setEditMode(false)
  }

  useEffect(() => {
    if (isModalOpen) {
      getCustomizationData();
    }
  }, [isModalOpen]);

  const handleSubmit = async () => {
    if (customValidatiom()) {
      if (stripeData && stripeData.publicKey && stripeData.secretKey !== "") {
        handlegernatelink();
      }
      else if (form.online === true) {
        setShowButon(true);
        await callapilink()
      } else {
        handlegernatelink();
      }

    }
  };

  return (
    <Modal
      size="lg"
      show={isModalOpen}
      onHide={closeModal}
      className="generate_link_modal"

    >

      <Modal.Header className="d-block d-md-flex">
        <div className="generate_header">
          <h3>Generate Booking Link</h3>
          <p className="mb-0">Fill the following fields to generate a link</p>
        </div>
        <Button className="close_btn" onClick={handleClosemodel}>
          <MdClose />
        </Button>
        <div className=" text-end d-flex gap-2">
          {resetbutton && <Button onClick={resetModel} className="clearbtn border-0" style={{ backgroundColor: "#005840" }}>
            <AiOutlineClear />
          </Button>}
          {resetbutton &&
            <Button className="border-0" style={{ backgroundColor: "#005840" }} onClick={copyPerviousLink} >
              {copy ? "Copied" : "Copy"} <FaRegCopy />
            </Button>}
        </div>


      </Modal.Header>


      <Modal.Body>

        <div className="generate_content_box">
          <div className="generate_logo">
            <div className="generate_img mx-auto">

              {loading ?
                <span className="imgloader"><FadeLoader color="rgb(0, 88, 64)" /></span>
                : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    width="200"
                  />
                ) : (
                  <img
                    src={profile}
                    alt=""
                    width="200"
                  />
                )}

            </div>
            <div className="generate_upload text-center ">
              <input
                className="input_file"
                type="file"
                name="logo"
                accept="image/*"
                onChange={hanleFormData}

              />

              <div className="upload_btn text-center">
                <Button className="upload_img">
                  <AiOutlinePlus /> {editmode ? "Edit" : "Add"} Logo
                </Button>
                <span className="form-error">{error.logo}</span>
              </div>
            </div>
          </div>
          <div className="generate_change_box">
            <Row className="">
              <Col lg={6}>
                <div className="generate_change_input">
                  <Form.Group
                    className=""
                    controlId="exampleForm.ControlInput1"
                  >

                    <div className="d-md-flex justify-content-between">
                      <div>
                        <Form.Label>
                          Image

                        </Form.Label>

                        <div className="inventory-pdimg">
                          <Button onClick={handleUpload}>{editmode ? "Edit" : "Upload"} Image</Button>
                          <Form.Control
                            type="file"
                            id="new"
                            accept=".jpg, .png"
                            name="image"
                            onChange={hanleFormData}
                            ref={inputRef}
                            readOnly
                          />
                          <div className="text-end">

                          </div>
                        </div>
                      </div>
                      <div className="showimg">
                        {loading ? <span className="imgloader"><FadeLoader color="rgb(0, 88, 64)" /></span> : form.image && (
                          <img
                            src={imageName}
                            style={{ width: 179, height: 100 }}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                    <span className="form-error">{error.image}</span>
                  </Form.Group>
                </div>
              </Col>
              <Col lg={6}>
                <div className="generate_change_input">
                  <Form.Group
                    className=""
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>
                      Theme Color

                    </Form.Label>

                    <div className="input_colorpicker">
                      {<p className="m-0">{form.color}</p>}
                      <input
                        type="color"
                        id="colorPicker"
                        name="color"
                        value={form.color}
                        onChange={hanleFormData}
                      />
                    </div>
                  </Form.Group>
                  <span className="form-error">{error.color}</span>
                </div>
              </Col>
            </Row>
          </div>
          <div className="generate_update_box">
            <div className="generate_update_heading">
              <h4>Update Content</h4>
            </div>
            <div className="input_field_box mb-3">
              <Form.Group
                className=""
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  Title
                  <span
                    className="toltip-icon"
                    data-background-color="#1c5141"
                    data-tip="Maximum length of the title is 60"
                    data-place="right"
                    data-for="fool"
                  >
                    <BiMessageRoundedError />
                  </span>
                  <ReactTooltip id="fool" />

                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={60}
                  placeholder="Enter Title"
                  name="title"
                  value={form.title}
                  onChange={hanleFormData}
                />
              </Form.Group>

              <span className="form-error">{error.title}</span>
            </div>
            <div className="input_field_box mb-3">
              <Form.Group
                className=""
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  Description
                  <span
                    className="toltip-icon"
                    data-background-color="#1c5141"
                    data-tip="Maximum length of the description is 400"
                    data-place="right"
                    data-for="fool"
                  >
                    <BiMessageRoundedError />

                  </span>
                  <ReactTooltip id="fool" />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  maxLength={400}
                  placeholder="Enter Content"
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={hanleFormData}
                />


              </Form.Group>
              <span className="form-error">{error.description}</span>
            </div>

          </div>
          <div className="generate_payment_method">
            <div className="payment_head">
              <h6>
                Payment Mode

              </h6>
            </div>
            <div className="generate_payment_checkbox">
              <Form.Check
                type="checkbox"
                id="Online"
                label="Online"
                name="online"
                checked={form.online}
                onChange={hanleFormData}
              />
              <Form.Check
                type="checkbox"
                id="Offline"
                label="Offline"
                name="offline"
                checked={form.offline}
                onChange={hanleFormData}
              />
            </div>
            <span className="form-error">{error.payment}</span>

            {warning && <span className="form-error">You are not able to make payment online until you enter secret & public Key</span>}
          </div>
        </div>

      </Modal.Body>


      <Modal.Footer>
        <Button variant="primary" disabled={loader} onClick={handleSubmit}>{
          loader ? (
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
            </>) : (
            <>Submit</>
          )
        }
          <BsChevronDoubleRight />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
