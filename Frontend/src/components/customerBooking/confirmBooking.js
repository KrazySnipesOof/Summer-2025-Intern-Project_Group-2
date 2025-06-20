import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import { Rings } from "react-loader-spinner";

export default function ConfirmBooking({
  onEditClick,
  onConfirmClick,
  services,
  startDateTime,
  isLoading,
  paymentMethod,
}) {
  const formatDateAndTime = (dateString, hourAdd, minuteAdd) => {
    const date = moment(dateString, "ddd MMM DD YYYY hh:mm:A:ss [GMT]ZZ (z)");

    const formattedDate = date.format("dddd MMMM DD, YYYY");
    const startTime = date.format("hh:mma");
    const endTime = date
      .add(hourAdd, "hours")
      .add(minuteAdd, "minutes")
      .format("hh:mma");

    return {
      date: formattedDate,
      time: `${startTime} — ${endTime}`,
    };
  };

  const { date, time } = formatDateAndTime(
    startDateTime,
    services.reduce(
      (sum, service) => sum + (service?.serviceTime?.hours || 0),
      0
    ),
    services.reduce(
      (sum, service) => sum + (service?.serviceTime?.minutes || 0),
      0
    )
  );

  return (
    <div className="confirm-booking-wrapper">
      <div className="confirm-booking">
        <div className="services">
          <h3>
            {services.map((service) => service?.name).join(", ")}
            {`${services.map((service) =>
              service?.type === "Classes" ? " Class" : ""
            )}`}
          </h3>
          <p>Your bookings</p>
        </div>
        <div className="time">
          <h3>{date}</h3>
          <div>{time}</div>
        </div>
      </div>
      <div className="buttons">
        <Button
          disabled={isLoading}
          className="button button2"
          onClick={onEditClick}
        >
          {isLoading ? (
            <>
              <div className="submit-loader">
                <Rings
                  height="40"
                  width="40"
                  radius="10"
                  color="#1C5141"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </>
          ) : (
            <>Add Service or Edit Booking</>
          )}
        </Button>
        <Button
          disabled={isLoading}
          className="button button1"
          onClick={onConfirmClick}
        >
          {isLoading ? (
            <>
              <div className="submit-loader">
                <Rings
                  height="40"
                  width="40"
                  radius="10"
                  color="#ffffff"
                  wrapperStyle
                  wrapperClass
                />
              </div>
            </>
          ) : (
            <>Confirm & {paymentMethod === "Paid" ? "Pay" : "Book"}</>
          )}
        </Button>
      </div>
    </div>
  );
}
