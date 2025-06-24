import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import {
  MdStorage,
  MdOutlineSettingsSuggest,
  MdOutlinePanoramaHorizontal,
  MdPlayArrow,
  MdBookmarkAdd,
} from "react-icons/md";
import VideopopupDashboard from "./videoPopUpDashboard";
import { BsReception4 } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { Container, Button } from "react-bootstrap";
import LinkPopUp from "./linkPopUp";
import { useSelector } from "react-redux";
import { getEncryptedDataFromId, GetUserByID } from "../services/userServices";
import { createNotification } from "../helper/notification";
import { ToastContainer } from "react-toastify";
import GenerateBooking from "../modals/generateBooking";
import * as bookingService from "../services/bookingServices";
import { useDispatch } from "react-redux";
import { setActiveTabs } from "../store/action/activeTabAction";
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL

const DashboardTopMenu = (props) => {
  let authData = useSelector((state) => state.auth.user);
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [link, setLink] = useState("");
  const [showbutton,setShowButon]=useState(false)
  const [stripeData, setStripeData] = useState({
    secretKey: "",
    publicKey: "",
  });
  const [loader,setLoader] =useState(false)
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState([]);
  const [form, setForm] = useState({
    logo: null,
    image: null,
    color: "#000000",
    title: "",
    description: "",
    online: false,
    offline: false,
  });
  const [copy, setCopy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const handleVideoPlay = () => {
    setShow(true);
  };
  const [loading, setLoading]=useState(true)
  const [warning,setWarning] =useState(false)
  const dispatch =useDispatch()
 
  const handleLinkPopUp = () => {
    setIsModalOpen(true);
    setLoading(true)
    getUserById();
  };
  const hadlecloseMOdel =()=>{
    setIsModalOpen(false);
    setError([])
    setForm({...form, logo: null, image: null, color: "#000000", title: "",description: "",online: false,offline: false,})
    setPreviewUrl("")
    setImageName("")
    setCopy(false)
    setLoader(false)
    setWarning(false)
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setError([])
    setForm({...form, logo: null, image: null, color: "#000000", title: "",description: "",online: false,offline: false,})
    setPreviewUrl("")
    setImageName("")
    setCopy(false)
    setLoader(false)
    setWarning(false)
  };
const handleclodelinkmodel =()=>{
  setShowButon(false)
  setLoader(false)
}
const gernateLInk =async(userId)=>{
  const resp = await getEncryptedDataFromId(userId);
  return resp
}

  const handleNoClick = async () => {
   let response = await callapilink()

if(response.status == 200){
 
    if (userId) {

      const resp = await gernateLInk(userId)
      if (resp.status == 200) {
        setLoader(false)
        createNotification("success", "Link generated successfully");
        handleclodelinkmodel()
        hadlecloseMOdel()
        setShowLink(true);
        setForm({...form,  logo: null, image: null, color: "#000000", title: "",description: "",online: false,offline: false,})
        setLink(
          `${frontEndUrl}/customerbooking/${resp.data}?userId=${userId}`
        );
      } else {
        setShowLink(false);
        createNotification("error", "something went wrong");
      }
    }
}else{
  setLoader(false)
}

  };
 
  const  handleSecretkey = () => {
    handleclodelinkmodel()
    hadlecloseMOdel()
    setShowLink(false);
    dispatch(setActiveTabs(3))
    navigate("/setting");
  };

  const customValidatiom = () => {
    let err = { };
    let isValid = true;
    if (!form.logo) {
      err["logo"] = "Logo is required";
      isValid = false;
    }

    if (!form.image) {
      err["image"] = "Image is required";
      isValid = false;
    } 

    if (!form.title.trim()) {
      err["title"] = "Title is required";
      isValid = false;
    } 
    if (!form.description.trim()) {
      err["description"] = "Description is required";
      isValid = false;
    } 
    if (!form.offline && !form.online) {
      isValid = false;
      err["payment"] = "Select at least one payment type";
    } 
    setError(err);
    return isValid;
  };
  const callapilink =async()=>{
    setLoader(true)
    let check_box_online = (form.online)? true: false;
    let check_box_offline =(form.offline)? true :false

    const formData = new FormData();
    formData.append("logo",form.logo)
    formData.append("linkImg",form.image)
    formData.append("Title",form.title)
    formData.append("Description",form.description)
    formData.append("Theme",form.color)
    formData.append("offline",check_box_offline)
    formData.append("online",check_box_online)

    const response =await bookingService.generateLink(
    formData,
   )
  return response;
  }

  const getUserById = async () => {

    if (userId !== undefined && userId !== null) {
      const response = await GetUserByID(userId);
      setStripeData({
        secretKey: response.data.secretKey,
        publicKey: response.data.publicKey,
      });
    }
  };

  useEffect(() => {
    getUserById();
  }, [userId]);

  useEffect(() => {
    setUserId(authData?._id);
  }, [authData]);
  return (
    <div className="Dashboard-menubar">
      <ToastContainer />
      <Container>
        <div className="dashbarmenu-list">
          <div className="menulist">
            <ul>
              <li className={splitLocation[1] === "dashboard" || splitLocation[1] === "Personal_budget_income" ?  "active" : ""}>
                <Link to="/dashboard">
                  <span className="menu">
                    <span className="menuicon">
                      <MdStorage />
                    </span>
                    Budget
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "Goals" ? "active" : ""}>
                <Link to="/Goals">
                  <span className="menu">
                    <span className="menuicon">
                      <BsReception4 />
                    </span>
                    My Goals
                  </span>
                </Link>
              </li>
             
              <li className={splitLocation[1] === "booking" || splitLocation[1] === "addbooking" ? "active" : ""}>
                <Link to="/booking">
                  <span className="menu">
                    <span className="menuicon">
                      <MdOutlinePanoramaHorizontal />
                    </span>
                    Bookings
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "Calendar" ? "active" : ""}>
                <Link to="/Calendar">
                  <span className="menu">
                    <span className="menuicon">
                      <BiCalendar />
                    </span>
                    Calendars
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "clients" || splitLocation[1] === "clientdetail" ? "active" : ""}>
                <Link to="/clients">
                  <span className="menu">
                    <span className="menuicon">
                      <FaUsers />
                    </span>
                    Clients
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "Inventory"  || splitLocation[1] === "AddInventory" ? "active" : ""}>
                <Link to="/Inventory">
                  <span className="menu">
                    <span className="menuicon">
                      <Inventory2OutlinedIcon />
                    </span>
                    Inventory
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "payments" ? "active" : ""}>
                <Link to="/payments">
                  <span className="menu">
                    <span className="menuicon">
                      <PaidOutlinedIcon />
                     </span>
                    Payments
                  </span>
                </Link>
              </li>
              <li className={splitLocation[1] === "report" ? "active" : ""}>
                  <span className="menu disablemenu">
                    <span className="menuicon">
                      <ArticleOutlinedIcon />
                     
                    </span>
                    Report
                  </span>
              </li>
              <li className={splitLocation[1] === "setting" ? "active" : ""}>
                <Link to="/setting">
                  <span className="menu">
                    <span className="menuicon">
                      <MdOutlineSettingsSuggest />
                    </span>
                    Settings
                  </span>
                </Link>
              </li>
              <li className={showLink ? "active" : ""}>
                <Button
                  className="btn"
                  onClick={handleLinkPopUp}
                >
                  <span className="menu">
                    <span className="menuicon">
                      <MdBookmarkAdd/>
                    </span>
                    Generate a Link
                  </span>
                </Button>                
                <GenerateBooking
                warning={warning}
                setWarning={setWarning}
                loading={loading}
                setLoading={setLoading}
                gernateLInk={gernateLInk}
                user_ID ={userId}
                setError={setError}
                callapilink={callapilink}
                customValidatiom={customValidatiom}
                imageName={imageName}
                setImageName={setImageName}  
                form={form}
                setForm={setForm}
                error ={error}
                previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              copy={copy}
              loader={loader}
              setCopy={setCopy}
              isModalOpen={isModalOpen} handleSecretkey={handleSecretkey} closeModal={closeModal} stripeData={stripeData} handlegernatelink={handleNoClick} setShowButon ={setShowButon} handleClosemodel={hadlecloseMOdel}/>
      
              {  <Modal show={showbutton} onHide={handleclodelinkmodel}>
                  <Modal.Header closeButton onClick={()=>setShowButon(false)}>
                    <Modal.Title>Warning</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      You cannot receive payment until stripe payment key is
                      not updated
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleSecretkey}>
                      Enter Key
                    </Button>
                  </Modal.Footer>
                </Modal> }
              </li>
            </ul>
          </div>
          {showLink ? (
            <LinkPopUp
              showLink={showLink}
              setShowLink={setShowLink}
              link={link}
            />
          ) : (
            ""
          )}
          <div className="rplay-btn">
            <Button className="re-btn" onClick={handleVideoPlay}>
              <span className="icon">
                <MdPlayArrow />
              </span>
            </Button>
          </div>
        </div>
      </Container>
      {show ? <VideopopupDashboard show={show} setShow={setShow} /> : ""}
    </div>
  );
};

export default DashboardTopMenu;






