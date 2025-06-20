import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaCalendarWeek, FaCalendarDay } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { formatMoney } from "../../helper/formatCurrency";
import moment from "moment";
import * as bookingService from "../../services/bookingServices";
import { TailSpin } from "react-loader-spinner";

const GoalsRowDisplay = ({
  dailyGoals,
  monthlyGoals,
  yearlyGoals,
  showDailyBar,
  daysToWork,
}) => {
  const [monthsList, setMonthsList] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyData, setYearlyGoals] = useState({
    paid: 0,
    booked: 0,
  });
  const [dailyData, setDailyGoals] = useState({
    paid: 0,
    booked: 0,
  });

  const getSixMonths = (paidBookings, unPaidBookings) => {
    let months = [];
    const currentMonth = moment();
    const currentYear = currentMonth.year();
    let additionalMonths = 1;

    for (let i = 4; i >= 0; i--) {
      let month = currentMonth.clone().subtract(i, "months");
      if (month.year() === currentYear) {
        months.push({ month: month });
      }
    }
    do {
      let nextMonth = currentMonth.clone().add(additionalMonths, "months");
      if (nextMonth.year() === currentYear) {
        ++additionalMonths;
        months.push({ month: nextMonth });
      }
    } while (months.length !== 6);

    let monthsWithAmounts = months.map((data) => {
      const paidAmount = paidBookings
        .filter(
          (paidBooking) =>
            data.month.month() ==
            moment(
              paidBooking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).month()
        )
        ?.reduce(
          (sum, paidBooking) => sum + (paidBooking?.servicePrice || 0),
          0
        );
      const unPaidAmount = unPaidBookings
        .filter(
          (paidBooking) =>
            data.month.month() ==
            moment(
              paidBooking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).month()
        )
        ?.reduce((sum, unPaidBooking) => {
          const serviceTotal = unPaidBooking?.service.reduce(
            (serviceSum, service) => serviceSum + (service?.price || 0),
            0
          );
          return sum + serviceTotal;
        }, 0);
      return {
        month: data.month.format("MMM"),
        paid: paidAmount,
        booked: paidAmount + unPaidAmount ?? 0,
      };
    });
    return monthsWithAmounts;
  };

  const daysArray = [
    {
      day: "Su",
      value: "Sunday",
    },
    {
      day: "Mo",
      value: "Monday",
    },
    {
      day: "Tu",
      value: "Tuesday",
    },
    {
      day: "We",
      value: "Wednesday",
    },
    {
      day: "Th",
      value: "Thursday",
    },
    {
      day: "Fr",
      value: "Friday",
    },
    {
      day: "Sa",
      value: "Saturday",
    },
  ];

  const getCurrentWeekDays = (paidBookings, unPaidBookings) => {
    const days = daysArray.map((data, index) => {
      const paidAmount = paidBookings
        .filter(
          (paidBooking) =>
            moment().startOf("week").add(index, "days").dayOfYear() ==
            moment(
              paidBooking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).dayOfYear()
        )
        ?.reduce(
          (sum, paidBooking) => sum + (paidBooking?.servicePrice || 0),
          0
        );
      const unPaidAmount = unPaidBookings
        .filter(
          (paidBooking) =>
            moment().startOf("week").add(index, "days").dayOfYear() ==
            moment(
              paidBooking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).dayOfYear()
        )
        ?.reduce((sum, unPaidBooking) => {
          const serviceTotal = unPaidBooking?.service.reduce(
            (serviceSum, service) => serviceSum + (service?.price || 0),
            0
          );
          return sum + serviceTotal;
        }, 0);
      return {
        day: data.day,
        isClosed: daysToWork ? !daysToWork?.includes(data.value) : true,
        paid: paidAmount,
        booked: unPaidAmount + paidAmount,
      };
    });

    return days;
  };

  const getBookingDetails = async () => {
    try {
      const resp = await bookingService.bookingList();
      if (resp.status === 200) {
        const response = resp?.data?.data[0]?.data || [];

        const currentYear = moment().year();
        const currentDay = moment().dayOfYear();

        // Calculations for Yearly data
        const paidBookingsForYear = response.filter(
          (booking) =>
            booking?.paymentType === "Paid" &&
            moment(
              booking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).year() === currentYear
        );
        const unpaidBookingsForYear = response.filter(
          (booking) =>
            booking?.paymentType !== "Paid" &&
            moment(
              booking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).year() === currentYear
        );
        const totalPaidYearly = paidBookingsForYear.reduce(
          (sum, booking) => sum + (booking.servicePrice || 0),
          0
        );
        const totalUnpaidYearly = unpaidBookingsForYear.reduce(
          (sum, booking) => {
            const serviceTotal = booking.service.reduce(
              (serviceSum, service) => serviceSum + (service.price || 0),
              0
            );
            return sum + serviceTotal;
          },
          0
        );

        //Calculations for Daily Data
        const paidBookingsForDaily = paidBookingsForYear.filter(
          (booking) =>
            moment(
              booking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).dayOfYear() === currentDay
        );
        const unpaidBookingsForDaily = unpaidBookingsForYear.filter(
          (booking) =>
            moment(
              booking?.startDateTime,
              "ddd MMM DD YYYY hh:mm:a:SS [GMT]ZZ"
            ).dayOfYear() === currentDay
        );
        const totalPaidDaily = paidBookingsForDaily.reduce(
          (sum, booking) => sum + (booking.servicePrice || 0),
          0
        );
        const totalUnpaidDaily = unpaidBookingsForDaily.reduce(
          (sum, booking) => {
            const serviceTotal = booking.service.reduce(
              (serviceSum, service) => serviceSum + (service.price || 0),
              0
            );
            return sum + serviceTotal;
          },
          0
        );

        setDailyGoals({
          paid: totalPaidDaily,
          booked: totalPaidDaily + totalUnpaidDaily,
        });
        setYearlyGoals({
          paid: totalPaidYearly,
          booked: totalUnpaidYearly + totalPaidYearly,
        });
        setMonthsList(getSixMonths(paidBookingsForYear, unpaidBookingsForYear));
        setDaysOfWeek(
          getCurrentWeekDays(paidBookingsForYear, unpaidBookingsForYear)
        );
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, [daysToWork]);

  return (
    <div>
      <div className="goals-row-display">
        <div className="goals-row scroll-container">
          <div className="goals-box">
            <div className="goals-header">
              <span className="icon">
                <FaCalendarWeek />
              </span>
              <h2 className="text-uppercase">Weekly Goals</h2>
            </div>
            {isLoading ? (
              <div className="loader-box">
                <TailSpin
                  visible={true}
                  height="60"
                  width="60"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                />
              </div>
            ) : (
              <div className="bars-container">
                {daysOfWeek.map((data, index) => (
                  <div key={index} className="bar-container">
                    <small>
                      {data.isClosed ? "Closed" : formatMoney(dailyGoals)}
                    </small>
                    <div
                      className={`empty-bar ${data.isClosed ? "closed" : ""}`}
                    >
                      <div
                        className="booked-bar"
                        style={{
                          height: `${(data.booked / dailyGoals) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="paid-bar"
                        style={{
                          height: `${(data.paid / dailyGoals) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <small className="fw-light">{data.day}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="goals-box">
            <div className="goals-header">
              <span className="icon">
                <FaCalendarAlt />
              </span>
              <h2 className="text-uppercase">Monthly Goals</h2>
            </div>
            {isLoading ? (
              <div className="loader-box">
                <TailSpin
                  visible={true}
                  height="60"
                  width="60"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                />
              </div>
            ) : (
              <div className="bars-container">
                {monthsList.map((data, index) => (
                  <div key={index} className="bar-container">
                    <small>{formatMoney(monthlyGoals)}</small>
                    <div className="empty-bar">
                      <div
                        className="booked-bar"
                        style={{
                          height: `${(data.booked / monthlyGoals) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="paid-bar"
                        style={{
                          height: `${(data.paid / monthlyGoals) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <small className="fw-light text-uppercase">
                      {data.month}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="goals-box">
            <div className="goals-header">
              <span className="icon">
                <FaCalendarCheck />
              </span>
              <h2 className="text-uppercase">Yearly Goals</h2>
            </div>
            {isLoading ? (
              <div className="loader-box">
                <TailSpin
                  visible={true}
                  height="60"
                  width="60"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                />
              </div>
            ) : (
              <div className="yearly-bar-container">
                <div className="yearly-bar">
                  <div
                    className="booked"
                    style={{
                      width: `${(yearlyData.booked / yearlyGoals) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="paid"
                    style={{
                      width: `${(yearlyData.paid / yearlyGoals) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="bottom-yearly">
                  <small>
                    <span></span>
                    {formatMoney(yearlyData.paid)}
                  </small>
                  <small>
                    <span className="booked"></span>
                    {formatMoney(yearlyData.booked)}
                  </small>
                  <small>{formatMoney(yearlyGoals)}</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDailyBar === true ? (
        <div className="daily-goals-row-display">
          <div className="goal-box">
            <div className="goals-header">
              <span className="icon">
                <FaCalendarDay />
              </span>
              <h2 className="text-uppercase">Daily Goals</h2>
            </div>
            {isLoading ? (
              <div className="loader-box">
                <TailSpin
                  visible={true}
                  height="50"
                  width="50"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                />
              </div>
            ) : (
              <div className="yearly-bar-container">
                <div className="yearly-bar">
                  <div
                    className="booked"
                    style={{
                      width: `${(dailyData.booked / dailyGoals) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="paid"
                    style={{
                      width: `${(dailyData.paid / dailyGoals) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="bottom-yearly">
                  <small>
                    <span></span>
                    <small className="mx-md-1">Paid</small>{" "}
                    {formatMoney(dailyData.paid)}
                  </small>
                  <small>
                    <span className="booked"></span>
                    <small className="mx-md-1">Booked</small>{" "}
                    {formatMoney(dailyData.booked)}
                  </small>
                  <small>
                    <small className="mx-md-1">Daily Goal</small>{" "}
                    {formatMoney(dailyGoals)}
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GoalsRowDisplay;
