import React, { useState ,useEffect} from "react";
import { Container } from "react-bootstrap";
import UserBreadcurm from "../userBreadcurm";
import UserProfile from "./userProfile";
import Userappointment from "./userAppointment";
import UserClasses from "./userClasses";
import UserFiles from "./userFiles";
import UserForms from "./userForms";
import UserGiftcertificate from "./userGiftcertificate";
import UserInvoice from "./userInvoice";
import UserMembership from "./userMembership";
import UserNotes from "./userNotes";
import UserProducts from "./userProducts";
import Userpackage from "./userPackage";
import Usersidenav from "./userSidenav";
import UserSoap from "./userSoap";
import SoapForm from "./modal/soapform";
import { useParams} from 'react-router-dom';
import { useSelector } from "react-redux";
import * as userBookingService from "../../../services/bookingUserService";

const UserDetail = () => {
  const params = useParams();
  const [name, setName] = useState();

  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  const reduxToken = useSelector((state) => state?.auth?.token);

  useEffect(() => {
    getUser();
  }, [reduxToken,params]);

  const getUser = async () => {
    if (reduxToken) {
      const response = await userBookingService.BookingUserGetById(
        params.id,
        reduxToken
      );
      if (response?.status == 200) {
        setName(response?.data?.data);
      } else {
      }
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabValue = urlParams.get('tab');
    
if(tabValue==5){
  setActiveTab(5)
}
else if(tabValue==8){
  setActiveTab(8)
}
  }, []);

  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <UserBreadcurm params = {params} name={name} />
          <div className="layout-content-wrapper booking-layout">
            <div className="main-heading">
              <h1>Client Details</h1>
            </div>

            <div className="user-detail-wrapper">
              <div className="user-detail">
                <Usersidenav
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                />
                {activeTab === 0 && <UserProfile />}
                {activeTab === 1 && <Userappointment />}
                {activeTab === 2 && <UserClasses />}
                {activeTab === 3 && <UserProducts />}
                {activeTab === 5 && <UserNotes />}
                {activeTab === 6 && <SoapForm params={params}/>}
                {activeTab === 7 && <UserForms />}
                {activeTab === 8 && <UserFiles />}
                {activeTab === 9 && <UserGiftcertificate />}
                {activeTab === 10 && <Userpackage />}
                {activeTab === 11 && <UserMembership />}
                {activeTab === 12 && <UserInvoice />}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default UserDetail;
