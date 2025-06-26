import React, { useState, useEffect } from "react";
import { Button, Table} from "react-bootstrap";
import { BiEdit } from "react-icons/bi";
import CsvLink from "react-csv-export";

function formatNumber(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const Summary = (props) => {
  const CalculateSummary = ({
    discretionary,
    houseHold,
    housing,
    loanPayments,
    personalInsurance,
    companyExpenses,
    transportation,
  }) => {
    const [summaryObject, setSummaryObject] = useState({});
    useEffect(() => {
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
        if(key === "LicenseRegistration")
        {
          totalMonthlyTransportation =
          Number(totalMonthlyTransportation ? totalMonthlyTransportation : 0) +
          Number(value ? value/12 : 0);
        }else{
          totalMonthlyTransportation =
          Number(totalMonthlyTransportation ? totalMonthlyTransportation : 0) +
          Number(value ? value : 0);
        }
        
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
      netMonthly = netMonthlyExpense + totalMonthlyCompanyExpenses;
      netYearly = netAnnualExpense + totalAnnualCompanyExpenses;
      setSummaryObject({
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
      });
    }, []);

    useEffect(() => {
      window.scroll(0, 0);
    }, []);
    const DATA = [
      { Name: "Housing:", value: "" },
      {
        Name: "Mortgage/Rent",
        value: `$ ${formatNumber(props.housing.mortgage ? props.housing.mortgage : 0)}`,
      },
      {
        Name: "Property Tax",
        value: `$ ${formatNumber(props.housing.propertyTax ? props.housing.propertyTax : 0)}`,
      },
      {
        Name: "Home Maintenance",
        value: `$ ${formatNumber
          (props.housing.homeMaintenance ? props.housing.homeMaintenance : 0
        )}`,
      },
      {
        Name: "Renters/Homeower's Insurance",
        value: `$ ${formatNumber
          (props.housing.homeowerInsurance ? props.housing.homeowerInsurance : 0)
        }`,
      },
      {
        Name: "Electric",
        value: `$ ${formatNumber(props.housing.electric ? props.housing.electric : 0)}`,
      },
      {
        Name: "Gas",
        value: `$ ${formatNumber(props.housing.gas ? props.housing.gas : 0)}`,
      },
      {
        Name: "Water",
        value: `$ ${formatNumber(props.housing.water ? props.housing.water : 0)}`,
      },
      {
        Name: "Cable",
        value: `$ ${formatNumber(props.housing.cable ? props.housing.cable : 0)}`,
      },
      {
        Name: "talephone",
        value: `$ ${formatNumber(props.housing.talephone ? props.housing.talephone : 0)}`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(props.housing.other ? props.housing.other : 0)}`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyHousing
            ? summaryObject.totalMonthlyHousing
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualHousing
            ? summaryObject.totalAnnualHousing
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Transportation:",
        value: "",
      },
      {
        Name: "Auto Payment(s)",
        value: `$ ${formatNumber(
          props.transportation.autoPayment
            ? props.transportation.autoPayment
            : 0)
        }`,
      },
      {
        Name: "Auto Insurance",
        value: `$ ${formatNumber(
          props.transportation.autoInsurance
            ? props.transportation.autoInsurance
            : 0)
        }`,
      },
      {
        Name: "Gas",
        value: `$ ${formatNumber(
          props.transportation.transportationGas
            ? props.transportation.transportationGas
            : 0)
        }`,
      },
      {
        Name: "Maintenance",
        value: `$ ${formatNumber(
          props.transportation.maintenance
            ? props.transportation.maintenance
            : 0)
        }`,
      },
      {
        Name: "License/Registration",
        value: `$ ${formatNumber(
          props.transportation.LicenseRegistration
            ? (props.transportation.LicenseRegistration / 12).toFixed(2)
            : 0)
        }`,
      },
      {
        Name: "Parking/Toll/Bus/Train",
        value: `$ ${formatNumber(
          props.transportation.ParkingTollBusTrain
            ? props.transportation.ParkingTollBusTrain
            : 0)
        }`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(
          props.transportation.Others ? props.transportation.Others : 0)
        }`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyTransportation
            ? summaryObject.totalMonthlyTransportation.toFixed(2)
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualTransportation
            ? summaryObject.totalAnnualTransportation.toFixed(2)
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Household:",
        value: "",
      },
      {
        Name: "Groceries",
        value: `$ ${formatNumber(props.houseHold.groceries ? props.houseHold.groceries : 0)}`,
      },
      {
        Name: "Personal Care",
        value: `$ ${formatNumber(
          props.houseHold.personalCare ? props.houseHold.personalCare : 0)
        }`,
      },
      {
        Name: "Clothing/Dry Cleaning",
        value: `$ ${formatNumber(
          props.houseHold.ClothingDryCleaning
            ? props.houseHold.ClothingDryCleaning
            : 0)
        }`,
      },
      {
        Name: "Domestic Help",
        value: `$ ${formatNumber(
          props.houseHold.domesticHelp ? props.houseHold.domesticHelp : 0)
        }`,
      },
      {
        Name: "Professional Dues",
        value: `$ ${formatNumber(props.houseHold.professionaldues
            ? props.houseHold.professionaldues
            : 0)
        }`,
      },
      {
        Name: "Dependent/Child Care",
        value: `$ ${formatNumber(
          props.houseHold.dependentChildCare
            ? props.houseHold.dependentChildCare
            : 0)
        }`,
      },
      {
        Name: "Education/School",
        value: `$ ${formatNumber(
          props.houseHold.educationSchool ? props.houseHold.educationSchool : 0)
        }`,
      },
      {
        Name: "Cash Allowances",
        value: `$ ${formatNumber(
          props.houseHold.cashAllowances ? props.houseHold.cashAllowances : 0)
        }`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(props.houseHold.others ? props.houseHold.others : 0)}`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyHouseHold
            ? summaryObject.totalMonthlyHouseHold
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualHouseHold
            ? summaryObject.totalAnnualHouseHold
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Loan Payments:",
        value: "",
      },
      {
        Name: "Credit Card Payments",
        value: `$ ${formatNumber(
          props.loanPayments.creditCardPayment
            ? props.loanPayments.creditCardPayment
            : 0)
        }`,
      },
      {
        Name: "Other Loan Payments",
        value: `$ ${formatNumber(
          props.loanPayments.otherLoanPayment
            ? props.loanPayments.otherLoanPayment
            : 0)
        }`,
      },
      {
        Name: "Saving/Investing",
        value: `$ ${formatNumber(
          props.loanPayments.savingInvesting
            ? props.loanPayments.savingInvesting
            : 0)
        }`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(props.loanPayments.others ? props.loanPayments.others : 0)}`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyLoanPayments
            ? summaryObject.totalMonthlyLoanPayments
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualLoanPayments
            ? summaryObject.totalAnnualLoanPayments
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Personal Insurance:",
        value: "",
      },
      {
        Name: "Health Insurance",
        value: `$ ${formatNumber(
          props.personalInsurance.healthInsurance
            ? props.personalInsurance.healthInsurance
            : 0)
        }`,
      },
      {
        Name: "Life Insurance",
        value: `$ ${formatNumber(
          props.personalInsurance.lifeInsurance
            ? props.personalInsurance.lifeInsurance
            : 0)
        }`,
      },
      {
        Name: "Expenses",
        value: "",
      },
      {
        Name: "Disability Income Insurance",
        value: `$ ${formatNumber(
          props.personalInsurance.disabilityIncomeInsurance
            ? props.personalInsurance.disabilityIncomeInsurance
            : 0)
        }`,
      },
      {
        Name: "Long-Term Health Care Insurance",
        value: `$ ${formatNumber(
          props.personalInsurance.healthCareInsurance
            ? props.personalInsurance.healthCareInsurance
            : 0)
        }`,
      },
      {
        Name: "Medical/Dental/Vision/Drug",
        value: `$ ${formatNumber(
          props.personalInsurance.medicalDentalVisionDrug
            ? props.personalInsurance.medicalDentalVisionDrug
            : 0)
        }`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(
          props.personalInsurance.others ? props.personalInsurance.others : 0)
        }`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyPersonalInsurance
            ? summaryObject.totalMonthlyPersonalInsurance
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualPersonalInsurance
            ? summaryObject.totalAnnualPersonalInsurance
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Discretionary:",
        value: "",
      },
      {
        Name: "Dining Out",
        value: `$ ${formatNumber(
          props.discretionary.diningOut ? props.discretionary.diningOut : 0)
        }`,
      },
      {
        Name: "Recreation/Club Dues",
        value: `$ ${formatNumber(
          props.discretionary.recreationClubDues
            ? props.discretionary.recreationClubDues
            : 0)
        }`,
      },
      {
        Name: "Movies/Sporting Events",
        value: `$ ${formatNumber(
          props.discretionary.moviesSportingEvents
            ? props.discretionary.moviesSportingEvents
            : 0)
        }`,
      },
      {
        Name: "Hobbies",
        value: `$ ${formatNumber(
          props.discretionary.hobbies ? props.discretionary.hobbies : 0)
        }`,
      },
      {
        Name: "Vacation/Travel",
        value: `$ ${formatNumber(
          props.discretionary.vacationTravel
            ? props.discretionary.vacationTravel
            : 0)
        }`,
      },
      {
        Name: "Gift/Contributions",
        value: `$ ${formatNumber(
          props.discretionary.giftContributions
            ? props.discretionary.giftContributions
            : 0)
        }`,
      },
      {
        Name: "Others",
        value: `$ ${formatNumber(
          props.discretionary.others ? props.discretionary.others : 0)
        }`,
      },
      {
        Name: "Total Monthly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalMonthlyDiscretionary
            ? summaryObject.totalMonthlyDiscretionary
            : 0)
        }`,
      },
      {
        Name: "Total Yearly Expenses",
        value: `$ ${formatNumber(
          summaryObject && summaryObject.totalAnnualDiscretionary
            ? summaryObject.totalAnnualDiscretionary
            : 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Company Expenses:",
        value: "",
      },
      {
        Name: "Rent",
        value: `$ ${formatNumber(
          props.companyExpenses.rent ? props.companyExpenses.rent : 0)
        }`,
      },
      {
        Name: "Gas",
        value: `$ ${formatNumber(
          props.companyExpenses.companyGas
            ? props.companyExpenses.companyGas
            : 0)
        }`,
      },
      {
        Name: "Water",
        value: `$ ${formatNumber(
          props.companyExpenses.companyWater
            ? props.companyExpenses.companyWater
            : 0)
        }`,
      },
      {
        Name: "Electricity",
        value: `$ ${formatNumber(
          props.companyExpenses.electricity
            ? props.companyExpenses.electricity
            : 0)
        }`,
      },
      {
        Name: "Cellular",
        value: `$ ${formatNumber(
          props.companyExpenses.cellular ? props.companyExpenses.cellular : 0)
        }`,
      },
      {
        Name: "Internet",
        value: `$ ${formatNumber(
          props.companyExpenses.internet ? props.companyExpenses.internet : 0)
        }`,
      },
      {
        Name: "Marketing",
        value: `$ ${formatNumber(
          props.companyExpenses.marketing ? props.companyExpenses.marketing : 0)
        }`,
      },
      {
        Name: "Total Monthly Company Expenses",
        value: `$ ${formatNumber(
          summaryObject?.totalMonthlyCompanyExpenses
            ?? 0)
        }`,
      },
      {
        Name: "Total Yearly Company Expenses",
        value: `$ ${formatNumber(
          summaryObject?.totalAnnualCompanyExpenses
            ?? 0)
        }`,
      },
      { Name: "", value: "" },
      {
        Name: "Total Monthly Personal Expenses",
        value: `$ ${formatNumber(
          summaryObject?.netMonthlyExpense
            ?? 0)
        }`,
      },
      {
        Name: "Total Yearly Personal Expenses",
        value: `$ ${formatNumber(
          summaryObject?.netAnnualExpense
            ?? 0)
        }`,
      },
      {
        Name: "Total Monthly Company Expenses",
        value: `$ ${formatNumber(
          summaryObject?.totalMonthlyCompanyExpenses
            ?? 0)
        }`,
      },
      {
        Name: "Total Yearly Company Expenses",
        value: `$ ${formatNumber(
          summaryObject?.totalAnnualCompanyExpenses
            ?? 0)
        }`,
      },
      {
        Name: "Gross Total",
        value: `$ ${formatNumber(
          summaryObject?.netYearly
            ?? 0)
        }`,
      },
    ];

    return (
      <>
        <div className="dashboard-wrapper">
          <div className="bugdet-form-summary">
            <div className="budget-summary-heading">
              <h1>Income Summary</h1>
              <div className="gross-total-value">
                <h3>Gross Total:</h3>
                <span className="value">
                  {" "}
                  $
                  {formatNumber(summaryObject?.netYearly
                    ?? 0)}
                </span>
              </div>
            </div>
            <div className="budget-total-summary">
              <div className="sum-list">
                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Housing</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(0);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Mortgage/Rent:</td>
                            <td>
                              $
                              {formatNumber(props.housing.mortgage
                                ? props.housing.mortgage
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Property Tax:</td>
                            <td>
                              $
                              {formatNumber(props.housing.propertyTax
                                ? props.housing.propertyTax
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Home Maintenance: </td>
                            <td>
                              $
                              {formatNumber(props.housing.homeMaintenance
                                ? props.housing.homeMaintenance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Renters/Homeowners Insurance:</td>
                            <td>
                              $
                              {formatNumber(props.housing.homeowerInsurance
                                ? props.housing.homeowerInsurance
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="summary-heading">
                      <h2>Utilites</h2>
                    </div>
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>Electric:</td>
                            <td>
                              $
                              {formatNumber(props.housing.electric
                                ? props.housing.electric
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Gas:</td>
                            <td>
                              ${formatNumber(props.housing.gas ? props.housing.gas : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Water: </td>
                            <td>
                              ${formatNumber(props.housing.water ? props.housing.water : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Cable:</td>
                            <td>
                              ${formatNumber(props.housing.cable ? props.housing.cable : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Telephone:</td>
                            <td>
                              $
                              {formatNumber(props.housing.talephone
                                ? props.housing.talephone
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others:</td>
                            <td>
                              ${formatNumber(props.housing.other ? props.housing.other : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyHousing
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualHousing
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Household</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(2);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Groceries:</td>
                            <td>
                              $
                              {formatNumber(props.houseHold.groceries
                                ? props.houseHold.groceries
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Personal Care:</td>
                            <td>
                              $
                              {formatNumber(props.houseHold.personalCare
                                ? props.houseHold.personalCare
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Clothing/Dry Cleaning: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.ClothingDryCleaning
                                ? props.houseHold.ClothingDryCleaning
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Domestic Help: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.domesticHelp
                                ? props.houseHold.domesticHelp
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Professional Dues: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.professionaldues
                                ? props.houseHold.professionaldues
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Dependent/Child Care: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.dependentChildCare
                                ? props.houseHold.dependentChildCare
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Education/School: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.educationSchool
                                ? props.houseHold.educationSchool
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Cash Allowances: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.cashAllowances
                                ? props.houseHold.cashAllowances
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others: </td>
                            <td>
                              $
                              {formatNumber(props.houseHold.others
                                ? props.houseHold.others
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyHouseHold
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualHouseHold
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Personal Insurance</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(4);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Health Insurance: </td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.healthInsurance
                                ? props.personalInsurance.healthInsurance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Life Insurance:</td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.lifeInsurance
                                ? props.personalInsurance.lifeInsurance
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="summary-heading">
                      <h2>Expenses</h2>
                    </div>
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>Disability Income Insurance: </td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.disabilityIncomeInsurance
                                ? props.personalInsurance
                                    .disabilityIncomeInsurance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Long-Term Health Care Insurance: </td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.healthCareInsurance
                                ? props.personalInsurance.healthCareInsurance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Medical/Dental/Vision/Drug: </td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.medicalDentalVisionDrug
                                ? props.personalInsurance
                                    .medicalDentalVisionDrug
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others:</td>
                            <td>
                              $
                              {formatNumber(props.personalInsurance.others
                                ? props.personalInsurance.others
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyPersonalInsurance
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualPersonalInsurance
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sum-list">
                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Transportation</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(1);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Auto Payment(s):</td>
                            <td>
                              $
                              {formatNumber(props.transportation.autoPayment
                                ? props.transportation.autoPayment
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Auto Insurance:</td>
                            <td>
                              $
                              {formatNumber(props.transportation.autoInsurance
                                ? props.transportation.autoInsurance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Gas: </td>
                            <td>
                              $
                              {formatNumber(props.transportation.transportationGas
                                ? props.transportation.transportationGas
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Maintenance: </td>
                            <td>
                              $
                              {formatNumber(props.transportation.maintenance
                                ? props.transportation.maintenance
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>License/Registration:</td>
                            <td>
                              $
                              {formatNumber(props.transportation.LicenseRegistration
                                ? props.transportation.LicenseRegistration / 12
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Parking/Toll/Bus/Train: </td>
                            <td>
                              $
                              {formatNumber(props.transportation.ParkingTollBusTrain
                                ? props.transportation.ParkingTollBusTrain
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others: </td>
                            <td>
                              $
                              {formatNumber(props.transportation.Others
                                ? props.transportation.Others
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyTransportation
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualTransportation
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Loan Payments</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(3);
                      }}
                    >
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Credit Card Payments:</td>
                            <td>
                              $
                              {formatNumber(props.loanPayments.creditCardPayment
                                ? props.loanPayments.creditCardPayment
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Other Loan Payments:</td>
                            <td>
                              $
                              {formatNumber(props.loanPayments.otherLoanPayment
                                ? props.loanPayments.otherLoanPayment
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Saving/Investing: </td>
                            <td>
                              $
                              {formatNumber(props.loanPayments.savingInvesting
                                ? props.loanPayments.savingInvesting
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others: </td>
                            <td>
                              $
                              {formatNumber(props.loanPayments.others
                                ? props.loanPayments.others
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses: </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyLoanPayments
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses:</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualLoanPayments
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Discretionary</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(5);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Dining Out:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.diningOut
                                ? props.discretionary.diningOut
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Recreation/Club Dues:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.recreationClubDues
                                ? props.discretionary.recreationClubDues
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Movies/Sporting Events: </td>
                            <td>
                              $
                              {formatNumber(props.discretionary.moviesSportingEvents
                                ? props.discretionary.moviesSportingEvents
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Hobbies:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.hobbies
                                ? props.discretionary.hobbies
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Vacation/Travel:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.vacationTravel
                                ? props.discretionary.vacationTravel
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Gift/Contributions:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.giftContributions
                                ? props.discretionary.giftContributions
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Others:</td>
                            <td>
                              $
                              {formatNumber(props.discretionary.others
                                ? props.discretionary.others
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyDiscretionary
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualDiscretionary
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="summary-list">
                  <div className="summary-heading">
                    <h1>Company Expenses</h1>
                    <Button
                      onClick={() => {
                        props.setActiveStep(6);
                      }}
                    >
                      {" "}
                      <BiEdit />
                      Edit
                    </Button>
                  </div>
                  <div className="sum-list-box">
                    <div className="summary-listbar">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rent:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.rent
                                ? props.companyExpenses.rent
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Gas:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.companyGas
                                ? props.companyExpenses.companyGas
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Water: </td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.companyWater
                                ? props.companyExpenses.companyWater
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Electricity:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.electricity
                                ? props.companyExpenses.electricity
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Cellular:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.cellular
                                ? props.companyExpenses.cellular
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Internet:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.internet
                                ? props.companyExpenses.internet
                                : 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Marketing:</td>
                            <td>
                              $
                              {formatNumber(props.companyExpenses.marketing
                                ? props.companyExpenses.marketing
                                : 0)}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total Monthly Company Expenses </td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalMonthlyCompanyExpenses
                                ?? 0)}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Yearly Company Expenses</td>
                            <td>
                              $
                              {formatNumber(summaryObject?.totalAnnualCompanyExpenses
                                ?? 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="total-income-value">
              <h1>Total Monthly Expenses</h1>
              <Table className="Total-incomebox">
                <tfoot>
                  <tr>
                    <td>Total Monthly Personal Expenses</td>
                    <td>
                      {" "}
                      $
                      {formatNumber(summaryObject?.netMonthlyExpense
                        ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Yearly Personal Expenses</td>
                    <td>
                      {" "}
                      $
                      {formatNumber(summaryObject?.netAnnualExpense
                        ?? 0)}
                    </td>
                  </tr>

                  <tr>
                    <td>Total Monthly Company Expenses</td>
                    <td>
                      $
                      {formatNumber(summaryObject?.totalMonthlyCompanyExpenses
                        ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Yearly Company Expenses</td>
                    <td>
                      $
                      {formatNumber(summaryObject?.totalAnnualCompanyExpenses
                        ?? 0)}
                    </td>
                  </tr>
                  <tr>
                    <td>Gross Total</td>
                    <td>
                      {" "}
                      $
                      {formatNumber(summaryObject?.netYearly
                        ?? 0)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
        </div>
        <span className="download-csvbtn">
          <CsvLink data={DATA} fileName="personal Budget">
            <button className="csvButton">DOWNLOAD CSV</button>
          </CsvLink>
        </span>
      </>
    );
  };

  return <CalculateSummary {...props} />;
};

export default Summary;
