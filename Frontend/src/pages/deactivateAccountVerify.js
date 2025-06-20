import React, { useState, useEffect } from "react";
import { Container} from "react-bootstrap";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import {getUserById} from "../services/authServices"
import { useParams } from "react-router-dom";
import { createNotification } from "../helper/notification";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as calenderService from "../services/calenderServices";
import HeaderTop from "../components/headerTop";


const DeactivateAccountVerify = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(true);
  const [userdata , setUserData] =  useState(true);
  const [buttonDisabled, seButtondisabled] = useState(false);
  const navigate = useNavigate();

  const getUserData = async () => {
    setLoader(true);
    const response = await getUserById(id);
    if (response?.data?.status == 0) {
        setUserData(response?.data)
        setEmail(response?.data?.email)
    }
    else if (response?.data?.status == 1 ){
      createNotification("warning", "Account is already activated");
      setTimeout(() => {
        navigate("/")
        seButtondisabled(false);
      }, 2000);
    } else {
      setLoader(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, [id]);

  const sendmail = async (e) => {

    e.preventDefault();
    seButtondisabled(true);

    if (email) {
      const response = await calenderService.resendmailwithouttoken(email);

      if (response?.data?.status == "200") {
        createNotification("success", response?.data?.message);
        setTimeout(() => {
          seButtondisabled(false);
        }, 2000);
     
      } 
      else if (response?.data?.status == "201") {
        createNotification("warning", response?.data?.message);
        setTimeout(() => {
          navigate("/")
          seButtondisabled(false);
        }, 2000);
      }
      else {
        console.log("erro");
      }
    }
  };

  return (
    <div>
      <HeaderTop
        // notificationCount={notificationCount}
        // setNotificationCount={setNotificationCount}
      />
      <div className="myaccount-wrapper">
        <Container>
          <div className="myaccount-layout layout-wrapper">
            <div className="breadcurm-bar">
              <h2>
                Welcome to <b>Bisi Blvd</b>
              </h2>
              
            </div>

            <div className="account-detail">
              <div class="account-subheading">
                <h2>Welcome Back </h2>
                <b>
                You’ll need to reactivate your account before continuing.{" "}
                  <Link
                    style={{ pointerEvents: buttonDisabled == false ? 'auto' : 'none' }}
                    onClick={sendmail}> Click here to resend.</Link>{" "}
                </b>
              </div>
            </div>
          </div>
        </Container>
      </div>
     
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default DeactivateAccountVerify;
