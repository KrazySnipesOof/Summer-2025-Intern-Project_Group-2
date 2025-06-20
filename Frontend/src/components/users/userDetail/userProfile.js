import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineMail, MdOutlinePhone, MdClose } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserImage from "../../../assets/img/userImage.jpg";
import Checkinsicon from "../../../assets/img/userdetail/checkins-icon.png";
import Appointicon from "../../../assets/img/userdetail/appointmenticon.png";
import Cancleicon from "../../../assets/img/userdetail/cancleicon.png";
import Customericon from "../../../assets/img/userdetail/customericon.png";
import Noshowicon from "../../../assets/img/userdetail/noshowicon.png";
import Salesicon from "../../../assets/img/userdetail/salesicon.png";
import Visiticon from "../../../assets/img/userdetail/visiticon.png";
import EditProfileModal from "./modal/editProfile";
import * as FamilyServices from "../../../services/familyServices";
import { createNotification } from "../../../helper/notification";
import * as bookingService from "../../../services/bookingServices";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import Loader from "../../../helper/loader";
import * as userBookingService from "../../../services/bookingUserService";
import * as familyService from "../../../services/familyServices";
import moment from "moment";
import AddFamilyUser from "./modal/addFamilyMember";
import EditFamilyUser from "./modal/editFamilyMember";
import * as bookingervices from "../../../services/bookingServices";
const imgUrl = process.env.REACT_APP_IMAGE_URL
const UserProfile = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userBookingDetail, setUserBookingDetail] = useState("");
  const [editUserBookingDetail, setEditUserBookingDetail] = useState("");
  const [tagName, setTagName] = useState("");
  const [err, setErr] = useState({});
  const [bookedUserList, setBookedUserList] = useState([]);
  const [familyProfileList, setFamilyProfileList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const EditProfileClose = () => setShow(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteFamilyId, setFamilyDeleteId] = useState("");

  const [deleteShow, setDeleteShow] = useState(false);
  const [familyDShow, setFamilyDShow] = useState(false);

  const EditProfileShow = (val) => {
    setShow(true);
    setShowBtns(!showBtns);

    setEditUserBookingDetail(val);
  };
  const navigate = useNavigate();

  const reduxToken = useSelector((state) => state?.auth?.token);

  useEffect(() => {
    getUser();
  }, [reduxToken, id]);

  const getUser = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await userBookingService.BookingUserGetById(
        id,
        reduxToken
      );
      if (response?.status == 200) {
        setUserBookingDetail(response?.data?.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getUserList();
    getUserfamily();
    getServices();
  }, [reduxToken]);

  const getUserList = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await userBookingService.BookingUserList(reduxToken);
      if (response?.status == 200) {
        const filteId = response?.data?.data;
        const filteredData = filteId?.filter((item) => !id.includes(item._id));
        setBookedUserList(filteredData);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getUserfamily = async () => {
    setIsLoading(true);
    if (reduxToken) {
      const response = await familyService.get(id, reduxToken);
      if (response?.status == 200) {
        const filteId = response?.data?.data;
        const filteredData = filteId?.filter(
          (item) => !id.includes(item.users._id)
        );
        setFamilyProfileList(filteredData);
      } else {
        setIsLoading(false);
      }
    }
  }; 
  const [showUser, setShowUser] = useState(false);
  const [showFamilyedit, setFamilyUseredit] = useState(false);
  const [familyUserdata, setFamilyUserdata] = useState("");
  const [serviceState, setServiceState] = useState([]);

  const AddFamilyClose = () => setShowUser(false);
  const AddFamilyEditClose = () => setFamilyUseredit(false);
  const EditFamily = (id, name, relation) => {
    setFamilyUseredit(true);
    setShowBtns(!showBtns);
    setFamilyUserdata({
      Userid: id,
      Username: name,
      UserRelation: relation,
    });
  };
  const getServices = async (reduxToken) => {
    const response = await bookingervices.getAllAppointments(id, reduxToken);
    if (response.status == 200) {
      setServiceState(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  const DeleteFamily = async () => {
    if (reduxToken) {
      const response = await FamilyServices.deleted(deleteFamilyId, reduxToken);
      if (response?.status == 200) {
        setBookedUserList(response?.data?.data);
        setIsLoading(false);
        createNotification("success", response?.data?.message);
        getUser();
        getUserfamily();
        getUserList();
        handleFamilyClose();
      } else {
        setIsLoading(false);
        createNotification("error", response?.data?.data?.message);
      }
    }

    if (id) {
    }
  };

  const AddFamilyShow = () => setShowUser(true);

  const [showBtns, setShowBtns] = useState(false);

  const Editdeletetoggle = (i) => {
    setSelectedIndex(i);
    setShowBtns(!showBtns);
  };
  const DeleteProfile = async () => {
    const response = await bookingService.removeCustomer(deleteId);
    if (response.status === 200) {
      setDeleteShow(false);
      createNotification("success", response.data.message);
      setTimeout(() => {
        navigate(`/clients`);
      }, 3000);
    }
  };
  const handleDeleteClick = (row) => {
    setDeleteId(row?._id);
    setDeleteShow(true);
  };
  const handleFamilyDeleteClick = (id, userid) => {
    setFamilyDeleteId({ id: id, userid: userid });
    setFamilyDShow(true);
    setShowBtns(!showBtns);
  };
  const handleClose = () => setDeleteShow(false);
  const handleFamilyClose = () => setFamilyDShow(false);
  const showServicePrice = () => {
    let price = 0;
    for (let iterator of serviceState || []) {
      const test = iterator?.servicePrice ? iterator?.servicePrice : 0;
      price = test + price;
    }
    return price;
  };
  const lastVisitShow = () => {
    const test =
      serviceState &&
      serviceState
        ?.filter((item) => item?.show === true)
        .sort((a, b) => new Date(b.checkinDate) - new Date(a.checkinDate));
    if (test && test?.length > 0)
      return moment(test[0]?.checkinDate).format("MMMM DD, yyyy");
    return "No last visit";
  };

  const checkin = () => {
    const test =
      serviceState && serviceState?.filter((item) => item.show === true);
    if (test && test?.length > 0) return test?.length;
    return "No checkin";
  };

  const cancelation = () => {
    const test =
      serviceState &&
      serviceState?.filter(
        (item) => item.bookingStatus.toLowerCase() !== "Confirmed".toLowerCase()
      );
    if (test.length > 0) return test.length;
    return "No cancelation";
  };
  const showNoshow = () => {
    const test =
      serviceState && serviceState?.filter((item) => item.show === false);
    if (test && test?.length > 0) return test?.length;
    return "00";
  };

  const handlefamilyProfileList = () => {
    const familyProfileListData =
    familyProfileList?.map((result , i) => {
          return (
                      <>
                        <div className="udfm-field">
                          <div className="udfm-detail">
                            <img
                              src={
                                result?.users?.userProfileImg
                                  ? `${imgUrl}/${result?.users?.userProfileImg}`
                                  : UserImage
                              }
                              alt="icon"
                            />
                            <div className="udfm-pname">
                              <h3>{result?.users?.name}</h3>
                              <h4>{result?.relation}</h4>
                            </div>
                          </div>
                          <div className="ed-dlbtn">
                            <Button
                              className="dotsbtn"
                              onClick={() => Editdeletetoggle(i)}
                            >
                              <BsThreeDotsVertical />
                            </Button>
                            {showBtns && selectedIndex === i && (
                              <div className="edt-dropdown">
                                <Button
                                  onClick={() =>
                                    EditFamily(
                                      result?._id,
                                      result?.users?.name,
                                      result?.relation
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleFamilyDeleteClick(
                                      result?._id,
                                      result?.addedByuser
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
          );
        });
    return familyProfileListData;
  };



  return (
    <>
      <div className="user-detail-content">
        <div className="ud-box">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="ud-pimg">
                <img
                  src={
                    userBookingDetail?.userProfileImg
                      ? `${imgUrl}/${userBookingDetail?.userProfileImg}`
                      : UserImage
                  }
                  alt="userprofile"
                />
              </div>
              <div className="ud-pname-wrapper">
                <div className="ud-name">
                  <div className="ud-profilename">
                    <h2>
                      {userBookingDetail?.name
                        ? userBookingDetail?.name.charAt(0).toUpperCase() +
                        userBookingDetail?.name.slice(1)
                        : " "}
                    </h2>
                    <h4>
                      {userBookingDetail?.dob
                        ? moment(userBookingDetail?.dob).format("MMMM DD, yyyy")
                        : "No DOB added"}
                    </h4>
                  </div>
                  <div className="ud-editprofile">
                    <Button
                      className="ed-btn"
                      onClick={() => EditProfileShow(userBookingDetail)}
                    >
                      <FiEdit />
                      Edit Profile
                    </Button>
                    <Button
                      className="dl-btn"
                      onClick={() => {
                        handleDeleteClick(userBookingDetail);
                      }}
                    >
                      <RiDeleteBinLine />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="us-address">
                  <ul>
                    <li>
                      <MdOutlineMail />
                      <span>
                        {userBookingDetail?.email
                          ? userBookingDetail?.email
                          : ""}
                      </span>
                    </li>
                    <li>
                      <MdOutlinePhone />{" "}
                      <span>
                        {userBookingDetail?.phoneNumber
                          ? `${userBookingDetail.selectedCountry ? userBookingDetail?.selectedCountry?.match(/\+\d{1,}/)[0] : userBookingDetail?.selectedBenificialCountry?.match(/\+\d{1,}/)[0]} ${userBookingDetail?.phoneNumber}`
                          : ""}
                      </span>
                    </li>
                    <li>
                      <FaRegAddressCard />
                      <span>
                        {userBookingDetail?.address
                          ? userBookingDetail?.address
                          : "No address added"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ud-list-wrapper">
          <div className="ud-list-value">
            <ul>
              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Customericon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Customer Since</h4>
                  <h2>
                    {" "}
                    {moment(userBookingDetail?.createdAt).format(
                      "MMMM DD, yyyy"
                    )}
                  </h2>
                </div>
              </li>
              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Salesicon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Sales</h4>
                  <h2>${showServicePrice()}</h2>
                </div>
              </li>
              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Appointicon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Appointments</h4>
                  <h2>{serviceState?.length}</h2>
                </div>
              </li>
              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Noshowicon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>No Shows</h4>
                  <h2>{showNoshow()}</h2>
                </div>
              </li>

              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Visiticon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Last Visit</h4>
                  <h2>{lastVisitShow()}</h2>
                </div>
              </li>
              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Checkinsicon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Check-Ins</h4>
                  <h2>{checkin()}</h2>
                </div>
              </li>

              <li>
                <div className="ud-listbox">
                  <div className="udlist-icon">
                    <span className="icon">
                      <span>
                        <img src={Cancleicon} alt="Customericon" />
                      </span>
                    </span>
                  </div>
                  <h4>Cancelations</h4>
                  <h2>{cancelation()}</h2>
                </div>
              </li>
            </ul>
          </div>
          <div className="ud-pbf-wrapper">
            <div className="ud-pb-box">
              <div className="ud-family-list">
                <h2>Family</h2>
                <div className="ud-fmlist">
                  {handlefamilyProfileList()} 
                </div>
                <Button className="addfamily-btn" onClick={AddFamilyShow}>
                  <BiPlus />
                  Add Family And Friends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        show={show}
        setShow={setShow}
        getUser={getUser}
        EditProfileClose={EditProfileClose}
        editUserBookingDetail={editUserBookingDetail}
      />
      <AddFamilyUser
        showUser={showUser}
        AddFamilyClose={AddFamilyClose}
        getUser={getUser}
        bookedUserList={bookedUserList}
        getUserfamily={getUserfamily}
      />
      <EditFamilyUser
        showFamilyedit={showFamilyedit}
        EditFamilyClose={AddFamilyEditClose}
        userData={familyUserdata}
        getUser={getUser}
        getUserfamily={getUserfamily}
        showBtns={showBtns}
      />
      <Modal show={deleteShow}>
        <Modal.Header>
          <Modal.Title>Delete Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to Delete this Client?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={DeleteProfile}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={familyDShow}>
        <Modal.Header>
          <Modal.Title>Delete Family</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to Delete this Family ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFamilyClose}>
            Close
          </Button>
          <Button variant="danger" onClick={DeleteFamily}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UserProfile;
