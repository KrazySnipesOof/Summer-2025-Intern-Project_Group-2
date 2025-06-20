import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import * as getCompanyGoalservice from "../../services/goalCompanyBudgetService";
import UserBreadcurm from "./userBreadcurm";
import Userlist from "./userList";
import GoalsRowDisplay from "../goals/goalsRowDisplay";
const UserLayout = (props) => {
  let { id } = useParams();
  const [goalResult, setGoalResult] = useState({});
  const [companyBudget, setCompanyBudget] = useState({});
  const Id = localStorage.front_user_id;
  let getGoalById = async () => {
    const response = await getCompanyGoalservice.GoalsById(Id);
    if (response.data.data) {
      response.data &&
        response.data.data.map((val) => {
          setGoalResult(val.accurateGoals);
          setCompanyBudget(val?.companyBudget);
        });
    }
  };

  useEffect(() => {
    getGoalById();
  }, []);
  return (
    <div className="dashboard-wrapper ds-layout-wrapper">
      <Container>
        <div className="ds-wrapper">
          <UserBreadcurm />
          <div className="layout-content-wrapper booking-layout">
            <div className="main-heading">
              <h1>Your Client Database</h1>
              <p>
                Listed below are all the clients who have booked service or made
                purchases with you.
              </p>
            </div>
            <GoalsRowDisplay
              dailyGoals={
                Math.round(
                  goalResult?.monthlyGoals / 4 / companyBudget?.workPerWeek
                ) ?? 0
              }
              monthlyGoals={goalResult?.monthlyGoals ?? 0}
              yearlyGoals={companyBudget?.revenueEarn ?? 0}
              daysToWork={companyBudget?.daysToWork ?? 0}
            />
            <Userlist />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default UserLayout;
