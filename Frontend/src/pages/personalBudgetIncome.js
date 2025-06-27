import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Tabs, Tab } from "@material-ui/core";
import { MdHome } from "react-icons/md";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { Container, Breadcrumb } from "react-bootstrap";
import Housing from "../components/badgetForm/housing";
import Transportation from "../components/badgetForm/transportation";
import Household from "../components/badgetForm/houseHold";
import Discretionary from "../components/badgetForm/discretionary";
import Loanpayment from "../components/badgetForm/loanPayment";
import PersonalInsurance from "../components/badgetForm/personalInsurance";
import CompanyExpenses from "../components/badgetForm/companyExpenses";
import Summary from "../components/badgetForm/summary";
import HeaderTop from "../components/headerTop";
import DashboardTopMenu from "../components/dashboardMenu";
import { useSelector } from "react-redux";
import {
  savePersonalBudgetAction,
  getPersonalBudgetAction,
} from "../services/commonService";

const HorizontalLinearStepper = ({
  notificationCount,
  setNotificationCount,
}) => {
  const navigate = useNavigate();
  const [incomeEdit, setIncomeEdit] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenResponse = useSelector((state) => state.auth.token);

  
  useEffect(() => {
    const getPersonalBudget = async () => {
      const response = await getPersonalBudgetAction(tokenResponse);
      if (response && response.personalBudget) {
        let personalBudget = response.personalBudget;
        if (personalBudget.discretionary) {
          setDiscretionary(personalBudget.discretionary);
        }
        if (personalBudget.houseHold) {
          sethouseHold(personalBudget.houseHold);
        }
        if (personalBudget.housing) {
          setHousing(personalBudget.housing);
        }
        if (personalBudget.loanPayments) {
          setLoanPayments(personalBudget.loanPayments);
        }
        if (personalBudget.personalInsurance) {
          setPersonalInsurance(personalBudget.personalInsurance);
        }
        if (personalBudget.transportation) {
          setTransportation(personalBudget.transportation);
        }
        if (personalBudget.companyExpenses) {
          setCompanyExpenses(personalBudget.companyExpenses);
        }
      }
    };
    
    if (searchParams.get("summery") !== null) {
      setActiveStep(7);
    }
    getPersonalBudget();
  }, [tokenResponse, searchParams]);

  useEffect(() => {
    if (activeStep === steps.length) {
      navigate("/dashboard");
    }
  }, [activeStep, navigate]);

  const loginStatus = () => {
    navigate("/dashboard");
  };
  let [housing, setHousing] = React.useState({
    mortgage: "",
    propertyTax: "",
    homeMaintenance: "",
    homeowerInsurance: "",
    electric: "",
    gas: "",
    water: "",
    cable: "",
    talephone: "",
    other: "",
  });

  let [transportation, setTransportation] = React.useState({
    autoPayment: "",
    autoInsurance: "",
    transportationGas: "",
    maintenance: "",
    LicenseRegistration: "",
    ParkingTollBusTrain: "",
    Others: "",
  });

  let [houseHold, sethouseHold] = React.useState({
    groceries: "",
    personalCare: "",
    ClothingDryCleaning: "",
    domesticHelp: "",
    professionaldues: "",
    dependentChildCare: "",
    educationSchool: "",
    cashAllowances: "",
    others: "",
  });
  let [loanPayments, setLoanPayments] = React.useState({
    creditCardPayment: "",
    otherLoanPayment: "",
    savingInvesting: "",
    others: "",
  });

  let [personalInsurance, setPersonalInsurance] = React.useState({
    healthInsurance: "",
    lifeInsurance: "",
    disabilityIncomeInsurance: "",
    healthCareInsurance: "",
    medicalDentalVisionDrug: "",
    others: "",
  });

  let [discretionary, setDiscretionary] = React.useState({
    diningOut: "",
    recreationClubDues: "",
    moviesSportingEvents: "",
    hobbies: "",
    vacationTravel: "",
    childCare: "",
    giftContributions: "",
    others: "",
  });
  let [companyExpenses, setCompanyExpenses] = React.useState({
    rent: "",
    companyGas: "",
    companyWater: "",
    electricity: "",
    cellular: "",
    internet: "",
    marketing: "",
  });
  const handleHousingchange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setHousing({
        ...housing,
        [name]: value,
      });
    }
  };

  const handleTransportationChange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setTransportation({
        ...transportation,
        [name]: value,
      });
    }
  };

  const handleHouseHoldonChange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      sethouseHold({
        ...houseHold,
        [name]: value,
      });
    }
  };

  const handleLoanPaymentsonChange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setLoanPayments({
        ...loanPayments,
        [name]: value,
      });
    }
  };

  const handlePersonalInsuranceonChange = (e) => {
    const { name, value } = e.target;

    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setPersonalInsurance({
        ...personalInsurance,
        [name]: value,
      });
    }
  };
  const handleDiscretionaryonChange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setDiscretionary({
        ...discretionary,
        [name]: value,
      });
    }
  };
  const handleCompanyExpensesonChange = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setCompanyExpenses({
        ...companyExpenses,
        [name]: value,
      });
    }
  };

  const savePersonalBudget = async (data) => {
    try {
      await savePersonalBudgetAction(data, tokenResponse);
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };
  
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let dataObj = {
      housing: housing,
      transportation: transportation,
      houseHold: houseHold,
      loanPayments: loanPayments,
      personalInsurance: personalInsurance,
      discretionary: discretionary,
      companyExpenses: companyExpenses,
    };
    if (activeStep === 7) {
      let totalMonthlyIncome = 0;
      let totalAnnualIncome = 0;
      let totalMonthlyDiscretionary = 0;
      let totalAnnualDiscretionary = 0;
      let totalMonthlyCompanyExpenses = 0;
      let totalAnnualCompanyExpenses = 0;
      let totalMonthlyHouseHold = 0;
      let totalAnnualHouseHold = 0;
      let totalMonthlyHousing = 0;
      let totalAnnualHousing = 0;
      let totalMonthlyLoanPayments = 0;
      let totalAnnualLoanPayments = 0;
      let totalMonthlyPersonalInsurance = 0;
      let totalAnnualPersonalInsurance = 0;
      let totalMonthlyTransportation = 0;
      let totalAnnualTransportation = 0;
      let netMonthlyExpense = 0;
      let netAnnualExpense = 0;
      let netMonthlyRemainings = 0;
      let netAnnualRemainings = 0;
      let netMonthly = 0;
      let netYearly = 0;
      for (const [key, value] of Object.entries(discretionary)) {
        totalMonthlyDiscretionary =
          Number(totalMonthlyDiscretionary ? totalMonthlyDiscretionary : 0) +
          Number(value ? value : 0);
      }
      if (totalMonthlyDiscretionary) {
        totalAnnualDiscretionary = totalMonthlyDiscretionary * 12;
      }
      for (const [key, value] of Object.entries(companyExpenses)) {
        totalMonthlyCompanyExpenses =
          Number(
            totalMonthlyCompanyExpenses ? totalMonthlyCompanyExpenses : 0
          ) + Number(value ? value : 0);
      }
      if (totalMonthlyCompanyExpenses) {
        totalAnnualCompanyExpenses = totalMonthlyCompanyExpenses * 12;
      }
      for (const [key, value] of Object.entries(houseHold)) {
        totalMonthlyHouseHold =
          Number(totalMonthlyHouseHold ? totalMonthlyHouseHold : 0) +
          Number(value ? value : 0);
      }
      if (totalMonthlyHouseHold) {
        totalAnnualHouseHold = totalMonthlyHouseHold * 12;
      }
      for (const [key, value] of Object.entries(housing)) {
        totalMonthlyHousing =
          Number(totalMonthlyHousing ? totalMonthlyHousing : 0) +
          Number(value ? value : 0);
      }
      if (totalMonthlyHousing) {
        totalAnnualHousing = totalMonthlyHousing * 12;
      }
      for (const [key, value] of Object.entries(loanPayments)) {
        totalMonthlyLoanPayments =
          Number(totalMonthlyLoanPayments ? totalMonthlyLoanPayments : 0) +
          Number(value ? value : 0);
      }
      if (totalMonthlyLoanPayments) {
        totalAnnualLoanPayments = totalMonthlyLoanPayments * 12;
      }
      for (const [key, value] of Object.entries(personalInsurance)) {
        totalMonthlyPersonalInsurance =
          Number(
            totalMonthlyPersonalInsurance ? totalMonthlyPersonalInsurance : 0
          ) + Number(value ? value : 0);
      }
      if (totalMonthlyPersonalInsurance) {
        totalAnnualPersonalInsurance = totalMonthlyPersonalInsurance * 12;
      }
      for (const [key, value] of Object.entries(transportation)) {
        totalMonthlyTransportation =
          Number(totalMonthlyTransportation ? totalMonthlyTransportation : 0) +
          Number(value ? value : 0);
      }
      if (totalMonthlyTransportation) {
        totalAnnualTransportation = totalMonthlyTransportation * 12;
      }
      netMonthlyExpense =
        totalMonthlyDiscretionary +
        totalMonthlyHouseHold +
        totalMonthlyHousing +
        totalMonthlyLoanPayments +
        totalMonthlyPersonalInsurance +
        totalMonthlyTransportation;
      netAnnualExpense = netMonthlyExpense * 12;
      netAnnualRemainings = netMonthlyRemainings * 12;
      netMonthly = netMonthlyExpense + totalMonthlyCompanyExpenses;
      netYearly = netAnnualExpense + totalAnnualCompanyExpenses;
      let sumObj = {
        totalMonthlyDiscretionary,
        totalAnnualDiscretionary,
        totalMonthlyCompanyExpenses,
        totalAnnualCompanyExpenses,
        totalMonthlyHouseHold,
        totalAnnualHouseHold,
        totalMonthlyHousing,
        totalAnnualHousing,
        totalMonthlyLoanPayments,
        totalAnnualLoanPayments,
        totalMonthlyPersonalInsurance,
        totalAnnualPersonalInsurance,
        totalMonthlyTransportation,
        totalAnnualTransportation,
        netMonthlyExpense,
        netAnnualExpense,
        netMonthlyRemainings,
        netAnnualRemainings,
        netMonthly,
        netYearly,
      };

      dataObj.summaryObject = sumObj;
    }

    savePersonalBudget(dataObj);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleNextGoals = () => {
    navigate("/Goals");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const editclick = () => {
    setIncomeEdit(true);
  };
  const steps = [
    {
      label: "Housing",
      subheading: "Fill Housing form",
      description: (
        <Housing housing={housing} handleHosuing={handleHousingchange} />
      ),
    },
    {
      label: "Transportation",
      subheading: "Fill Transportation form",
      description: (
        <Transportation
          transportation={transportation}
          handletransPort={handleTransportationChange}
        />
      ),
    },
    {
      label: "Household",
      subheading: "Fill Household form",
      description: (
        <Household
          houseHold={houseHold}
          handleHouseHold={handleHouseHoldonChange}
        />
      ),
    },
    {
      label: "Loan Payments",
      subheading: "Fill Loan Payments form",
      description: (
        <Loanpayment
          loanPayments={loanPayments}
          handleLoanPayment={handleLoanPaymentsonChange}
        />
      ),
    },
    {
      label: "Personal Insurance",
      subheading: "Fill Personal Insurance form",
      description: (
        <PersonalInsurance
          personalInsurance={personalInsurance}
          handlePersonalInsurence={handlePersonalInsuranceonChange}
        />
      ),
    },
    {
      label: "Discretionary",
      subheading: "Fill Discretionary form",
      description: (
        <Discretionary
          discretionary={discretionary}
          handleDiscretionary={handleDiscretionaryonChange}
        />
      ),
    },
    {
      label: "Company Expenses",
      subheading: "Fill Company Expenses form",
      description: (
        <CompanyExpenses
          companyExpenses={companyExpenses}
          handleCompanyExpenses={handleCompanyExpensesonChange}
        />
      ),
    },
    {
      label: "Summary",
      subheading: "Submit Summary",
      description: (
        <Summary
          housing={housing}
          houseHold={houseHold}
          transportation={transportation}
          loanPayments={loanPayments}
          personalInsurance={personalInsurance}
          discretionary={discretionary}
          companyExpenses={companyExpenses}
          setActiveStep={setActiveStep}
        />
      ),
    },
  ];


  return (
    <div className="budget-form-wrapper">
    <HeaderTop notificationCount={notificationCount}
       setNotificationCount={setNotificationCount} />
   <DashboardTopMenu />
   <div className="Personal_budget_income_wrapper  ds-layout-wrapper">
     <Container>
       <div className="ds-wrapper">
         <div className="breadcurm-bar">
           <div className="bdbar-box">
             <h2>
               Welcome <b>Bisi Blvd</b>
             </h2>
             <Breadcrumb>
               <Breadcrumb.Item>
                 <MdHome />
               </Breadcrumb.Item>
               <Breadcrumb.Item active>To do</Breadcrumb.Item>
             </Breadcrumb>
           </div>
         </div>
         <div className="layout-content-wrapper">
           <div className="main-heading">
             <h1>Personal Budget Income</h1>
             <p>Follow these simple steps to complete your budget.</p>
           </div>
           <div className="budget-income-form">
             {activeStep === steps.length - 1 ? (
               <span></span>
             ) : (
               <div className="budget-menu-list horizontal-tabs">
                <Tabs
                  value={activeStep}
                  onChange={(e, newValue) => setActiveStep(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="budget steps"
                >
                  {steps.map((step, index) => (
                    <Tab key={step.label} label={step.label} />
                  ))}
                </Tabs>
              </div>
             )}
             <div className="budget-content-form">
               <div className="budget-form-heading">
                 <div className="budget-stepvalue">
                   <span>Step {activeStep + 1}/8</span>
                 </div>
               </div>
               <div className="steper-form">
                 {steps[activeStep].description}
               </div>
               {activeStep === steps.length ? (
                 <span>Redirecting...</span>
               ) : (
                 <div className="stepbtn btm-stepbtn prt-bugf-btn">
                   {activeStep > 0 ? (
                     <Button
                       className="bkbtn"
                       // disabled={activeStep === 0}
                       onClick={handleBack}
                     >
                       <BsChevronDoubleLeft />
                       Back
                     </Button>
                   ) : null}
                   <div className="submitbtn">
                     <Button className="nextbtn" onClick={handleNext}>
                       {activeStep === steps.length - 1 ? "Submit" : "Next"}{" "}
                       <BsChevronDoubleRight />
                     </Button>

                     {activeStep === steps.length - 1 && (
                       <Link to="/Goals" style={{ textDecoration: "none" }}>
                          <Button className="submit-btn" onClick={handleNextGoals}>
                            Submit and go to My-Goals
                          </Button>
                       </Link>
                     )}
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
     </Container>
   </div>
 </div>
  );
};

export default HorizontalLinearStepper;
