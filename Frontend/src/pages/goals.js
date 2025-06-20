import React, { useState, useEffect } from "react";
import { Container, Col, Form, Row, Button, Breadcrumb } from "react-bootstrap";
import { MdHome } from "react-icons/md";
import HeaderTop from "../components/headerTop";
import UserDropDown from "../components/userService/userDropdown";
import AdminDropDown from "../components/userService/adminDropdown";
import { BsCalculator, BsFillFlagFill } from "react-icons/bs";
import { BiMessageRoundedError } from "react-icons/bi";
import Footer from "../components/footer";
import { getBusinessByUserAction } from "../services/userGoalServices";
import { BusinessServiceModal } from "../modals/businessService";
import GoalsServiceform from "../components/goals/goalsServiceForm";
import { useSelector } from "react-redux";
import { saveGoalBudgetAction } from "../services/goalCompanyBudgetService";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../helper/notification";
import { ToastContainer } from "react-toastify";
import { GoalsById } from "../services/goalCompanyBudgetService";
import * as commonService from "../services/commonService";
import DashboardTopMenu from "../components/dashboardMenu";
import ReactTooltip from "react-tooltip";
import Loader from "../helper/loader";
import GoalsRowDisplay from "../components/goals/goalsRowDisplay";
import Multiselect from "multiselect-react-dropdown";

const Goals = ({ notificationCount, setNotificationCount }) => {
  const userId = useSelector(
    (state) => state && state.auth && state.auth.user && state.auth.user._id
  );

  const [selectSErvice, setSelectServide] = useState(false);
  const idResponse = useSelector((state) => state.auth.user);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const tokenResponse = useSelector((state) => state?.auth?.token);
  let atleast = false;

  const [companyBudgetObject, setCompanyBudgetObject] = React.useState("");
  const [calculate, setCalculate] = useState(false);
  const navigate = useNavigate();
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loadDisabled, setLoadDisabled] = useState(true);
  const [calculatedgoals, setCalculatedGoals] = useState({
    yearlyClients: 0,
    monthlyClients: 0,
    weeklyClients: 0,
    hoursPerDay: 0,
  });
  let [companyBudget, setComapanyBudget] = React.useState({
    revenueEarn: "",
    workPerDay: "",
    workPerWeek: "",
    daysToWork: [],
  });
  let [monthlyGoals, setMonthlyGoals] = React.useState("");
  let [weeklyGoals, setWeeklyGoals] = React.useState("");
  let [yearlyGoals, setYearlyGoals] = React.useState("");
  let [perDaysGoals, setPerdaysGoals] = React.useState("");
  const [error, setError] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState("");
  const [error1, setError1] = useState([]);

  let [service, setService] = useState([]);
  let [serviceNew, setServiceNew] = useState([
    {
      serviceCharge: "",
      serviceHours: "",
      serviceMinute: "",
      checked: false,
    },
  ]);

  const handleCheckboxChange = (event, serviceIndex) => {
    const { value, checked } = event.target;
    let serviceArray = [...serviceNew];
    if (checked) {
      serviceArray[serviceIndex][event.target.name] =
        !serviceArray[serviceIndex][event.target.name];
      setSelectedCheckboxes([...selectedCheckboxes, value, !checked]);
    } else {
      serviceArray[serviceIndex][event.target.name] =
        !serviceArray[serviceIndex][event.target.name];
      setSelectServide(false);
      setSelectedCheckboxes(
        selectedCheckboxes?.filter((checkbox) => checkbox !== value)
      );
    }
  };

  const [serviceCount, setServiceCount] = useState([]);

  const handlecompanyBudget = (e) => {
    const { name, value } = e.target;
    const data = e.target.validity.valid ? value : undefined;
    if (data !== undefined) {
      setComapanyBudget({
        ...companyBudget,
        [name]: value,
      });
    }
  };

  const handleDaysSelected = (days) => {
    // update the daysToWork and workPerWeek in the companyBudget object
    setComapanyBudget({
      ...companyBudget,
      daysToWork: days,
      workPerWeek: days.length,
    });
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    if (companyBudget.revenueEarn) {
      monthlyGoals = Math.round(companyBudget.revenueEarn / 12);
      setMonthlyGoals(monthlyGoals);
    } else {
      console.log("error");
    }
    if (monthlyGoals) {
      let weeklyGoals = Math.round(monthlyGoals / 4);
      setWeeklyGoals(weeklyGoals);
    }
    let yearlyGoals = Math.round(monthlyGoals * 12);
    setYearlyGoals(yearlyGoals);
  }, [companyBudget.revenueEarn]);

  useEffect(() => {
    if (companyBudget.workPerWeek) {
      let daysGoals = Math.round(weeklyGoals / companyBudget.workPerWeek);
      setPerdaysGoals(daysGoals);
    }
  }, [companyBudget.workPerWeek, perDaysGoals]);

  const [atleastOne, setAtleastOne] = useState(false);

  const [totalChargeService, setTotalChargeService] = useState();

  const validation = () => {
    const service = [...serviceNew];
    let formErrors = [];
    const { revenueEarn, workPerDay, workPerWeek } = companyBudget;
    let isValid = true;
    const formError = {};
    let onlyNumbers = /^[0-9]+$/;
    if (companyBudget) {
      if (!revenueEarn) {
        isValid = false;
        formError["revenueEarn"] = "Revenue Earn is required";
      } else if (!revenueEarn.match(onlyNumbers)) {
        isValid = false;
        formError["revenueEarn"] = "Revenue Earn must be numbers only";
      }
      if (!workPerDay) {
        isValid = false;
        formError["workPerDay"] = "Work Per Day is required";
      } else if (workPerDay == "Select") {
        isValid = false;
        formError["workPerDay"] = "Work Per Day is required";
      }
      if (!workPerWeek) {
        isValid = false;
        formError["workPerWeek"] = "Work Per Week is required";
      } else if (workPerWeek == "Select") {
        isValid = false;
        formError["workPerWeek"] = "Work Per Week is required";
      }
    }

    let isAtleastOne = false;
    service?.filter((val, index) => {
      let obj = {};

      if (val.checked === true) {
        atleast = true;
        if (
          !val?.serviceHours &&
          val?.serviceHours?.length === 0 &&
          !val.serviceMinute
        ) {
          obj.serviceHours = "Service Hours is Required";
          isValid = false;
        }
        if (val.serviceHours === "0" && val.serviceMinute === "") {
          obj.serviceHours = "Service Hours shoud be greater than 0";
          isValid = false;
        }

        if (val.serviceHours === "0" && !val.serviceMinute) {
          obj.serviceHours = "Service Hours shoud be greater than 0";
          isValid = false;
        }

        if (!val.serviceCharge || val.serviceCharge.length === 0) {
          obj.serviceCharge = "Service Charge is Required";
          isValid = false;
        }
        if (val?.serviceCharge?.trim() === "") {
          obj.serviceCharge = "Service Charge is Required";
          isValid = false;
        }

        if (!isValid) {
          formErrors[index] = obj;
        }
      }
    });
    setAtleastOne(!isAtleastOne);

    setError(formError);
    setError1(formErrors);

    return isValid;
  };

  const [abc, setAbc] = useState(false);
  const serviceValidation = () => {
    const service = [...serviceNew];
    let formErrors = [];
    let sum = 0;
    let isValid = true;
    const formError = {};
    const servicelength = service.length;
    service?.filter((val, index) => {
      let obj = {};
      if (val.checked == true) {
        atleast = true;
        if (!val?.serviceHours && !val?.serviceMinute) {
          obj.serviceHours = "Service Hours is Required";
          isValid = false;
        }
        if (
          !val?.serviceHours &&
          val?.serviceHours == "" &&
          !val?.serviceMinute
        ) {
          obj.serviceHours = "Service Hours is Required";
          isValid = false;
        }

        if (!val?.serviceCharge || val?.serviceCharge?.length === 0) {
          obj.serviceCharge = "Service Charge is Required";
          isValid = false;
        }

        if (!isValid) {
          formErrors[index] = obj;
        }
      } else {
        sum += 1;
      }
    });
    if (sum == servicelength) {
      setAbc(true);
    }
    setError(formError);
    setError1(formErrors);

    return isValid;
  };

  const getServiceByUser = async () => {
    const response = await getBusinessByUserAction(tokenResponse);
    if (response && response.data) {
      setLoader(false);
      setServiceCount(response?.data?.service);
      setService(response?.data?.service);
      setCompanyBudgetObject(response?.data);
    } else {
      setLoader(false);
    }
  };

  const getGoalsBudget = async () => {
    const response = await GoalsById(userId, tokenResponse);
    if (
      response &&
      response.data &&
      response?.data?.data &&
      response?.data?.data?.length === 0
    ) {
      getBusinessByUserAction(tokenResponse).then((res) => {
        setServiceNew(res?.data?.service);
        setLoader(false);
      });
    } else {
      const res = await getBusinessByUserAction(tokenResponse);
      let Goals_Budget = response?.data?.data;
      if (res && res.data && res?.data?.service?.length > 0) {
        var finalArr = res?.data?.service?.filter((val) => {
          if (Goals_Budget[0].service.find((aVal) => aVal._id == val._id)) {
            return false;
          }
          return true;
        });
      }
      if (Goals_Budget) {
        Goals_Budget &&
          Goals_Budget?.length > 0 &&
          Goals_Budget?.map((val) => {
            setComapanyBudget(val.companyBudget);
            setPerdaysGoals(val?.accurateGoals?.perDaysGoals);
          });
      }
      let arr1 = [];

      let arr = [];

      if (Goals_Budget) {
        Goals_Budget &&
          Goals_Budget?.length > 0 &&
          Goals_Budget?.map((val, index) => {
            setCalculatedGoals(val.calculatedgoals);

            if (val?.service && val?.service?.length > 0) {
              val?.service?.map((val1, index1) => {
                return finalArr?.push(val1);
              });
            }
          });

        const res = await getBusinessByUserAction(tokenResponse);

        if (res && res?.data && res?.data?.service?.length > 0) {
          var finalArr = finalArr?.filter((val) => {
            if (!res?.data?.service?.find((aVal) => aVal?._id == val?._id)) {
              return false;
            }
            return true;
          });
        }
        const filteredData = finalArr?.filter((obj) => obj.isDeleted === false);

        setServiceNew(filteredData);
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    getGoalsBudget();
  }, [userId]);

  const getGoalsRevenueDays = async () => {
    const response = await GoalsById(userId, tokenResponse);
    if (
      response &&
      response.data &&
      response?.data?.data &&
      response?.data?.data?.length === 0
    ) {
      getBusinessByUserAction(tokenResponse).then((res) => {
        setServiceNew(res.data.service);
      });
    } else {
      let Goals_Budget = response.data.data;
      if (Goals_Budget) {
        Goals_Budget &&
          Goals_Budget?.length > 0 &&
          Goals_Budget?.map((val) => {
            setPerdaysGoals(val.accurateGoals.perDaysGoals);
          });
      }
    }
  };
  useEffect(() => {
    getGoalsRevenueDays();
  }, [userId]);

  const handleService = (e, serviceIndex) => {
    const data = e.target.validity.valid ? e.target.value : undefined;
    let serviceArray = [...serviceNew];
    if (e.target.name === "checked") {
      serviceArray[serviceIndex][e.target.name] =
        !serviceArray[serviceIndex][e.target.name];
    } else {
      serviceArray[serviceIndex][e.target.name] = e.target.value;
    }
    if (data !== undefined) {
      setServiceNew(serviceArray);
    }
  };

  const handleCalculate = async () => {
    if (validation()) {
      if (serviceValidation() && atleast) {
        setDisabledBtn(true);

        setCalculate(true);
        let arr = [];
        let arr1 = [];
        let arr2 = [];

        let revenue = parseInt(companyBudget && companyBudget.revenueEarn);
        let totalServiceHours = 0;
        parseInt(
          serviceNew &&
            serviceNew?.length > 0 &&
            serviceNew?.filter((val) => {
              if (val.checked === true) {
                return arr?.push(val);
              }
            })
        );

        parseInt(
          arr &&
            arr.length > 0 &&
            arr?.map((val) => {
              if (val.serviceHours) {
                return (totalServiceHours += parseInt(val.serviceHours));
              }
            })
        );

        let serviceHoursToMinutes = totalServiceHours * 60;
        let totalServiceMinutes = 0;
        parseInt(
          serviceNew &&
            serviceNew?.length > 0 &&
            serviceNew?.filter((val) => {
              if (val.checked == true) {
                return arr1?.push(val);
              }
            })
        );

        arr1 &&
          arr1.length > 0 &&
          arr1?.map((val) => {
            if (val.serviceMinute) {
              return (totalServiceMinutes += parseInt(val.serviceMinute));
            }
          });

        let minutesForWorkPerDay =
          companyBudget && companyBudget.workPerDay * 60;

        let TotalMinutesForServices =
          serviceHoursToMinutes + totalServiceMinutes;

        let hoursPerDay = minutesForWorkPerDay / TotalMinutesForServices;

        let totalServiceCharges = 0;
        let obj2 = {};
        serviceNew &&
          serviceNew?.length > 0 &&
          serviceNew?.filter((val) => {
            if (val.checked == true) {
              return arr2?.push(val);
            }
          });

        arr2 &&
          arr2.length > 0 &&
          arr2?.map((val) => {
            if (val.serviceCharge) {
              totalServiceCharges += parseInt(val.serviceCharge);
            }
          });
        let totalClientCharges = parseInt(totalServiceCharges * hoursPerDay);

        let yearlyClients = revenue / totalClientCharges;

        let monthlyClients = yearlyClients / 12;

        let weeklyClients = monthlyClients / 4;

        let obj = {
          yearlyClients: Math.round(yearlyClients),
          monthlyClients: Math.round(monthlyClients),
          weeklyClients: Math.round(weeklyClients),
          hoursPerDay: Math.round(hoursPerDay),
          totalServiceCharges: totalClientCharges,
        };
        obj2.cal = obj;
        let accurateGoals = {
          monthlyGoals: monthlyGoals,
          weeklyGoals: weeklyGoals,
          perDaysGoals: perDaysGoals,
        };
        let calculategoalBudget = {
          companyBudget: companyBudget,
          service: serviceNew,
          calculatedgoals: obj2.cal,
          accurateGoals: accurateGoals,
        };

        if (TotalMinutesForServices > minutesForWorkPerDay) {
          createNotification(
            "error",
            "Total working hours should be greater than total working hours of service"
          );
        } else {
          const saveGoalBudget = await saveGoalBudgetAction(
            calculategoalBudget,
            tokenResponse
          );
          if (saveGoalBudget.status === 200) {
            createNotification("success", saveGoalBudget.data.message);
            window.scroll(0, 0);
          }
          getGoalsBudget();
        }
      } else if (abc) {
        createNotification("error", "Please select at least one service ");
      }
    } else {
      createNotification("error", "Please validate form first");
    }
    let totalServiceCharge = 0;
    serviceNew &&
      serviceNew?.length > 0 &&
      serviceNew
        ?.filter((val) => val?.checked == true)
        ?.map((val) => (totalServiceCharge += parseInt(val.serviceCharge)));
    setTotalChargeService(totalServiceCharge);
  };

  const handleNumber = () => {
    navigate(`/clients`);
  };

  const getFunction = () => {
    getGoalsBudget();
  };

  const revenuData = async () => {
    const repsonse = await commonService.getPersonalBudgetAction(tokenResponse);
    setYearlyIncome(
      repsonse &&
        repsonse.personalBudget &&
        repsonse.personalBudget.summaryObject
        ? repsonse.personalBudget.summaryObject.netYearly
        : ""
    );
  };

  useEffect(() => {
    revenuData();
  }, [tokenResponse]);

  useEffect(() => {
    setTimeout(() => {
      setDisabledBtn(false);
    }, 8000);
  }, [disabledBtn]);

  const handlefserviceNewData = () => {
    const serviceNewData =
      serviceNew &&
      serviceNew?.length > 0 &&
      serviceNew?.map((val, index) => {
        if (val.role === 1 && val.isDeleted === false) {
          return (
            <>
              {val.checked && (
                <GoalsServiceform
                  index={index}
                  service={val}
                  serviceName={val.service}
                  handleService={handleService}
                  error1={error1}
                  tokenResponse={tokenResponse}
                  serviceNew={serviceNew}
                />
              )}
            </>
          );
        }
      });
    return serviceNewData;
  };
  const handlefserviceuserData = () => {
    const serviceuserData =
      serviceNew &&
      serviceNew?.length > 0 &&
      serviceNew?.map((val, index) => {
        if (val.role === 2 && val.isDeleted === false) {
          return (
            <>
              {val.checked && (
                <GoalsServiceform
                  index={index}
                  service={val}
                  serviceName={val.service}
                  handleService={handleService}
                  error1={error1}
                  tokenResponse={tokenResponse}
                  serviceNew={serviceNew}
                />
              )}
            </>
          );
        }
      });
    return serviceuserData;
  };

  return (
    <>
      <HeaderTop
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
      <DashboardTopMenu />
      <div className="dashboard-wrapper ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <h2>
                  <b>My Goals</b>
                </h2>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Goals</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="layout-content-wrapper">
              <div className="main-heading">
                <h1>Your Revenue List</h1>
              </div>
              <div>
                <GoalsRowDisplay
                  dailyGoals={perDaysGoals}
                  monthlyGoals={monthlyGoals}
                  yearlyGoals={yearlyGoals}
                  daysToWork={companyBudget.daysToWork}
                />
              </div>

              <div className="revenue-field-wrapper">
                <div className="revenue-heading">
                  <h1>
                    Planning Your Revenue{" "}
                    <span
                      className="toltip-icon"
                      data-background-color="#1c5141"
                      data-tip="This section determines the amount of revenue your company needs to earn in ADDITION to the Gross total from your Personal Budget Form.  Add any amount to your (Personal Budget Gross Total) and type that new number below. "
                      data-place="right"
                      data-for="foo"
                    >
                      <BiMessageRoundedError />
                    </span>
                    <ReactTooltip id="foo" />
                  </h1>
                </div>
                <div className="form-wrapper">
                  <Form>
                    <Row>
                      <Col xs={12} md={6} className="internal">
                        <Form.Group className="mb-3">
                          <Form.Label>
                            How much addtional business revenue do you want to
                            earn beyond your personal revenue of: $
                            {yearlyIncome ? yearlyIncome : ""}
                          </Form.Label>
                          <div style={{ position: "relative" }}>
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                              }}
                            >
                              $
                            </span>
                            <Form.Control
                              type="text"
                              pattern="[0-9]*"
                              name="revenueEarn"
                              value={companyBudget.revenueEarn}
                              onChange={handlecompanyBudget}
                              style={{ paddingLeft: "20px" }}
                            />
                          </div>
                          <span className="error">
                            {error && error.revenueEarn}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} className="internal">
                        <Form.Group className="mb-3">
                          <Form.Label>
                            How many hours do you want to work a day?
                          </Form.Label>
                          <Form.Control
                            type="text"
                            pattern="[0-9]*"
                            name="workPerDay"
                            value={companyBudget.workPerDay}
                            onChange={handlecompanyBudget}
                            style={{ paddingLeft: "20px" }}
                          />
                          <span className="error">
                            {error && error.workPerDay}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            How many days do you want to work a week?
                          </Form.Label>
                          <Multiselect
                            isObject={false}
                            onRemove={handleDaysSelected}
                            onSelect={handleDaysSelected}
                            showArrow={true}
                            avoidHighlightFirstOption={true}
                            placeholder="Select days"
                            selectedValues={companyBudget?.daysToWork}
                            options={[
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ]}
                          />
                          <span className="error">
                            {error && error.workPerWeek}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>

              <div className="revenue-field-wrapper">
                <div className="revenue-heading">
                  <h1>Projected Revenue Benchmarks</h1>
                </div>
                <div className="form-wrapper">
                  <Form>
                    <Row>
                      <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Monthly Revenue goals</Form.Label>
                          <div style={{ position: "relative" }}>
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                              }}
                            >
                              $
                            </span>
                            <Form.Control
                              pattern="[0-9]*"
                              name="revenueEarn"
                              value={monthlyGoals}
                              disabled
                              style={{ paddingLeft: "20px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Weekly Revenue goals</Form.Label>
                          <div style={{ position: "relative" }}>
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                              }}
                            >
                              $
                            </span>
                            <Form.Control
                              pattern="[0-9]*"
                              name="revenueEarn"
                              value={weeklyGoals}
                              disabled
                              style={{ paddingLeft: "20px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Daily Revenue goals</Form.Label>
                          <div style={{ position: "relative" }}>
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                              }}
                            >
                              $
                            </span>
                            <Form.Control
                              pattern="[0-9]*"
                              name="revenueEarn"
                              value={perDaysGoals}
                              disabled
                              style={{ paddingLeft: "20px" }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
              <div className="service-provided-wrapper">
                <div className="service-heading">
                  <h1>
                    What Services Do You Provide{" "}
                    <span
                      className="toltip-icon"
                      data-background-color="#1c5141"
                      data-tip="This section will allow you to see if you will be able to achieve your Daily Goals based on the services you provide, the amount you are charging, and the amount of time it takes you to complete that service.  Add all the services you currently offer or would like to offer."
                      data-place="right"
                      data-for="test"
                    >
                      <BiMessageRoundedError />
                    </span>
                    <ReactTooltip id="test" />
                  </h1>
                </div>
                <h2 className="text-uppercase fw-semibold">Admin services</h2>
                <div className="service-list  service-dropdown-section">
                  <AdminDropDown
                    serviceNew={serviceNew}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedCheckboxes={selectedCheckboxes}
                  />
                  <div className="service-field">
                    {loader ? <Loader /> : handlefserviceNewData()}
                  </div>
                </div>
                <div className="service-heading">
                  <h2 className="text-uppercase fw-semibold">User Services</h2>
                  <div className="add-service">
                    <BusinessServiceModal
                      getServiceByUser={getServiceByUser}
                      getFunction={getFunction}
                      loader={loader}
                      loadDisabled={loadDisabled}
                      disabledBtn={disabledBtn}
                    />
                  </div>
                </div>
                <div className="service-list service-dropdown-section">
                  <UserDropDown
                    serviceNew={serviceNew}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedCheckboxes={selectedCheckboxes}
                  />
                  <div className="service-field">
                    {loader ? <Loader /> : handlefserviceuserData()}
                  </div>
                </div>
              </div>
              <div className="reset-cl-btn">
                <Button
                  className="calculate-btn"
                  disabled={loader == true ? loadDisabled : disabledBtn}
                  onClick={handleCalculate}
                >
                  <BsCalculator />
                  Calculate
                </Button>
              </div>
              {/* <div className="these-goal-wrapper mb-5">
                <h1>
                  Based on your personal budget and your goal above, here is
                  what we suggest you need to reach them
                </h1>
                <div className="total-ammout mb-5">
                  <h2>Total amount</h2>
                  <b>
                    $
                    {calculatedgoals?.totalServiceCharges
                      ? calculatedgoals?.totalServiceCharges
                      : 0}
                  </b>
                </div>
                <p></p>
                <Button
                  className="these-gbtn"
                  onClick={handleNumber}
                  disabled={loader == true ? loadDisabled : disabledBtn}
                >
                  Commit to These Goals!
                  <BsFillFlagFill />
                </Button>
              </div> */}
            </div>
          </div>
        </Container>
      </div>
      <ToastContainer />

      <Footer />
    </>
  );
};

export default Goals;
