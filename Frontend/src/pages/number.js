import React, { useState, useEffect } from "react";
import {
  Container,
  Tab,
  Tabs,
  Row,
  Col,
  Table,
  Breadcrumb,
} from "react-bootstrap";
import HeaderTop from "../components/headerTop";
import Sidebarmenu from "../components/sideBarMenu";
import {
  BsQuestionLg,
  BsCalendar4Event,
  BsCalculator,
  BsFillFlagFill,
} from "react-icons/bs";
import { BiCalendar, BiMessageRoundedError } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdHome, MdModeEdit } from "react-icons/md";
import Footer from "../components/footer";
import { Chart } from "react-google-charts";
import * as getCompanyGoalservice from "../services/goalCompanyBudgetService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardTopMenu from "../components/dashboardMenu";
const data = [
  ["Task", "week to date"],
  ["Blue", 33.7],
  ["Red", 42],
  ["Yellow", 22.3],
];
const options = {
  pieHole: 0.0,
  is3D: false,
  width: 500,
  height: 400,
  legend: {
    position: "top",
    alignment: "center",
    textStyle: { color: "#17533f", fontSize: 16, bold: true },
  },
  pieStartAngle: 100,
};
const dataset = [
  ["Month", "My First dataset"],
  ["January", 50],
  ["February", 85],
  ["March", 60],
  ["April", 80],
  ["may", 70],
  ["June", 75],
  ["July", 90],
  ["August", 25],
  ["September", 15],
  ["October", 135],
  ["November", -45],
  ["December", 11],
];
const datasetoptions = {
  curveType: "function",
  legend: {
    position: "top",
    alignment: "center",
  },
};

const Number = () => {
  let { id } = useParams();
  let [goalResult, setGoalResult] = useState("");
  let [claculateHour, setCalculateHour] = useState("");
  const tokenResponse = useSelector((state) => state.auth.token);

  let getGoalById = async () => {
    const response = await getCompanyGoalservice.GoalsById(id, tokenResponse);
    if (response.data.data) {
      response.data &&
        response.data.data.map((val) => {
          setGoalResult(val.calculatedgoals);
        });
    }

  };

  useEffect(() => {
    getGoalById();
  }, [tokenResponse]);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <HeaderTop />
      <DashboardTopMenu />
      <div className="dashboard-wrapper  ds-layout-wrapper">
        <Container>
          <div className="ds-wrapper">
            <div className="breadcurm-bar">
              <div className="bdbar-box">
                <h2>
                  <b>The Number</b>
                </h2>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <MdHome />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Number</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
            <div className="layout-content-wrapper">
              <div className="main-heading">
                <h1>Your Revenue Progress</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
              </div>
              <div className="goal-data-value-box">
                <Row>
                  <Col xs={4}>
                    <div className="data-value-box weekly">
                      <div className="goal-datavalue ">
                        <span className="icon">
                          <BsCalendar4Event />
                        </span>
                        <div className="value-detail">
                          <h1>
                            {" "}
                            {goalResult && goalResult.weeklyClients === 0 ? (
                              0
                            ) : goalResult.weeklyClients > 0 ? (
                              goalResult.weeklyClients
                            ) : (
                              <BsQuestionLg />
                            )}
                          </h1>
                          <h2>Weekly Goals</h2>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="data-value-box Monthly">
                      <div className="goal-datavalue ">
                        <span className="icon">
                          <FaCalendarAlt />
                        </span>
                        <div className="value-detail">
                          <h1>
                            {" "}
                            {goalResult && goalResult.monthlyClients === 0 ? (
                              0
                            ) : goalResult.monthlyClients > 0 ? (
                              goalResult.monthlyClients
                            ) : (
                              <BsQuestionLg />
                            )}
                          </h1>
                          <h2>Monthly Goals</h2>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="data-value-box Yearly">
                      <div className="goal-datavalue">
                        <span className="icon">
                          <BiCalendar />
                        </span>
                        <div className="value-detail">
                          <h1>
                            {" "}
                            {goalResult && goalResult.yearlyClients === 0 ? (
                              0
                            ) : goalResult.yearlyClients > 0 ? (
                              goalResult.yearlyClients
                            ) : (
                              <BsQuestionLg />
                            )}
                          </h1>
                          <h2>Yearly Goals</h2>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="ds-goal-table">
                <div className="number-tab-wrapper">
                  <Tabs defaultActiveKey="weektodate" className="mb-3">
                    <Tab eventKey="weektodate" title="Week to Date">
                      <div className="tab-detail">
                        <div className="numberchart">
                          <Row>
                            <Col xs={6}>
                              <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={dataset}
                                options={datasetoptions}
                              />
                            </Col>
                            <Col xs={6}>
                              <Chart
                                chartType="PieChart"
                                width="100%"
                                height="400px"
                                data={data}
                                options={options}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="number-table">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Projected </th>
                                <th>Actual</th>
                                <th>Goal Reached?</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Number of Clients</th>
                                <td>??</td>

                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Hour Worked</th>
                                <td>??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Bottles of product used</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Gross Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Net Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="monthtodate" title="Month to date">
                      <div className="tab-detail">
                        <div className="numberchart">
                          <Row>
                            <Col xs={6}>
                              <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={dataset}
                                options={datasetoptions}
                              />
                            </Col>
                            <Col xs={6}>
                              <Chart
                                chartType="PieChart"
                                width="100%"
                                height="400px"
                                data={data}
                                options={options}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="number-table">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Projected </th>
                                <th>Actual</th>
                                <th>Goal Reached?</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Number of Clients</th>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Hour Worked</th>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Bottles of product used</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Gross Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Net Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="yeartodate" title="Year to Date">
                      <div className="tab-detail">
                        <div className="numberchart">
                          <Row>
                            <Col xs={6}>
                              <Chart
                                chartType="LineChart"
                                width="100%"
                                height="400px"
                                data={dataset}
                                options={datasetoptions}
                              />
                            </Col>
                            <Col xs={6}>
                              <Chart
                                chartType="PieChart"
                                width="100%"
                                height="400px"
                                data={data}
                                options={options}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="number-table">
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Projected </th>
                                <th>Actual</th>
                                <th>Goal Reached?</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Number of Clients</th>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Hour Worked</th>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Bottles of product used</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Gross Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                              <tr>
                                <th>Net Profit</th>
                                <td>$??</td>
                                <td>??</td>
                                <td>??</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Number;
