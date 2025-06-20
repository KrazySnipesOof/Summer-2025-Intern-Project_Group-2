import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import { Container, Button, Breadcrumb } from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import Videopopup from "../components/videoPopUp";
import { MdHome, MdModeEdit } from "react-icons/md";
import Footer from "../components/footer";
import DashboardTopMenu from "../components/dashboardMenu";
import * as userServices from "../services/userServices";
const Dashboard = ({notificationCount,setNotificationCount}) => {
  const userID = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );
  const [userStatus, setUserStatus] = useState("");
  const navigate = useNavigate();

  let id = userID;
  const getUserById = async () => {
    if(id !== undefined && id !== null){
      const response = await userServices.GetUserByID(id);
      const statusbudget = await userServices.getStatusBudjet(id)
      setUserStatus(response?.data?.loginStatus);
      console.log(statusbudget?.personalBudget?.addedBy , "in outside ")
      
      if(statusbudget?.personalBudget?.addedBy){
        console.log(statusbudget?.personalBudget?.addedBy , "in between ")
        navigate("/Personal_budget_income");
      }
     
    }
  };
  useEffect(() => {
    getUserById();
  }, [userID]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <HeaderTop notificationCount={notificationCount}
          setNotificationCount={setNotificationCount} />
      <DashboardTopMenu />
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <h2>
                  Welcome to <b>Bisi Blvd</b>
                </h2>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Budget</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <Button
                className="editbtn"
                as={Link}
                to="/Personal_budget_income?summery=1"
              >
                <MdModeEdit />
                Edit
              </Button>
            </div>
            <div className="layout-content-wrapper">
              <div className="layout-heading">
                <h1>Your Progress</h1>
              </div>
              <div className="personal-budget-form">
                <h1>Personal Budget form</h1>
                <div className="bd-start-btn">
                  <Button
                    className="start-btn"
                    as={Link}
                    to="/Personal_budget_income"
                  >
                    <span className="icon">start</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {userStatus === 0 ? <Videopopup /> : ""}
      <Footer />
    </>
  );
};

export default Dashboard;
